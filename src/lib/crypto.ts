import CryptoJS from "crypto-js";

const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY!;

export const encryptPassword = (password: string): string => {
  return CryptoJS.AES.encrypt(password, secretKey).toString();
};

export const decryptPassword = (cipherText: string): string => {
  const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};
