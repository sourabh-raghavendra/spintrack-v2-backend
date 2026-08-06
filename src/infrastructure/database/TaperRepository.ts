// src/infrastructure/database/TaperRepository.ts
import { BaseRepository, FindAllParams } from "./BaseRepository";
import { ITaperRepository, TaperWithSpecs } from "../../domain/taper/ITaperRepository";
import { Taper, TaperSpec } from "../../generated/prisma/client";
import { PrismaClient } from "../../generated/prisma/client";

export class TaperRepository
  extends BaseRepository<TaperWithSpecs>
  implements ITaperRepository
{
  constructor(client?: PrismaClient) {
    super(client);
  }

  // ── ITaperRepository & BaseRepository common queries ────────────────
  async findAll(params?: FindAllParams): Promise<TaperWithSpecs[]> {
    const pagination = params?.page || params?.limit ? this.getPaginationParams(params) : {};
    return this.db.taper.findMany({
      include: { specs: true },
      ...pagination,
      orderBy: params?.sortBy ? this.getSortParams(params) : { taperType: "asc" },
    });
  }

  async findById(id: string): Promise<TaperWithSpecs | null> {
    return this.db.taper.findUnique({
      where: { id },
      include: { specs: true },
    });
  }

  async findByType(taperType: string): Promise<TaperWithSpecs | null> {
    return this.db.taper.findUnique({
      where: { taperType },
      include: { specs: true },
    });
  }

  // Compatible implementation of create
  async create(data: string | { taperType: string }): Promise<any> {
    const taperType = typeof data === "string" ? data : data.taperType;
    return this.db.taper.create({
      data: { taperType },
      include: { specs: true },
    });
  }

  // Compatible implementation of update
  async update(id: string, data: string | { taperType: string }): Promise<any> {
    const taperType = typeof data === "string" ? data : data.taperType;
    return this.db.taper.update({
      where: { id },
      data: { taperType },
      include: { specs: true },
    });
  }

  async hardDelete(id: string): Promise<void> {
    await this.db.taper.delete({ where: { id } });
  }

  async delete(id: string): Promise<void> {
    await this.hardDelete(id);
  }

  // ── Spec Operations ────────────────────────────────────────────────
  async addSpec(
    taperId: string,
    data: {
      specKey: string;
      label: string;
      min: number;
      max: number;
      unit: string;
      include: boolean;
    },
  ): Promise<TaperSpec> {
    return this.db.taperSpec.create({
      data: {
        taperId,
        specKey: data.specKey,
        label: data.label,
        min: data.min,
        max: data.max,
        unit: data.unit,
        include: data.include,
      },
    });
  }

  async updateSpec(
    taperId: string,
    specKey: string,
    data: Partial<{
      label: string;
      min: number;
      max: number;
      unit: string;
      include: boolean;
    }>,
  ): Promise<TaperSpec> {
    const existing = await this.db.taperSpec.findUnique({
      where: {
        taperId_specKey: {
          taperId,
          specKey,
        },
      },
    });

    if (existing) {
      return this.db.taperSpec.update({
        where: {
          taperId_specKey: {
            taperId,
            specKey,
          },
        },
        data,
      });
    } else {
      return this.db.taperSpec.create({
        data: {
          taperId,
          specKey,
          label: data.label ?? specKey,
          min: data.min ?? 0,
          max: data.max ?? 0,
          unit: data.unit ?? "",
          include: data.include ?? false,
        },
      });
    }
  }

  async deleteSpec(taperId: string, specKey: string): Promise<void> {
    await this.db.taperSpec.delete({
      where: {
        taperId_specKey: {
          taperId,
          specKey,
        },
      },
    });
  }
}
