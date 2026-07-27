import { IUserRepository } from "../user/IUserRepository";
import { PermissionService } from "../permission/PermissionService";
import { comparePassword } from "../../utils/hash";
import { signToken } from "../../utils/jwt";
import { UnauthorizedError } from "../../errors/HttpError";
import { ErrorCodes } from "../../errors/errorCodes";
import { User } from "../user/User";

export interface LoginInput {
  employeeCode: string;
  password: string;
}

export interface AuthResult {
  accessToken: string;
  user: Pick<User, "id" | "name" | "employeeCode" | "email" | "userType" | "isAdmin" | "zone" | "department">;
  permissions: string[];
}

export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly permissionService: PermissionService,
  ) {}

  async login(input: LoginInput): Promise<AuthResult> {
    const user = await this.userRepository.findByEmployeeCode(input.employeeCode);
    if (!user || !user.password) {
      throw new UnauthorizedError(
        "Invalid credentials",
        ErrorCodes.INVALID_CREDENTIALS,
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedError(
        "Account is deactivated",
        ErrorCodes.USER_INACTIVE,
      );
    }

    const valid = await comparePassword(input.password, user.password);
    if (!valid) {
      throw new UnauthorizedError(
        "Invalid credentials",
        ErrorCodes.INVALID_CREDENTIALS,
      );
    }

    await this.userRepository.update(user.id, { lastLoginAt: new Date() });

    const permissions = await this.permissionService.getUserPermissions(
      user.id,
    );

    const accessToken = signToken({
      userId: user.id,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        employeeCode: user.employeeCode,
        email: user.email,
        userType: user.userType,
        isAdmin: user.isAdmin,
        zone: user.zone,
        department: user.department,
      },
      permissions,
    };
  }
}
