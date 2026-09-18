import PDFDocument from "pdfkit";
import { generateQrJpeg } from "./qrCode";

function formatDate(dateInput: any): string {
  if (!dateInput) return "—";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "—";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

export async function generateOrderOnePagerPdf(order: any): Promise<Buffer> {
  const qrBuffer = await generateQrJpeg(order.jo || order.rma || order.id || "ORDER");

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: "A4" });
      const chunks: Buffer[] = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", (err) => reject(err));

      const pageWidth = 595.28;
      const margin = 40;
      const contentWidth = pageWidth - margin * 2; // 515.28

      // ── HEADER ─────────────────────────────────────────────────────────────
      // Top Left: QR Code (width 65x65)
      const qrSize = 65;
      doc.image(qrBuffer, margin, 35, { width: qrSize, height: qrSize });

      // Top Right/Center: Title text (offset to the right of QR code)
      const headerTextX = margin + qrSize + 15;
      const headerTextWidth = contentWidth - (qrSize + 15);

      doc
        .fontSize(18)
        .font("Helvetica-Bold")
        .fillColor("#0f172a")
        .text("SETCO SPINDLE REPAIR SERVICES", headerTextX, 38, {
          width: headerTextWidth,
          align: "left",
        });

      doc
        .fontSize(11)
        .font("Helvetica")
        .fillColor("#475569")
        .text("JOB ORDER SUMMARY SHEET (ONE-PAGER)", headerTextX, 60, {
          width: headerTextWidth,
          align: "left",
        });

      doc
        .fontSize(9)
        .font("Helvetica-Oblique")
        .fillColor("#64748b")
        .text(`Generated: ${formatDate(new Date())}`, headerTextX, 76, {
          width: headerTextWidth,
          align: "left",
        });

      // Divider line
      let y = 115;
      doc
        .strokeColor("#cbd5e1")
        .lineWidth(1)
        .moveTo(margin, y)
        .lineTo(margin + contentWidth, y)
        .stroke();

      y += 15;

      // ── HELPER: Render Section ──────────────────────────────────────────────
      const renderSection = (title: string, fields: [string, string][]) => {
        // Section Header Box
        const headerHeight = 22;
        doc
          .rect(margin, y, contentWidth, headerHeight)
          .fillAndStroke("#1e293b", "#1e293b");

        doc
          .fontSize(11)
          .font("Helvetica-Bold")
          .fillColor("#ffffff")
          .text(title, margin + 10, y + 5, { width: contentWidth - 20 });

        y += headerHeight + 10;

        // Render fields in 2 columns
        const col1X = margin + 10;
        const col1LabelWidth = 110;
        const col1ValWidth = 130;

        const col2X = margin + 260;
        const col2LabelWidth = 110;
        const col2ValWidth = 125;

        for (let i = 0; i < fields.length; i += 2) {
          const field1 = fields[i];
          const field2 = fields[i + 1];

          // Calculate heights
          doc.fontSize(9.5).font("Helvetica");
          const h1 = doc.heightOfString(String(field1[1] || "—"), { width: col1ValWidth });
          const h2 = field2 ? doc.heightOfString(String(field2[1] || "—"), { width: col2ValWidth }) : 0;
          const rowHeight = Math.max(h1, h2, 14) + 6;

          // Background alternating row highlight
          if ((i / 2) % 2 === 1) {
            doc
              .rect(margin, y - 3, contentWidth, rowHeight)
              .fill("#f8fafc");
          }

          // Column 1
          doc
            .fontSize(9.5)
            .font("Helvetica-Bold")
            .fillColor("#334155")
            .text(field1[0], col1X, y, { width: col1LabelWidth });

          doc
            .font("Helvetica")
            .fillColor("#0f172a")
            .text(String(field1[1] || "—"), col1X + col1LabelWidth, y, { width: col1ValWidth });

          // Column 2 (if present)
          if (field2) {
            doc
              .font("Helvetica-Bold")
              .fillColor("#334155")
              .text(field2[0], col2X, y, { width: col2LabelWidth });

            doc
              .font("Helvetica")
              .fillColor("#0f172a")
              .text(String(field2[1] || "—"), col2X + col2LabelWidth, y, { width: col2ValWidth });
          }

          y += rowHeight;
        }

        y += 10;
      };

      // ── SECTION 1: Metadata ────────────────────────────────────────────────
      const metadataFields: [string, string][] = [
        ["RMA Number:", order.rma || "—"],
        ["Sales Order (SO):", order.so || "—"],
        ["Job Order (JO):", order.jo || "—"],
        ["Quotation Reference:", order.quotation || "—"],
        ["Order Type:", order.orderType || "—"],
        ["Current Stage:", order.orderStage || "—"],
        ["Received Date:", formatDate(order.spindleReceivedDate)],
        ["Created By:", order.createdBy?.name || "—"],
      ];
      renderSection("1. Job Order Metadata", metadataFields);

      // ── SECTION 2: Customer Account Profile ─────────────────────────────────
      const customer = order.customer;
      const customerFields: [string, string][] = [
        ["Customer Name:", customer?.customerName || "—"],
        ["Customer ID:", customer?.customerId || "—"],
        ["State:", customer?.customerState || "—"],
        ["City:", customer?.customerCity || "—"],
      ];
      renderSection("2. Customer Account Profile", customerFields);

      // ── SECTION 3: Spindle Asset Specifications ─────────────────────────────
      const spindle = order.spindle;
      const spindleFields: [string, string][] = [
        ["Serial Number:", spindle?.serialNumber || "—"],
        ["Make / Manufacturer:", spindle?.make || "—"],
        ["Type:", spindle?.type || "—"],
        ["Taper Profile:", spindle?.taper?.taperType || "—"],
        ["Max Operating RPM:", spindle?.maxRpm ? `${spindle?.maxRpm} RPM` : "—"],
      ];
      renderSection("3. Spindle Asset Specifications", spindleFields);

      // Footer
      doc
        .fontSize(8)
        .font("Helvetica-Oblique")
        .fillColor("#94a3b8")
        .text("Confidential — Setco Spindle Repair Services internal system document", margin, 780, {
          width: contentWidth,
          align: "center",
        });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
