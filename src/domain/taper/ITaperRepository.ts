// src/domain/taper/ITaperRepository.ts
import { Taper, TaperSpec } from "../../generated/prisma/client";

export type TaperWithSpecs = Taper & { specs: TaperSpec[] };

export interface ITaperRepository {
  findAll(): Promise<TaperWithSpecs[]>;
  findById(id: string): Promise<TaperWithSpecs | null>;
  findByType(taperType: string): Promise<TaperWithSpecs | null>;
  create(taperType: string): Promise<Taper>;
  update(id: string, taperType: string): Promise<Taper>;
  delete(id: string): Promise<void>;

  addSpec(
    taperId: string,
    data: {
      specKey: string;
      label: string;
      min: number;
      max: number;
      unit: string;
      include: boolean;
    },
  ): Promise<TaperSpec>;

  updateSpec(
    taperId: string,
    specKey: string,
    data: Partial<{
      label: string;
      min: number;
      max: number;
      unit: string;
      include: boolean;
    }>,
  ): Promise<TaperSpec>;

  deleteSpec(taperId: string, specKey: string): Promise<void>;
}
