import prisma from "../../config/database";
import { ValidationError, ConflictError } from "../../errors/HttpError";

export class ScopeOfWorkService {
  async listForOrder(orderId: string) {
    return prisma.orderScopeOfWork.findMany({
      where: { orderId },
      include: {
        statement: { select: { id: true, text: true } },
        addedBy: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async searchStatements(query: string) {
    return prisma.scopeOfWorkStatement.findMany({
      where: query ? { text: { contains: query, mode: "insensitive" } } : undefined,
      orderBy: [{ usageCount: "desc" }, { text: "asc" }],
      take: 20,
    });
  }

  async addStatementToOrder(
    orderId: string,
    input: { statementId?: string; text?: string },
    userId: string,
  ) {
    let statement;

    if (input.statementId) {
      statement = await prisma.scopeOfWorkStatement.findUniqueOrThrow({
        where: { id: input.statementId },
      });
    } else if (input.text?.trim()) {
      const trimmed = input.text.trim();
      statement = await prisma.scopeOfWorkStatement.upsert({
        where: { text: trimmed },
        update: {},
        create: { text: trimmed },
      });
    } else {
      throw new ValidationError("Either statementId or text is required");
    }

    try {
      const link = await prisma.orderScopeOfWork.create({
        data: { orderId, statementId: statement.id, addedById: userId },
        include: { statement: true, addedBy: { select: { id: true, name: true } } },
      });
      await prisma.scopeOfWorkStatement.update({
        where: { id: statement.id },
        data: { usageCount: { increment: 1 } },
      });
      return link;
    } catch (err: any) {
      if (err.code === "P2002") {
        throw new ConflictError("This statement is already added to this order");
      }
      throw err;
    }
  }

  async removeFromOrder(id: string) {
    await prisma.orderScopeOfWork.delete({ where: { id } });
  }
}
