// ── Permissions ───────────────────────────────────────────────────────
import { PermissionRepository } from "../infrastructure/database/PermissionRepository";
import { PermissionService } from "../domain/permission/PermissionService";
import { PermissionController } from "../domain/permission/PermissionController";
import { PermissionAdapter } from "../http/adapters/permission.adapter";

const permissionRepository = new PermissionRepository();
const permissionService = new PermissionService(permissionRepository);
const permissionController = new PermissionController(permissionService);
const permissionAdapter = new PermissionAdapter(permissionController);

// ── Users ─────────────────────────────────────────────────────────────
import { UserRepository } from "../infrastructure/database/UserRepository";
import { UserService } from "../domain/user/UserService";
import { UserController } from "../domain/user/UserController";
import { UserAdapter } from "../http/adapters/user.adapter";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);
const userAdapter = new UserAdapter(userController);

// ── Auth ──────────────────────────────────────────────────────────────
// Stateless JWT only — no sessions, no refresh tokens, no password
// reset/email verification tokens, no social login.
import { AuthService } from "../domain/auth/AuthService";
import { AuthController } from "../domain/auth/AuthController";
import { AuthAdapter } from "../http/adapters/auth.adapter";

const authService = new AuthService(userRepository, permissionService);
const authController = new AuthController(authService);
const authAdapter = new AuthAdapter(authController);

// ── Exports ───────────────────────────────────────────────────────────
export {
  // Permissions
  permissionRepository,
  permissionService,
  permissionController,
  permissionAdapter,

  // Users
  userRepository,
  userService,
  userController,
  userAdapter,

  // Auth
  authService,
  authController,
  authAdapter,
};