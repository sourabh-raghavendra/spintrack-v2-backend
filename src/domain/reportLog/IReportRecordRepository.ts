export interface IReportRecordRepository {
  createBlankIncomingAlert(orderId: string): Promise<any>;
  createBlankChecksheet(orderId: string): Promise<any>;
  createBlankDamageReport(orderId: string): Promise<any>;
  createBlankBearings(orderId: string, isNew: boolean): Promise<any>;
  createBlankElectricalTest(orderId: string): Promise<any>;
  createBlankDrawbarDetails(orderId: string): Promise<any>;
  createBlankFinalInspection(orderId: string): Promise<any>;
  createBlankTestingBalancing(orderId: string): Promise<any>;
  createBlankRemarksForCustomer(orderId: string): Promise<any>;
  createBlankOrderClosure(orderId: string): Promise<any>;
}
