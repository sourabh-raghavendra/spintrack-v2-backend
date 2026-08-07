// src/infrastructure/database/SpindleRepository.ts
import { ISpindleRepository, SpindleListFilters, SpindleWithTaper } from "../../domain/spindle/ISpindleRepository";
import { Spindle } from "../../generated/prisma/client";
import prisma from "../../config/database";

const spindleIncludes = {
  taper: {
    select: {
      id: true,
      taperType: true,
    },
  },
  createdBy: {
    select: {
      id: true,
      name: true,
      employeeCode: true,
    },
  },
};

export class SpindleRepository implements ISpindleRepository {
  async findAll(
    filters: SpindleListFilters,
  ): Promise<{ items: SpindleWithTaper[]; total: number }> {
    const where: any = {};

    if (filters.search) {
      const searchStr = filters.search.trim();
      where.OR = [
        { serialNumber: { contains: searchStr, mode: "insensitive" } },
        { make: { contains: searchStr, mode: "insensitive" } },
        { type: { contains: searchStr, mode: "insensitive" } },
      ];
    }

    const skip = (filters.page - 1) * filters.pageSize;
    const take = filters.pageSize;

    const [items, total] = await Promise.all([
      prisma.spindle.findMany({
        where,
        skip,
        take,
        include: spindleIncludes,
        orderBy: { serialNumber: "asc" },
      }) as Promise<SpindleWithTaper[]>,
      prisma.spindle.count({ where }),
    ]);

    return { items, total };
  }

  async findById(id: string): Promise<SpindleWithTaper | null> {
    return prisma.spindle.findUnique({
      where: { id },
      include: spindleIncludes,
    }) as Promise<SpindleWithTaper | null>;
  }

  async findBySerialNumberExact(
    serialNumber: string,
  ): Promise<SpindleWithTaper | null> {
    return prisma.spindle.findUnique({
      where: { serialNumber },
      include: spindleIncludes,
    }) as Promise<SpindleWithTaper | null>;
  }

  async create(data: {
    serialNumber: string;
    make: string;
    type: string;
    taperId: string;
    maxRpm?: string | null;
    createdById: string;
  }): Promise<Spindle> {
    return prisma.spindle.create({
      data: {
        serialNumber: data.serialNumber,
        make: data.make,
        type: data.type,
        taperId: data.taperId,
        maxRpm: data.maxRpm ?? null,
        createdById: data.createdById,
      },
    });
  }

  async update(
    id: string,
    data: Partial<{
      serialNumber: string;
      make: string;
      type: string;
      taperId: string;
      maxRpm: string | null;
    }>,
  ): Promise<Spindle> {
    return prisma.spindle.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }
}
