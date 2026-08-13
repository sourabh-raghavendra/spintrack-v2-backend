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
const userService = new UserService(userRepository, permissionService);
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

// ── Spindles ──────────────────────────────────────────────────────────
import { SpindleRepository } from "../infrastructure/database/SpindleRepository";
import { SpindleService } from "../domain/spindle/SpindleService";
import { SpindleController } from "../domain/spindle/SpindleController";
import { SpindleAdapter } from "../http/adapters/spindle.adapter";

const spindleRepository = new SpindleRepository();
const spindleService = new SpindleService(spindleRepository);
const spindleController = new SpindleController(spindleService);
const spindleAdapter = new SpindleAdapter(spindleController);

// ── Orders ────────────────────────────────────────────────────────────
import { OrderRepository } from "../infrastructure/database/OrderRepository";
import { OrderService } from "../domain/order/OrderService";
import { OrderController } from "../domain/order/OrderController";
import { OrderAdapter } from "../http/adapters/order.adapter";

const orderRepository = new OrderRepository();
const orderService = new OrderService(orderRepository);
const orderController = new OrderController(orderService);
const orderAdapter = new OrderAdapter(orderController);

// ── Customer Contacts ──────────────────────────────────────────────────
import { CustomerContactRepository } from "../infrastructure/database/CustomerContactRepository";
import { CustomerContactService } from "../domain/customerContact/CustomerContactService";
import { CustomerContactController } from "../domain/customerContact/CustomerContactController";
import { CustomerContactAdapter } from "../http/adapters/customerContact.adapter";

const customerContactRepository = new CustomerContactRepository();
const customerContactService = new CustomerContactService(customerContactRepository);
const customerContactController = new CustomerContactController(customerContactService);
const customerContactAdapter = new CustomerContactAdapter(customerContactController, customerRepository);

// ── Customer Portal Auth ──────────────────────────────────────────────
import { PortalAuthService } from "../domain/portalAuth/PortalAuthService";
import { PortalAuthController } from "../domain/portalAuth/PortalAuthController";
import { PortalAuthAdapter } from "../http/adapters/portalAuth.adapter";

const portalAuthService = new PortalAuthService(customerContactRepository);
const portalAuthController = new PortalAuthController(portalAuthService);
const portalAuthAdapter = new PortalAuthAdapter(portalAuthController, customerContactRepository, customerRepository);

// ── Order Report Log (Timeline) ──────────────────────────────────────
import { OrderReportLogRepository } from "../infrastructure/database/OrderReportLogRepository";
import { ReportRecordRepository } from "../infrastructure/database/ReportRecordRepository";
import { OrderReportLogService } from "../domain/reportLog/OrderReportLogService";
import { OrderReportLogController } from "../domain/reportLog/OrderReportLogController";
import { OrderReportLogAdapter } from "../http/adapters/reportLog.adapter";

const orderReportLogRepository = new OrderReportLogRepository();
const reportRecordRepository = new ReportRecordRepository();
const orderReportLogService = new OrderReportLogService(orderReportLogRepository, orderService, reportRecordRepository);
const orderReportLogController = new OrderReportLogController(orderReportLogService);
const orderReportLogAdapter = new OrderReportLogAdapter(orderReportLogController);

// ── Generic Report Fields ─────────────────────────────────────────────
import { ReportFieldService } from "../domain/reportLog/ReportFieldService";
import { ReportFieldAdapter } from "../http/adapters/reportField.adapter";

const reportFieldService = new ReportFieldService();
const reportFieldAdapter = new ReportFieldAdapter(reportFieldService);

// ── Report Personnel ──────────────────────────────────────────────────
import { ReportPersonnelService } from "../domain/reportPersonnel/ReportPersonnelService";
import { ReportPersonnelController } from "../domain/reportPersonnel/ReportPersonnelController";
import { ReportPersonnelAdapter } from "../http/adapters/ReportPersonnelAdapter";

