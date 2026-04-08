// import CryptoJS from "crypto-js";

// const secretKey = import.meta.env.VITE_SECRET_KEY;

// export const encryptData = (data) => {
//   if (!data) return null;
//   return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
// };

// export const decryptData = (cipherText) => {
//   if (!cipherText) return null;
//   const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
//   return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
// };

import CryptoJS from 'crypto-js';

const secretKey = import.meta.env.VITE_SECRET_KEY;

export const encryptData = (data) => {
  if (data === null || data === undefined) return null;

  try {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
  } catch (error) {
    console.error('Encryption failed:', error);
    return null;
  }
};

export const decryptData = (cipherText) => {
  if (!cipherText || typeof cipherText !== 'string') return null;

  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    // If key is wrong or data corrupted, decrypted will be empty
    if (!decrypted) {
      console.warn('Invalid or corrupted encrypted data');
      return null;
    }

    return JSON.parse(decrypted);
  } catch (error) {
    console.warn('Decryption failed:', error);
    return null;
  }
};
