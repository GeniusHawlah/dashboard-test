"use server";

import {
  getProtectedIdCardAssetFromUrl,
  getSignedAuthenticatedImageUrl,
} from "@/utils/protectedMedia";

export default async function resolveProtectedIdCardUrlAction(
  value: string,
): Promise<string | null> {
  const asset = getProtectedIdCardAssetFromUrl(value);

  if (!asset) {
    return null;
  }

  return getSignedAuthenticatedImageUrl(asset);
}