const reportPersonnelService = new ReportPersonnelService();
const reportPersonnelController = new ReportPersonnelController(reportPersonnelService);
const reportPersonnelAdapter = new ReportPersonnelAdapter(reportPersonnelController);

// ── Notes ─────────────────────────────────────────────────────────────
import { NoteService } from "../domain/note/NoteService";
import { NoteController } from "../domain/note/NoteController";
import { NoteAdapter } from "../http/adapters/NoteAdapter";

const noteService = new NoteService();
const noteController = new NoteController(noteService);
const noteAdapter = new NoteAdapter(noteController);

// ── Media ─────────────────────────────────────────────────────────────
import { S3StorageService } from "../infrastructure/storage/S3StorageService";
import { MediaService } from "../domain/media/MediaService";
import { MediaController } from "../domain/media/MediaController";
import { MediaAdapter } from "../http/adapters/MediaAdapter";

const storageService = new S3StorageService();
const mediaService = new MediaService(storageService);
const mediaController = new MediaController(mediaService);
const mediaAdapter = new MediaAdapter(mediaController);

// ── Customer Portal Orders ────────────────────────────────────────────
import { PortalOrderService } from "../domain/portal/PortalOrderService";
import { PortalOrderController } from "../domain/portal/PortalOrderController";
import { PortalOrderAdapter } from "../http/adapters/PortalOrderAdapter";

const portalOrderService = new PortalOrderService(storageService);
const portalOrderController = new PortalOrderController(portalOrderService);
const portalOrderAdapter = new PortalOrderAdapter(portalOrderController);

// ── Final Inspection PDF ──────────────────────────────────────────────
import { FinalInspectionPdfService } from "../domain/finalInspectionPdf/FinalInspectionPdfService";
import { FinalInspectionPdfAdapter } from "../http/adapters/FinalInspectionPdfAdapter";

const finalInspectionPdfService = new FinalInspectionPdfService();
const finalInspectionPdfAdapter = new FinalInspectionPdfAdapter(finalInspectionPdfService);

// ── Analytics ─────────────────────────────────────────────────────────
import { AnalyticsService } from "../domain/analytics/AnalyticsService";
import { AnalyticsController } from "../domain/analytics/AnalyticsController";
import { AnalyticsAdapter } from "../http/adapters/analytics.adapter";

const analyticsService = new AnalyticsService();
const analyticsController = new AnalyticsController(analyticsService);
const analyticsAdapter = new AnalyticsAdapter(analyticsController);

// ── Warranty ──────────────────────────────────────────────────────────
import { WarrantyService } from "../domain/warranty/WarrantyService";
import { WarrantyCertificateService } from "../domain/warranty/WarrantyCertificateService";
import { WarrantyController } from "../domain/warranty/WarrantyController";
import { WarrantyAdapter } from "../http/adapters/warranty.adapter";

const warrantyService = new WarrantyService();
const warrantyCertificateService = new WarrantyCertificateService();
const warrantyController = new WarrantyController(warrantyService, warrantyCertificateService);
const warrantyAdapter = new WarrantyAdapter(warrantyController);

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

  // Spindles
  spindleRepository,
  spindleService,
  spindleController,
  spindleAdapter,

  // Orders
  orderRepository,
  orderService,
  orderController,
  orderAdapter,

  customerContactRepository,
  customerContactService,
  customerContactController,
  customerContactAdapter,
  portalAuthService,
  portalAuthController,
  portalAuthAdapter,

  // Order Report Logs
  orderReportLogRepository,
  orderReportLogService,
  orderReportLogController,
  orderReportLogAdapter,

  // Generic Report Fields
  reportFieldAdapter,

  // Report Personnel
  reportPersonnelAdapter,

  // Notes
  noteAdapter,

  // Media
  mediaAdapter,

  // Portal
  portalOrderAdapter,

  // Final Inspection PDF
  finalInspectionPdfAdapter,

  // Analytics
  analyticsAdapter,

  // Warranty
  warrantyAdapter,
};