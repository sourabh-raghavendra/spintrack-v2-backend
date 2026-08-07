// src/domain/spindle/SpindleController.ts
import { SpindleService } from "./SpindleService";
import { SpindleListFilters, SpindleWithTaper } from "./ISpindleRepository";
import { CreateSpindleInput, UpdateSpindleInput } from "../../http/validation/spindle.schema";
import { Spindle } from "../../generated/prisma/client";

export class SpindleController {
  constructor(private readonly spindleService: SpindleService) {}

  async list(filters: SpindleListFilters): Promise<{
    items: SpindleWithTaper[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    return this.spindleService.list(filters);
  }

  async getById(id: string): Promise<SpindleWithTaper> {
    return this.spindleService.getById(id);
  }

  async lookupBySerialNumber(serialNumber: string): Promise<SpindleWithTaper | null> {
    return this.spindleService.lookupBySerialNumber(serialNumber);
  }

  async create(input: CreateSpindleInput & { createdById: string }): Promise<Spindle> {
    return this.spindleService.createSpindle(input);
  }

  async update(id: string, input: UpdateSpindleInput): Promise<Spindle> {
    return this.spindleService.updateSpindle(id, input);
  }
}
