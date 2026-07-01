"use client";

import { Button } from "@/components/ui/button";
import {
  ImageInputValue,
  ImageUploadMimeType,
  ImageUploadPayload,
  isImageUploadPayload,
} from "@/utils/imageUploadTypes";
import { Icon } from "@iconify-icon/react";
import { ChangeEvent, useMemo, useRef, useState } from "react";

type ImageKind = "passport" | "idCard" | "programCover";
type CompressableFile = File | HTMLCanvasElement;

const IMAGE_MAX_BYTES: Record<ImageKind, number> = {
  passport: 200_000,
  idCard: 400_000,
  programCover: 800_000,
};

interface ImageUploadInputProps {
  label: string;
  value: ImageInputValue;
  kind: ImageKind;
  onChange: (value: ImageInputValue) => void;
  required?: boolean;
  className?: string;
}

const SETTINGS: Record<
  ImageKind,
  { maxWidth: number; maxHeight: number; quality: number; maxBytes: number }
> = {
  passport: { maxWidth: 420, maxHeight: 420, quality: 0.74, maxBytes: 200_000 },
  idCard: { maxWidth: 860, maxHeight: 560, quality: 0.76, maxBytes: 400_000 },
  programCover: { maxWidth: 1440, maxHeight: 960, quality: 0.82, maxBytes: 800_000 },
};

const PDF_MIME_TYPE = "application/pdf";

function getPreview(value: ImageInputValue) {
  if (isImageUploadPayload(value)) return value.dataUrl;
  if (typeof value === "string" && value.trim()) return value;
  return "";
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image."));
    };
    image.src = url;
  });
}

async function renderFirstPdfPage(file: File) {
  const pdfjs = await import("pdfjs-dist");

  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.mjs",
    import.meta.url,
  ).toString();

  const documentData = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: documentData }).promise;
  const page = await pdf.getPage(1);
  const baseViewport = page.getViewport({ scale: 1 });
  const maxSourceWidth = 1400;
  const scale = Math.min(maxSourceWidth / baseViewport.width, 2);
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not prepare PDF preview.");
  }

  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);

  await page.render({ canvas, canvasContext: context, viewport }).promise;
  pdf.destroy();

  return canvas;
}

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not prepare image."));
    reader.readAsDataURL(blob);
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: ImageUploadMimeType,
  quality: number,
) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Could not compress image."));
      },
      mimeType,
      quality,
    );
  });
}

async function compressImage(file: CompressableFile, kind: ImageKind) {
  const settings = SETTINGS[kind];
  const isCanvasSource = file instanceof HTMLCanvasElement;
  let source: HTMLCanvasElement | HTMLImageElement;
  let sourceSize: { width: number; height: number };

  if (isCanvasSource) {
    source = file;
    sourceSize = { width: file.width, height: file.height };
  } else {
    source = await loadImage(file);
    sourceSize = { width: source.naturalWidth, height: source.naturalHeight };
  }

  const scale = Math.min(
    settings.maxWidth / sourceSize.width,
    settings.maxHeight / sourceSize.height,
    1,
  );
  const canvas = document.createElement("canvas");

  canvas.width = Math.max(1, Math.round(sourceSize.width * scale));
  canvas.height = Math.max(1, Math.round(sourceSize.height * scale));

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not prepare image.");

  context.drawImage(source, 0, 0, canvas.width, canvas.height);

  let quality = settings.quality;
  let blob = await canvasToBlob(canvas, "image/webp", quality);

  while (blob.size > settings.maxBytes && quality > 0.5) {
    quality -= 0.08;
    blob = await canvasToBlob(canvas, "image/webp", quality);
  }

  if (blob.size > settings.maxBytes) {
    throw new Error("Please choose a smaller image.");
  }

  return {
    dataUrl: await blobToDataUrl(blob),
    fileName: isCanvasSource ? "id-card.pdf" : file.name,
    mimeType: "image/webp" as ImageUploadMimeType,
    size: blob.size,
  } satisfies ImageUploadPayload;
}

async function prepareUploadPayload(file: File, kind: ImageKind) {
  if (file.type === PDF_MIME_TYPE) {
    if (kind !== "idCard") {
      throw new Error("PDF upload is only supported for ID cards.");
    }

    return compressImage(await renderFirstPdfPage(file), kind);
  }

  return compressImage(file, kind);
}

export function ImageUploadInput({
  label,
  value,
  kind,
  onChange,
  required,
  className,
}: ImageUploadInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const preview = useMemo(() => getPreview(value), [value]);
  const sizeLabel = isImageUploadPayload(value)
    ? `${Math.ceil(value.size / 1024)}KB`
    : "";
  const maxSizeLabel = `${Math.round(IMAGE_MAX_BYTES[kind] / 1024)}KB`;
  const isProgramCover = kind === "programCover";

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setError("");
      onChange(await prepareUploadPayload(file, kind));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      event.target.value = "";
    }
  }

  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <label className="text-xs font-medium sm:text-sm">
          {label}
          {required ? <span className="text-red-500"> *</span> : null}
        </label>
        {sizeLabel ? (
          <span className="text-[11px] text-muted-foreground">{sizeLabel}</span>
        ) : null}
      </div>
      {/* <p className="mb-2 text-[11px] text-slate-500">
        Max size: {maxSizeLabel}
      </p> */}

      <div
        className={[
          "flex gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-2",
          isProgramCover ? "min-h-28 items-stretch" : "min-h-24 items-center",
        ].join(" ")}
      >
        <div
          className={[
            "grid shrink-0 place-items-center overflow-hidden rounded-lg bg-white ring-1 ring-black/5",
            isProgramCover ? "h-24 w-36" : "h-20 w-20",
          ].join(" ")}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt={label}
              className="h-full w-full object-cover"
            />
          ) : (
            <Icon icon="ph:image" className="text-2xl text-slate-400" />
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept={
              kind === "idCard"
                ? "image/jpeg,image/png,image/webp,application/pdf"
                : "image/jpeg,image/png,image/webp"
            }
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => inputRef.current?.click()}
              className="h-8 gap-1.5 rounded-lg px-3 text-xs"
            >
              <Icon icon="ph:upload-simple" className="text-sm" />
              Choose image
            </Button>
            {preview ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => onChange("")}
                className="h-8 gap-1.5 rounded-lg px-3 text-xs text-gray-600"
              >
                <Icon icon="ph:x" className="text-sm" />
                Clear
              </Button>
            ) : null}
          </div>
          {error ? <p className="text-[11px] text-red-600">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}
