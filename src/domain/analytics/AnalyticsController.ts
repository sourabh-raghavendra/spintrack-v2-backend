// Path: server/src/domain/analytics/AnalyticsController.ts
import { AnalyticsService } from "./AnalyticsService";

interface DateRange {
  startDate?: Date;
  endDate?: Date;
}

export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  async technicianActivity(range: DateRange) {
    return this.analyticsService.technicianActivity(range);
  }

  async customerWiseRepairs(range: DateRange) {
    return this.analyticsService.customerWiseRepairs(range);
  }

  async top10Customers(range: DateRange) {
    return this.analyticsService.top10Customers(range);
  }

  async machineWiseSpindles(range: DateRange) {
    return this.analyticsService.machineWiseSpindles(range);
  }

  async orderTypeBreakdown(range: DateRange) {
    return this.analyticsService.orderTypeBreakdown(range);
  }

  async spindleMakeWiseRepairs(range: DateRange) {
    return this.analyticsService.spindleMakeWiseRepairs(range);
  }

  async taperWiseReport(range: DateRange) {
    return this.analyticsService.taperWiseReport(range);
  }

  async underWarrantyRepairs(range: DateRange) {
    return this.analyticsService.underWarrantyRepairs(range);
  }
}
