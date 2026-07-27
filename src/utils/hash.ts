// src/utils/hash.ts
import bcrypt from "bcrypt";
import { BCRYPT_ROUNDS } from "../config/constants.js";

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export async function comparePassword(
  plain: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
