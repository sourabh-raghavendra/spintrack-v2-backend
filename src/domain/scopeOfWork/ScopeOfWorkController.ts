import { ScopeOfWorkService } from "./ScopeOfWorkService";

export class ScopeOfWorkController {
  constructor(private readonly service: ScopeOfWorkService) {}

  async listForOrder(orderId: string) {
    return this.service.listForOrder(orderId);
  }

  async searchStatements(query: string) {
    return this.service.searchStatements(query);
  }

  async addStatementToOrder(
    orderId: string,
    input: { statementId?: string; text?: string },
    userId: string
  ) {
    return this.service.addStatementToOrder(orderId, input, userId);
  }

  async removeFromOrder(id: string) {
    return this.service.removeFromOrder(id);
  }
}
