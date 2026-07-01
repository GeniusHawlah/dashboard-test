import { UserRole, UserStatus } from "@/utils/prisma";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import * as z from "zod";

extendZodWithOpenApi(z);

export const AdminItemSchema = z
  .object({
    id: z.string().openapi({ example: "clx1t9j8a0001qw9m2n7p4r8s" }),
    userId: z.string().openapi({ example: "USR-2026-0001" }),
    email: z.email().openapi({ example: "admin@example.com" }),
    name: z.string().openapi({ example: "Admin User" }),
    firstName: z.string().openapi({ example: "Admin" }),
    middleName: z.string().nullable().openapi({ example: null }),
    lastName: z.string().openapi({ example: "User" }),
    title: z.string().nullable().openapi({ example: "Mr" }),
    phoneNumber: z.string().nullable().openapi({ example: "+2348012345678" }),
    passport: z.string().nullable().openapi({ example: null }),
    status: z.enum(Object.values(UserStatus) as [UserStatus, ...UserStatus[]]),
    role: z.enum(Object.values(UserRole) as [UserRole, ...UserRole[]]),
    createdAt: z.string().datetime().openapi({
      example: "2026-06-01T12:30:00.000Z",
    }),
    updatedAt: z.string().datetime().openapi({
      example: "2026-06-10T08:15:00.000Z",
    }),
  })
  .openapi("SuperAdminUser");

export const GetAdminsForSuperAdminSuccessSchema = z
  .object({
    success: z.object({
      message: z.string(),
      data: z.object({
        admins: z.array(AdminItemSchema),
      }),
      metadata: z.object({
        total: z.number(),
        page: z.number(),
        limit: z.number(),
        pages: z.number(),
      }),
    }),
  })
  .openapi("GetAdminsForSuperAdminSuccessResponse");

export const GetAdminsForSuperAdminErrorSchema = z
  .object({
    error: z.object({
      message: z.string(),
      statusCode: z.number().optional(),
    }),
  })
  .openapi("GetAdminsForSuperAdminErrorResponse");
