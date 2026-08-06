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
    const DEFAULT_SPECS_TEMPLATE = [
      { specKey: "afterGrindingROOfShaft", label: "After Grinding R/O of Shaft (mm)", unit: "mm" },
      { specKey: "goNoGo", label: "Go-NoGo", unit: "mm" },
      { specKey: "blueMatching", label: "Blue Matching", unit: "%" },
      { specKey: "spacerSizeNNBearing", label: "Spacer Size of NN Bearing (mm)", unit: "mm" },
      { specKey: "housingDepth", label: "Housing Depth (mm)", unit: "mm" },
      { specKey: "bearingStackLength", label: "Bearing Stack Length (mm)", unit: "mm" },
      { specKey: "preloadOfCover", label: "Preload of Cover (mm)", unit: "mm" },
      { specKey: "boreRO", label: "Bore R/O (mm)", unit: "mm" },
      { specKey: "frontBearingTool", label: "Front Bearing Tool (mm)", unit: "mm" },
      { specKey: "rearSideRO", label: "Rear Side R/O (mm)", unit: "mm" },
      { specKey: "faceROHSK", label: "Face R/O (HSK) (mm)", unit: "mm" },
      { specKey: "mandrelRO300WithStud", label: "Mandrel R/O @ 300mm (with stud) (mm)", unit: "mm" },
      { specKey: "mandrelRO300WithDrawbar", label: "Mandrel R/O @ 300mm (with drawbar) (mm)", unit: "mm" },
      { specKey: "clampingForceFinal", label: "Clamping Force (kg-f)", unit: "kg-f" },
      { specKey: "radialPlay", label: "Radial Play (mm)", unit: "mm" },
      { specKey: "axialPlay", label: "Axial Play (mm)", unit: "mm" },
      { specKey: "axialFloat", label: "Axial float (mm)", unit: "mm" },
      { specKey: "rearBearingTolerance", label: "Rear Bearing Tolerance (mm)", unit: "mm" },
      { specKey: "totalShaftHeightAfterRework", label: "Total Shaft Height After Rework", unit: "mm" },
      { specKey: "taperOdRunout", label: "Taper Od Runout", unit: "mm" },
    ];

    try {
      const taper = await this.taperRepository.create(taperType);
      
      const normalizedType = taperType.trim().toUpperCase();
      const excludeTaperOdRunout = normalizedType === "SK50" || normalizedType === "A2";

      for (const spec of DEFAULT_SPECS_TEMPLATE) {
        if (spec.specKey === "taperOdRunout" && excludeTaperOdRunout) {
          continue;
        }
        await this.taperRepository.addSpec(taper.id, {
          specKey: spec.specKey,
          label: spec.label,
          min: 0,
          max: 0,
          unit: spec.unit,
          include: false,
        });
      }

      const reloaded = await this.taperRepository.findById(taper.id);
      return reloaded || taper;
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
