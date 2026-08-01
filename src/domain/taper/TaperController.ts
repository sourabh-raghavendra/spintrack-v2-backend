// src/domain/taper/TaperController.ts
import { TaperService } from "./TaperService";
import { CreateTaperSpecInput, UpdateTaperSpecInput } from "../../http/validation/taper.schema";
import { Taper, TaperSpec } from "../../generated/prisma/client";
import { TaperWithSpecs } from "./ITaperRepository";

export class TaperController {
  constructor(private readonly taperService: TaperService) {}

  async list(): Promise<TaperWithSpecs[]> {
    return this.taperService.findAll();
  }

  async getById(id: string): Promise<TaperWithSpecs> {
    return this.taperService.findById(id);
  }

  async create(input: { taperType: string }): Promise<Taper> {
    return this.taperService.createTaper(input.taperType);
  }

  async update(id: string, input: { taperType: string }): Promise<Taper> {
    return this.taperService.updateTaper(id, input.taperType);
  }

  async remove(id: string): Promise<void> {
    return this.taperService.deleteTaper(id);
  }

  async addSpec(taperId: string, input: CreateTaperSpecInput): Promise<TaperSpec> {
    return this.taperService.addSpec(taperId, input);
  }

  async updateSpec(
    taperId: string,
    specKey: string,
    input: UpdateTaperSpecInput,
  ): Promise<TaperSpec> {
    return this.taperService.updateSpec(taperId, specKey, input);
  }

  async removeSpec(taperId: string, specKey: string): Promise<void> {
    return this.taperService.deleteSpec(taperId, specKey);
  }
}
