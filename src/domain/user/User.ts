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
}

export type SafeUser = Omit<User, "password">;

export function toSafeUser(user: User): SafeUser {
  const { password, ...safe } = user;
  return safe;
}
