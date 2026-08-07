// src/domain/portalAuth/PortalAuthController.ts
import { PortalAuthService } from "./PortalAuthService";
import { CustomerContact } from "../../generated/prisma/client";

export class PortalAuthController {
  constructor(private readonly portalAuthService: PortalAuthService) {}

  async login(email: string, plainPassword: string): Promise<{ token: string; contact: CustomerContact }> {
    return this.portalAuthService.login(email, plainPassword);
  }
}
