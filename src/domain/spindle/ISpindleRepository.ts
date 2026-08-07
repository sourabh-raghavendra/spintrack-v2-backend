// src/domain/spindle/ISpindleRepository.ts
import { Spindle } from "../../generated/prisma/client";

export type SpindleWithTaper = Spindle & {
  taper: { id: string; taperType: string };
  createdBy: { id: string; name: string; employeeCode: string };
};

export interface SpindleListFilters {
  search?: string; // partial match on serialNumber, make, or type
  page: number;
  pageSize: number;
}

export interface ISpindleRepository {
  findAll(
    filters: SpindleListFilters,
  ): Promise<{ items: SpindleWithTaper[]; total: number }>;
  findById(id: string): Promise<SpindleWithTaper | null>;
  findBySerialNumberExact(
    serialNumber: string,
  ): Promise<SpindleWithTaper | null>;
  create(data: {
    serialNumber: string;
    make: string;
    type: string;
    taperId: string;
    maxRpm?: string | null;
    createdById: string;
  }): Promise<Spindle>;
  update(
    id: string,
    data: Partial<{
      serialNumber: string;
      make: string;
      type: string;
      taperId: string;
      maxRpm: string | null;
    }>,
  ): Promise<Spindle>;
}
