import crypto from "crypto";

const ALGO = "aes-256-gcm";
const SECRET = crypto.scryptSync(process.env.SECRET!, "salt", 32);

export function encryptToken(token: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGO, SECRET, iv);

  const encrypted = Buffer.concat([cipher.update(token, "utf-8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return Buffer.concat([iv, authTag, encrypted]).toString("base64url");
}

export function decryptToken(encrypted: string): string {
  const buf = Buffer.from(encrypted, "base64url");

  const iv = buf.subarray(0, 16);
  const authTag = buf.subarray(16, 32);
  const encryptedData = buf.subarray(32);

  const decipher = crypto.createDecipheriv(ALGO, SECRET, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
  return decrypted.toString("utf-8");
}
