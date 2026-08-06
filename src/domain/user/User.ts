// src/domain/user/User.ts
import { UserType, Zone, Department } from "../../generated/prisma/client";

export interface User {
  id: string;
  name: string;
  employeeCode: string;
  email: string | null;
  password: string;
  zone: Zone;
  userType: UserType;
  department: Department;
  isAdmin: boolean;
  isActive: boolean;
  lastLoginAt: Date | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  permissions?: string[];
}

export type SafeUser = Omit<User, "password"> & { permissions?: string[] };

export function toSafeUser(user: User): SafeUser {
  const { password, ...safe } = user;
  return safe;
}
