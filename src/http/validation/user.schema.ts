// src/http/validation/user.schema.ts
import { z } from "zod";
import { UserType, Zone, Department } from "../../generated/prisma/client";

export const updateMeSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address").nullable().optional(),
    name: z.string().min(1, "Name cannot be empty").optional(),
  }),
});

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    employeeCode: z.string().min(1, "Employee code is required"),
    email: z.string().email("Invalid email address").nullable().optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    zone: z.nativeEnum(Zone),
    userType: z.nativeEnum(UserType),
    department: z.nativeEnum(Department),
    isAdmin: z.boolean().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name cannot be empty").optional(),
    employeeCode: z.string().min(1, "Employee code cannot be empty").optional(),
    email: z.string().email("Invalid email address").nullable().optional(),
    isActive: z.boolean().optional(),
    isAdmin: z.boolean().optional(),
    zone: z.nativeEnum(Zone).optional(),
    userType: z.nativeEnum(UserType).optional(),
    department: z.nativeEnum(Department).optional(),
  }),
  params: z.object({
    id: z.string().min(1, "User ID is required"),
  }),
});

export const userIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, "User ID is required"),
  }),
});

export type UpdateMeInput = z.infer<typeof updateMeSchema>["body"];
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>["body"];
export type UpdateUserInput = z.infer<typeof updateUserSchema>["body"];

export const adminResetPasswordSchema = z.object({
  params: userIdParamSchema.shape.params,
  body: z.object({
    newPassword: z.string().min(8), // match whatever policy your other password schemas use
  }),
});
