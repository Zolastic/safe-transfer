import { env } from "@/env";
import * as crypto from "crypto";

function splitEncryptedText(encryptedText: string) {
  return {
    encryptedDataString: encryptedText.slice(56, -32),
    ivString: encryptedText.slice(0, 24),
    assocDataString: encryptedText.slice(24, 56),
    tagString: encryptedText.slice(-32),
  };
}

function ensureKeyLength(key: string, length = 32): Buffer {
  const bufferKey = Buffer.from(key, "utf-8");
  if (bufferKey.length > length) {
    return bufferKey.slice(0, length);
  }
  if (bufferKey.length < length) {
    const paddedKey = Buffer.alloc(length);
    bufferKey.copy(paddedKey);
    return paddedKey;
  }
  return bufferKey;
}

export default class Encryption {
  encoding: BufferEncoding = "hex";
  key: Buffer = ensureKeyLength(env.CRYPTO_KEY); // env.CRYPTO_KEY should be a 32 BYTE key

  encrypt(plaintext: string) {
    console.log("Encrypting: ", plaintext, this.key);

    try {
      const iv = crypto.randomBytes(12);
      const assocData = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv("chacha20-poly1305", this.key, iv, {
        authTagLength: 16,
      });

      cipher.setAAD(assocData, {
        plaintextLength: Buffer.byteLength(plaintext),
      });

      const encrypted = Buffer.concat([
        cipher.update(plaintext, "utf-8"),
        cipher.final(),
      ]);
      const tag = cipher.getAuthTag();

      return (
        iv.toString(this.encoding) +
        assocData.toString(this.encoding) +
        encrypted.toString(this.encoding) +
        tag.toString(this.encoding)
      );
    } catch (e) {
      console.error(e);
    }
  }

  decrypt(cipherText: string) {
    const { encryptedDataString, ivString, assocDataString, tagString } =
      splitEncryptedText(cipherText);

    try {
      const iv = Buffer.from(ivString, this.encoding);
      const encryptedText = Buffer.from(encryptedDataString, this.encoding);
      const tag = Buffer.from(tagString, this.encoding);

      const decipher = crypto.createDecipheriv(
        "chacha20-poly1305",
        this.key,
        iv,
        { authTagLength: 16 },
      );
      decipher.setAAD(Buffer.from(assocDataString, this.encoding), {
        plaintextLength: encryptedDataString.length,
      });
      decipher.setAuthTag(Buffer.from(tag));

      const decrypted = decipher.update(encryptedText);
      return Buffer.concat([decrypted, decipher.final()]).toString();
    } catch (e) {
      console.error(e);
    }
  }
}
