// src/types/express.d.ts
import { RequestUser } from "./common";

declare global {
  namespace Express {
    interface Request {
      requestId: string;
      user?: RequestUser;
      customerAuth?: {
        contactId: string;
        customerId: string;
      };
    }
  }
}

export {};
