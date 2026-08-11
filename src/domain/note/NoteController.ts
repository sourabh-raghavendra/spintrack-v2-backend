// Path: server/src/domain/note/NoteController.ts
import { NoteService } from "./NoteService";

export class NoteController {
  constructor(private readonly service: NoteService) {}

  async listForReport(orderId: string, reportName: string) {
    return this.service.listForReport(orderId, reportName);
  }

  async createNote(orderId: string, reportName: string, content: string, userId: string) {
    return this.service.createNote(orderId, reportName, content, userId);
  }

  async editNote(id: string, content: string) {
    return this.service.editNote(id, content);
  }

  async deleteNote(id: string) {
    await this.service.deleteNote(id);
  }

  async listAllForOrder(orderId: string) {
    return this.service.listAllForOrder(orderId);
  }
}
