import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export function r2Ready() {
  return !!(process.env.R2_ENDPOINT && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY && process.env.R2_BUCKET);
}

export function r2Client() {
  return new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
}

// Driver app asks for an upload link, then PUTs the photo straight to R2.
export async function photoUploadUrl(orderId, filename) {
  const key = `deliveries/${orderId}/${Date.now()}-${filename}`.replace(/[^a-zA-Z0-9/._-]/g, "_");
  const url = await getSignedUrl(r2Client(), new PutObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key, ContentType: "image/jpeg" }), { expiresIn: 600 });
  return { uploadUrl: url, photoUrl: `${process.env.R2_PUBLIC_URL || process.env.R2_ENDPOINT}/${process.env.R2_BUCKET}/${key}` };
}
