// Path: server/src/domain/note/NoteService.ts
import { NotFoundError } from "../../errors/HttpError";
import prisma from "../../config/database";

export class NoteService {
  async listForReport(orderId: string, reportName: string) {
    return prisma.note.findMany({
      where: { orderId, reportName },
      include: { createdBy: { select: { id: true, name: true } } },
      orderBy: { createdAt: "asc" },
    });
  }

  async createNote(orderId: string, reportName: string, content: string, userId: string) {
    return prisma.note.create({
      data: { orderId, reportName, content, createdById: userId },
      include: { createdBy: { select: { id: true, name: true } } },
    });
  }

  async editNote(id: string, content: string) {
    const existing = await prisma.note.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Note not found");

    return prisma.note.update({
      where: { id },
      data: { content, isEdited: true },
      include: { createdBy: { select: { id: true, name: true } } },
    });
  }

  async deleteNote(id: string) {
    const existing = await prisma.note.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Note not found");
    await prisma.note.delete({ where: { id } });
  }

  async listAllForOrder(orderId: string) {
    return prisma.note.findMany({
      where: { orderId },
      include: { createdBy: { select: { id: true, name: true } } },
      orderBy: { createdAt: "asc" },
    });
  }
}
