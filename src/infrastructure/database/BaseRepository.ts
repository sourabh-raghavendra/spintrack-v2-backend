// src/infrastructure/database/BaseRepository.ts
import prisma from "../../config/database";
import { PrismaClient } from "../../generated/prisma/client";

// ── Types ─────────────────────────────────────────────────────────────

export interface FindAllParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: Record<string, unknown>;
}

export interface TransactionClient {
  $transaction: PrismaClient["$transaction"];
}

// ── Base Repository ───────────────────────────────────────────────────

export abstract class BaseRepository<T> {
  protected db: PrismaClient;

  constructor(client?: PrismaClient) {
    this.db = client ?? prisma;
  }

  // ── Abstract methods — each repository implements these ───────────
  abstract findById(id: string): Promise<T | null>;
  abstract findAll(params?: FindAllParams): Promise<T[]>;
  abstract create(data: unknown): Promise<T>;
  abstract update(id: string, data: unknown): Promise<T>;
  abstract hardDelete(id: string): Promise<void>;

  // ── Soft delete — only implemented by repositories that need it ───
  // Repositories without soft delete (Session, Token, Settings)
  // simply don't call these methods
  async softDelete(id: string): Promise<void> {
    throw new Error(
      `softDelete not implemented for ${this.constructor.name}. ` +
        `Override this method or use hardDelete instead.`,
    );
  }

  async restore(id: string): Promise<void> {
    throw new Error(
      `restore not implemented for ${this.constructor.name}. ` +
        `Override this method or use hardDelete instead.`,
    );
  }

  // ── Transaction helper ────────────────────────────────────────────
  async transaction<R>(fn: (tx: PrismaClient) => Promise<R>): Promise<R> {
    return this.db.$transaction((tx) =>
      fn(tx as unknown as PrismaClient),
    ) as Promise<R>;
  }

  // ── Pagination helper ─────────────────────────────────────────────
  protected getPaginationParams(params?: FindAllParams): {
    skip: number;
    take: number;
  } {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    return {
      skip: (page - 1) * limit,
      take: limit,
    };
  }

  // ── Sort helper ───────────────────────────────────────────────────
  protected getSortParams(
    params?: FindAllParams,
  ): Record<string, "asc" | "desc"> {
    return {
      [params?.sortBy ?? "createdAt"]: params?.sortOrder ?? "desc",
    };
  }
}
