// src/domain/spindle/SpindleService.ts
import { ISpindleRepository, SpindleListFilters, SpindleWithTaper } from "./ISpindleRepository";
import { Spindle } from "../../generated/prisma/client";
import { NotFoundError, ConflictError } from "../../errors/HttpError";
import { ErrorCodes } from "../../errors/errorCodes";

export class SpindleService {
  constructor(private readonly spindleRepository: ISpindleRepository) {}

  async list(filters: SpindleListFilters): Promise<{
    items: SpindleWithTaper[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const { items, total } = await this.spindleRepository.findAll(filters);
    return {
      items,
      total,
      page: filters.page,
      pageSize: filters.pageSize,
    };
  }

  async getById(id: string): Promise<SpindleWithTaper> {
    const spindle = await this.spindleRepository.findById(id);
    if (!spindle) {
      throw new NotFoundError(
        `Spindle with ID "${id}" not found`,
        ErrorCodes.NOT_FOUND,
      );
    }
    return spindle;
  }

  async lookupBySerialNumber(serialNumber: string): Promise<SpindleWithTaper | null> {
    return this.spindleRepository.findBySerialNumberExact(serialNumber);
  }

  async createSpindle(data: {
    serialNumber: string;
    make: string;
    type: string;
    taperId: string;
    maxRpm?: string | null;
    createdById: string;
  }): Promise<Spindle> {
    try {
      return await this.spindleRepository.create(data);
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new ConflictError(
          `Spindle with serial number "${data.serialNumber}" already exists`,
          ErrorCodes.USER_ALREADY_EXISTS,
        );
      }
      if (error.code === "P2003") {
        throw new NotFoundError(
          `Taper "${data.taperId}" does not exist`,
          ErrorCodes.NOT_FOUND,
        );
      }
      throw error;
    }
  }

  async updateSpindle(
    id: string,
    data: Partial<{
      serialNumber: string;
      make: string;
      type: string;
      taperId: string;
      maxRpm: string | null;
    }>,
  ): Promise<Spindle> {
    const spindle = await this.spindleRepository.findById(id);
    if (!spindle) {
      throw new NotFoundError(
        `Spindle with ID "${id}" not found`,
        ErrorCodes.NOT_FOUND,
      );
    }

    try {
      return await this.spindleRepository.update(id, data);
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new ConflictError(
          `Spindle with serial number "${data.serialNumber}" already exists`,
          ErrorCodes.USER_ALREADY_EXISTS,
        );
      }
      if (error.code === "P2003") {
        throw new NotFoundError(
          `Taper "${data.taperId}" does not exist`,
          ErrorCodes.NOT_FOUND,
        );
      }
      throw error;
    }
  }
}
