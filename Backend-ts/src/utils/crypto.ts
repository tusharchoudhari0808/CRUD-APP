import crypto from "crypto";

/* ============================================================
   Encryption Configuration
   - AES-256-GCM for authenticated encryption
   - SECRET is derived from environment variable
============================================================ */
const ALGO = "aes-256-gcm";
const SECRET = crypto.scryptSync(process.env.SECRET!, "salt", 32);

/* ============================================================
   encryptToken
   - Encrypts a string (e.g., JWT) and returns a base64url string
   - Format: [IV (16 bytes)] + [Auth Tag (16 bytes)] + [Encrypted Data]
============================================================ */
export function encryptToken(token: string): string {
  // 1. Generate a random Initialization Vector (IV)
  const iv = crypto.randomBytes(16);

  // 2. Create cipher instance
  const cipher = crypto.createCipheriv(ALGO, SECRET, iv);

  // 3. Encrypt the token
  const encrypted = Buffer.concat([cipher.update(token, "utf-8"), cipher.final()]);

  // 4. Get authentication tag for GCM
  const authTag = cipher.getAuthTag();

  // 5. Combine IV + Auth Tag + Encrypted Data and convert to base64url
  return Buffer.concat([iv, authTag, encrypted]).toString("base64url");
}

/* ============================================================
   decryptToken
   - Decrypts a base64url encrypted string (from encryptToken)
   - Returns the original plaintext token
============================================================ */
export function decryptToken(encrypted: string): string {
  // 1. Convert base64url string back to Buffer
  const buf = Buffer.from(encrypted, "base64url");

  // 2. Extract IV, Auth Tag, and Encrypted Data
  const iv = buf.subarray(0, 16);
  const authTag = buf.subarray(16, 32);
  const encryptedData = buf.subarray(32);

  // 3. Create decipher instance
  const decipher = crypto.createDecipheriv(ALGO, SECRET, iv);
  decipher.setAuthTag(authTag); // set authentication tag for GCM

  // 4. Decrypt data
  const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

  return decrypted.toString("utf-8");
}
