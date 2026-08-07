// src/utils/customerJwt.ts
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface CustomerJwtPayload {
  contactId: string;
  customerId: string;
}

export function signCustomerToken(payload: CustomerJwtPayload): string {
  return jwt.sign(payload, env.CUSTOMER_JWT_SECRET, {
    expiresIn: `${env.CUSTOMER_JWT_EXPIRY_HOURS}h`,
  });
}

export function verifyCustomerToken(token: string): CustomerJwtPayload {
  return jwt.verify(token, env.CUSTOMER_JWT_SECRET) as CustomerJwtPayload;
}
