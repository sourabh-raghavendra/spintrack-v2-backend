// Path: server/src/domain/warranty/WarrantyCertificateService.ts
import prisma from "../../config/database";
import {
  getSixMonthWarrantyCertificateDefinition,
  getOneYearWarrantyCertificateDefinition,
} from "./certificateTemplates";

const PdfPrinter = require("pdfmake/js/Printer").default;
const virtualFs = require("pdfmake/js/virtual-fs").default;
const URLResolver = require("pdfmake/js/URLResolver").default;

const fonts = {
  Helvetica: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italics: "Helvetica-Oblique",
    bolditalics: "Helvetica-BoldOblique",
  },
};

async function renderCertificatePdf(docDefinition: any): Promise<Buffer> {
  const urlResolver = new URLResolver(virtualFs);
  const printer = new PdfPrinter(fonts, virtualFs, urlResolver);
  const doc = await printer.createPdfKitDocument(docDefinition);

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
    doc.end();
  });
}

export class WarrantyCertificateService {
  async assembleCertificateData(orderId: string) {
    const order = await prisma.order.findUniqueOrThrow({
      where: { id: orderId },
      include: {
        customer: { select: { customerName: true } },
        spindle: { select: { make: true, type: true, serialNumber: true } },
      },
    });
    const closure = await prisma.orderClosure.findUnique({
      where: { orderId },
    });

    if (!closure?.warrantyValidTill) {
      return null; // no certificate available yet
    }

    return {
      certificateNo: order.jo,
      customerName: order.customer.customerName,
      invoiceNo: closure.invoiceNo ?? "",
      invoiceDate: closure.invoiceDate?.toLocaleDateString("en-GB") ?? "",
      spindleDetails: `${order.spindle.make} - ${order.spindle.type}`,
      srNo: order.spindle.serialNumber,
      validUntil: closure.warrantyValidTill.toLocaleDateString("en-GB"),
      place: "Pune",
      issueDate: new Date().toLocaleDateString("en-GB"),
      closureDate: closure.closureDate?.toISOString(), // needed only for the 6-vs-12-month calculation, not printed
    };
  }

  async generateCertificatePdf(orderId: string): Promise<Buffer | null> {
    const data = await this.assembleCertificateData(orderId);
    if (!data) return null;

    const diffInMs =
      new Date(data.validUntil.split("/").reverse().join("-")).getTime() -
      new Date(data.closureDate!).getTime();
    const diffInMonths = diffInMs / (1000 * 60 * 60 * 24 * 30.44);

    const docDefinition =
      diffInMonths >= 9
        ? getOneYearWarrantyCertificateDefinition(data)
        : getSixMonthWarrantyCertificateDefinition(data);

    return renderCertificatePdf({
      ...docDefinition,
      defaultStyle: { font: "Helvetica" },
    });
  }
}
