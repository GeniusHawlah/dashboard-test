import "server-only";

import crypto from "crypto";
import resolveProtectedIdCardUrlAction from "@/actions/protected-media-action/resolveProtectedIdCardUrlAction";
import {
  getProtectedIdCardAssetFromUrl,
  getSignedAuthenticatedImageUrl,
} from "@/utils/protectedMedia";
import {
  IMAGE_UPLOAD_MIME_TYPES,
  ImageInputValue,
  ImageUploadPayload,
  isImageUploadPayload,
} from "@/utils/imageUploadTypes";
const UPLOAD_LIMITS: Record<UploadKind, number> = {
  passport: 200 * 1024,
  "id-card": 400 * 1024,
  "program-cover": 800 * 1024,
};

type UploadKind = "passport" | "id-card" | "program-cover";
type CloudinaryDeliveryType = "upload" | "authenticated";

interface ResolveImageOptions {
  kind: UploadKind;
  folder?: string;
  publicIdPrefix?: string;
  existingValue?: string | null;
}

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
    );
  }

  return { cloudName, apiKey, apiSecret };
}

function estimateDataUrlBytes(dataUrl: string) {
  const base64 = dataUrl.split(",")[1] ?? "";
  return Math.ceil((base64.length * 3) / 4);
}

function assertValidPayload(payload: ImageUploadPayload, maxBytes: number) {
  if (!IMAGE_UPLOAD_MIME_TYPES.includes(payload.mimeType)) {
    throw new Error("Unsupported image type. Use JPG, PNG, or WebP.");
  }

  if (!/^data:image\/(jpeg|jpg|png|webp);base64,/i.test(payload.dataUrl)) {
    throw new Error("Image upload data is invalid.");
  }

  const byteSize = estimateDataUrlBytes(payload.dataUrl);
  if (byteSize > maxBytes || payload.size > maxBytes) {
    throw new Error(
      `Image must be smaller than ${Math.ceil(maxBytes / 1024)}KB after compression.`,
    );
  }
}

function signUploadParams(
  params: Record<string, string | number>,
  apiSecret: string,
) {
  const signatureBase = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return crypto
    .createHash("sha1")
    .update(`${signatureBase}${apiSecret}`)
    .digest("hex");
}

function sanitizePublicIdPart(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function getCloudinaryPublicIdFromUrl(value: string | null | undefined) {
  if (!value) return null;

  const protectedAsset = getProtectedIdCardAssetFromUrl(value);
  if (protectedAsset) return protectedAsset.publicId;

  try {
    const url = new URL(value);
    const uploadMarker = "/image/upload/";
    const markerIndex = url.pathname.indexOf(uploadMarker);

    if (markerIndex === -1) return null;

    const assetPath = decodeURIComponent(
      url.pathname.slice(markerIndex + uploadMarker.length),
    );
    const withoutVersion = assetPath.replace(/^v\d+\//, "");
    const extensionIndex = withoutVersion.lastIndexOf(".");

    return extensionIndex === -1
      ? withoutVersion
      : withoutVersion.slice(0, extensionIndex);
  } catch {
    return null;
  }
}

async function deleteCloudinaryAsset(
  publicId: string,
  deliveryType: CloudinaryDeliveryType,
) {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign: Record<string, string | number> = {
    invalidate: "true",
    public_id: publicId,
    timestamp,
    type: deliveryType,
  };

  const signature = signUploadParams(paramsToSign, apiSecret);
  const formData = new FormData();

  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("public_id", publicId);
  formData.append("invalidate", "true");
  formData.append("type", deliveryType);
  formData.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    const result = (await response.json().catch(() => null)) as {
      error?: { message?: string };
    } | null;

    console.warn(
      "Cloudinary asset deletion failed:",
      result?.error?.message || response.statusText,
    );
    return false;
  }

  return true;
}

async function uploadPayloadToCloudinary(
  payload: ImageUploadPayload,
  options: ResolveImageOptions,
) {
  assertValidPayload(payload, UPLOAD_LIMITS[options.kind]);

  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const deliveryType: CloudinaryDeliveryType =
    options.kind === "id-card" ? "authenticated" : "upload";
  const timestamp = Math.floor(Date.now() / 1000);
  const rootFolder = process.env.CLOUDINARY_UPLOAD_FOLDER || "GoFinance_SIF";
  const existingPublicId = getCloudinaryPublicIdFromUrl(options.existingValue);
  const folder = `${rootFolder}/${options.folder || options.kind}`;
  const publicIdPrefix = sanitizePublicIdPart(
    options.publicIdPrefix || options.kind,
  );
  const publicId = `${publicIdPrefix}-${crypto.randomUUID()}`;
  const paramsToSign: Record<string, string | number> = {
    public_id: publicId,
    timestamp,
    type: deliveryType,
  };

  if (folder) {
    paramsToSign.folder = folder;
  }

  const signature = signUploadParams(paramsToSign, apiSecret);
  const formData = new FormData();

  formData.append("file", payload.dataUrl);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  if (folder) {
    formData.append("folder", folder);
  }
  formData.append("public_id", publicId);
  formData.append("type", deliveryType);
  formData.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  const result = (await response.json().catch(() => null)) as {
    secure_url?: string;
    public_id?: string;
    format?: string;
    resource_type?: string;
    type?: string;
    error?: { message?: string };
  } | null;

  if (!response.ok || !result?.secure_url || !result.public_id) {
    throw new Error(
      result?.error?.message || "Image upload to Cloudinary failed.",
    );
  }

  if (existingPublicId && existingPublicId !== result.public_id) {
    await deleteCloudinaryAsset(existingPublicId, deliveryType);
  }

  if (deliveryType === "authenticated") {
    if (!result.format) {
      throw new Error("Cloudinary did not return an ID card file format.");
    }

    return getSignedAuthenticatedImageUrl({
      publicId: result.public_id,
      format: result.format,
      resourceType: "image",
      deliveryType: "authenticated",
    });
  }

  return result.secure_url;
}

export async function resolveImageInput(
  value: ImageInputValue,
  options: ResolveImageOptions,
) {
  if (isImageUploadPayload(value)) {
    return uploadPayloadToCloudinary(value, options);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (options.kind === "id-card") {
      const resolved = await resolveProtectedIdCardUrlAction(trimmed);

      if (resolved) {
        return resolved;
      }
    }

    return trimmed;
  }

  return "";
}
