import PDFDocument from "pdfkit";

function formatDate(dateInput: any): string {
  if (!dateInput) return "—";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "—";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

export function generateOrderOnePagerPdf(order: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: "A4" });
      const chunks: Buffer[] = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", (err) => reject(err));

      // Title header
      doc.fontSize(20).font("Helvetica-Bold").text("SETCO SPINDLE REPAIR SERVICES", { align: "center" });
      doc.fontSize(12).font("Helvetica").text("Job Order summary Sheet (One-Pager)", { align: "center", oblique: true });
      doc.moveDown(1.5);

      // Section 1: Order details
      doc.fontSize(14).font("Helvetica-Bold").text("1. Job Order Metadata", { underline: true });
      doc.moveDown(0.5);
      
      doc.fontSize(10).font("Helvetica");
      const orderFields = [
        ["RMA Number:", order.rma],
        ["Sales Order (SO):", order.so || "—"],
        ["Job Order (JO):", order.jo || "—"],
        ["Quotation Reference:", order.quotation || "—"],
        ["Order Type:", order.orderType],
        ["Current Stage:", order.orderStage],
        ["Received Date:", formatDate(order.spindleReceivedDate)],
        ["Created By:", order.createdBy?.name || "—"],
      ];

      let currentY = doc.y;
      orderFields.forEach(([label, value], index) => {
        const isLeft = index % 2 === 0;
        const xPos = isLeft ? 50 : 300;
        const yPos = isLeft ? currentY : currentY - 18;
        
        doc.font("Helvetica-Bold").text(label, xPos, yPos);
        doc.font("Helvetica").text(String(value), xPos + 120, yPos);
        
        if (!isLeft || index === orderFields.length - 1) {
          currentY += 18;
        }
      });
      doc.moveDown(1.5);

      // Section 2: Customer details
      doc.fontSize(14).font("Helvetica-Bold").text("2. Customer Account Profile", { underline: true });
      doc.moveDown(0.5);
      
      const customer = order.customer;
      const customerFields = [
        ["Customer Name:", customer?.customerName || "—"],
        ["Customer ID:", customer?.customerId || "—"],
        ["State:", customer?.customerState || "—"],
        ["City:", customer?.customerCity || "—"],
      ];

      currentY = doc.y;
      customerFields.forEach(([label, value], index) => {
        const isLeft = index % 2 === 0;
        const xPos = isLeft ? 50 : 300;
        const yPos = isLeft ? currentY : currentY - 18;
        
        doc.font("Helvetica-Bold").text(label, xPos, yPos);
        doc.font("Helvetica").text(String(value), xPos + 120, yPos);
        
        if (!isLeft || index === customerFields.length - 1) {
          currentY += 18;
        }
      });
      doc.moveDown(1.5);

      // Section 3: Spindle details
      doc.fontSize(14).font("Helvetica-Bold").text("3. Spindle Asset Specifications", { underline: true });
      doc.moveDown(0.5);
      
      const spindle = order.spindle;
      const spindleFields = [
        ["Serial Number:", spindle?.serialNumber || "—"],
        ["Make / Manufacturer:", spindle?.make || "—"],
        ["Type:", spindle?.type || "—"],
        ["Taper Profile:", spindle?.taper?.taperType || "—"],
        ["Max Operating RPM:", spindle?.maxRpm ? `${spindle?.maxRpm} RPM` : "—"],
      ];

      currentY = doc.y;
      spindleFields.forEach(([label, value], index) => {
        const isLeft = index % 2 === 0;
        const xPos = isLeft ? 50 : 300;
        const yPos = isLeft ? currentY : currentY - 18;
        
        doc.font("Helvetica-Bold").text(label, xPos, yPos);
        doc.font("Helvetica").text(String(value), xPos + 120, yPos);
        
        if (!isLeft || index === spindleFields.length - 1) {
          currentY += 18;
        }
      });
      
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
