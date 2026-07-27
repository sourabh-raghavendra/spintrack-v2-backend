// src/domain/auth/AuthController.ts
import { AuthService, AuthResult, LoginInput } from "./AuthService";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async login(input: LoginInput): Promise<AuthResult> {
    return this.authService.login(input);
  }
}
