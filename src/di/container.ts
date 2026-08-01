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

// ── Tapers ────────────────────────────────────────────────────────────
import { TaperRepository } from "../infrastructure/database/TaperRepository";
import { TaperService } from "../domain/taper/TaperService";
import { TaperController } from "../domain/taper/TaperController";
import { TaperAdapter } from "../http/adapters/taper.adapter";

const taperRepository = new TaperRepository();
const taperService = new TaperService(taperRepository);
const taperController = new TaperController(taperService);
const taperAdapter = new TaperAdapter(taperController);

// ── Customers ─────────────────────────────────────────────────────────
import { CustomerRepository } from "../infrastructure/database/CustomerRepository";
import { CustomerService } from "../domain/customer/CustomerService";
import { CustomerController } from "../domain/customer/CustomerController";
import { CustomerAdapter } from "../http/adapters/customer.adapter";

const customerRepository = new CustomerRepository();
const customerService = new CustomerService(customerRepository);
const customerController = new CustomerController(customerService);
const customerAdapter = new CustomerAdapter(customerController);

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

  // Tapers
  taperRepository,
  taperService,
  taperController,
  taperAdapter,

  // Customers
  customerRepository,
  customerService,
  customerController,
  customerAdapter,
};