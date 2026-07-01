import "server-only";

import crypto from "crypto";

export type CloudinaryProtectedAsset = {
  publicId: string;
  format: string;
  resourceType: "image";
  deliveryType: "authenticated";
};

const PROTECTED_ID_CARD_ROUTE = "/api/protected-media/id-card";

function signDeliveryPath(pathToSign: string, apiSecret: string) {
  return crypto
    .createHash("sha1")
    .update(`${pathToSign}${apiSecret}`)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .slice(0, 8);
}

export function encodeProtectedAsset(asset: CloudinaryProtectedAsset) {
  return Buffer.from(JSON.stringify(asset), "utf8").toString("base64url");
}

export function decodeProtectedAsset(
  value: string,
): CloudinaryProtectedAsset | null {
  try {
    const parsed = JSON.parse(
      Buffer.from(value, "base64url").toString("utf8"),
    ) as Partial<CloudinaryProtectedAsset>;

    if (
      parsed.resourceType !== "image" ||
      parsed.deliveryType !== "authenticated" ||
      typeof parsed.publicId !== "string" ||
      typeof parsed.format !== "string"
    ) {
      return null;
    }

    return {
      publicId: parsed.publicId,
      format: parsed.format,
      resourceType: "image",
      deliveryType: "authenticated",
    };
  } catch {
    return null;
  }
}

export function getProtectedIdCardAssetFromUrl(
  value: string | null | undefined,
) {
  if (!value?.startsWith(PROTECTED_ID_CARD_ROUTE)) {
    return null;
  }

  const query = value.split("?")[1];
  const asset = new URLSearchParams(query).get("asset");

  return asset ? decodeProtectedAsset(asset) : null;
}

export function getSignedAuthenticatedImageUrl(
  asset: CloudinaryProtectedAsset,
) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiSecret) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME and CLOUDINARY_API_SECRET.",
    );
  }

  const pathToSign = `${asset.publicId}.${asset.format}`;
  const signature = signDeliveryPath(pathToSign, apiSecret);

  return `https://res.cloudinary.com/${cloudName}/image/authenticated/s--${signature}--/${pathToSign}`;
}
