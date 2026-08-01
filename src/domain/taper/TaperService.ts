// src/domain/taper/TaperService.ts
import { ITaperRepository, TaperWithSpecs } from "./ITaperRepository";
import { Taper, TaperSpec } from "../../generated/prisma/client";
import { NotFoundError, ConflictError } from "../../errors/HttpError";
import { ErrorCodes } from "../../errors/errorCodes";

export class TaperService {
  constructor(private readonly taperRepository: ITaperRepository) {}

  async findAll(): Promise<TaperWithSpecs[]> {
    return this.taperRepository.findAll();
  }

  async findById(id: string): Promise<TaperWithSpecs> {
    const taper = await this.taperRepository.findById(id);
    if (!taper) {
      throw new NotFoundError(`Taper with ID "${id}" not found`, ErrorCodes.NOT_FOUND);
    }
    return taper;
  }

  async createTaper(taperType: string): Promise<Taper> {
    try {
      return await this.taperRepository.create(taperType);
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new ConflictError(
          `Taper type "${taperType}" already exists`,
          ErrorCodes.USER_ALREADY_EXISTS,
        );
      }
      throw error;
    }
  }

  async updateTaper(id: string, taperType: string): Promise<Taper> {
    const taper = await this.taperRepository.findById(id);
    if (!taper) {
      throw new NotFoundError(`Taper with ID "${id}" not found`, ErrorCodes.NOT_FOUND);
    }

    try {
      return await this.taperRepository.update(id, taperType);
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new ConflictError(
          `Taper type "${taperType}" already exists`,
          ErrorCodes.USER_ALREADY_EXISTS,
        );
      }
      throw error;
    }
  }

  async deleteTaper(id: string): Promise<void> {
    const taper = await this.taperRepository.findById(id);
    if (!taper) {
      throw new NotFoundError(`Taper with ID "${id}" not found`, ErrorCodes.NOT_FOUND);
    }
    await this.taperRepository.delete(id);
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
    const taper = await this.taperRepository.findById(taperId);
    if (!taper) {
      throw new NotFoundError(`Taper with ID "${taperId}" not found`, ErrorCodes.NOT_FOUND);
    }

    try {
      return await this.taperRepository.addSpec(taperId, data);
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new ConflictError(
          `Spec key "${data.specKey}" already exists on this taper`,
          ErrorCodes.USER_ALREADY_EXISTS,
        );
      }
      throw error;
    }
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
    const taper = await this.taperRepository.findById(taperId);
    if (!taper) {
      throw new NotFoundError(`Taper with ID "${taperId}" not found`, ErrorCodes.NOT_FOUND);
    }

    const specExists = taper.specs.some((spec) => spec.specKey === specKey);
    if (!specExists) {
      throw new NotFoundError(
        `Spec key "${specKey}" not found on taper "${taper.taperType}"`,
        ErrorCodes.NOT_FOUND,
      );
    }

    try {
      return await this.taperRepository.updateSpec(taperId, specKey, data);
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new NotFoundError(
          `Spec key "${specKey}" not found on taper "${taperId}"`,
          ErrorCodes.NOT_FOUND,
        );
      }
      throw error;
    }
  }

  async deleteSpec(taperId: string, specKey: string): Promise<void> {
    const taper = await this.taperRepository.findById(taperId);
    if (!taper) {
      throw new NotFoundError(`Taper with ID "${taperId}" not found`, ErrorCodes.NOT_FOUND);
    }

    const specExists = taper.specs.some((spec) => spec.specKey === specKey);
    if (!specExists) {
      throw new NotFoundError(
        `Spec key "${specKey}" not found on taper "${taper.taperType}"`,
        ErrorCodes.NOT_FOUND,
      );
    }

    try {
      await this.taperRepository.deleteSpec(taperId, specKey);
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new NotFoundError(
          `Spec key "${specKey}" not found on taper "${taperId}"`,
          ErrorCodes.NOT_FOUND,
        );
      }
      throw error;
    }
  }
}
