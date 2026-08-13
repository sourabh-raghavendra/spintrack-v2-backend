// Path: server/src/domain/finalInspectionPdf/buildFinalInspectionDoc.ts
import setcoLogo from "../../assets/logos/setco";
import spintrackLogo from "../../assets/logos/spintrack";
import { TDocumentDefinitions, Content } from "pdfmake/interfaces";
const PdfPrinter = require("pdfmake/js/Printer").default;
const virtualFs = require("pdfmake/js/virtual-fs").default;
const URLResolver = require("pdfmake/js/URLResolver").default;

const sectionTitle = (text: string): Content => ({
  table: {
    widths: ["*"],
    body: [
      [
        {
          text,
          alignment: "center",
          color: "#ffffff",
          fillColor: "#ff0000",
          bold: true,
          fontSize: 9,
          margin: [0, 0, 3, 3],
        },
      ],
    ],
  },
  layout: "noBorders",
  margin: [0, 10, 0, 5],
});

export function buildFinalInspectionDoc(data: {
  customerName: string;
  spindleModel: string;
  serialNumber: string;
  jobNumber: string;
  taperTypeLabel: string;
  matchedFields: any[];
  trials: any[];
  remarksList: string[];
}): TDocumentDefinitions {
  const reportDate = new Date().toLocaleDateString("en-GB");

  const finalInspectionTableBody: any[][] = [
    ["Sr.", "Test Name", "Measured", "Lower Limit", "Upper Limit", "Units"],
  ];

  let sr = 1;
  data.matchedFields.forEach((field) => {
    const value = field.value;
    const unit = field.unit ?? "";
    const min = field.min ?? "";
    const max = field.max ?? "";

    if (Array.isArray(value)) {
      value.forEach((v, idx) => {
        finalInspectionTableBody.push([
          sr++,
          `${field.label} (${idx + 1})`,
          v ?? "—",
          min,
          max,
          unit,
        ]);
      });
    } else {
      finalInspectionTableBody.push([
        sr++,
        field.label,
        value ?? "—",
        min,
        max,
        unit,
      ]);
    }
  });

  // If there are no rows (only header), render a placeholder row
  if (finalInspectionTableBody.length === 1) {
    finalInspectionTableBody.push([
      { text: "No final inspection measurements recorded for this taper", colSpan: 6, alignment: "center", style: "valueCell" },
      "", "", "", "", ""
    ]);
  }

  const testingAndBalancingRows = [
    [
      "Sr.No",
      "RPM",
      "Vibration (F, mm/sec)",
      "Vibration (R, mm/sec)",
      "Temp",
      "Amp",
      "Time",
    ],
    ...(Array.isArray(data.trials)
      ? data.trials.map((row, idx) => [
          idx + 1,
          row.rpm || "—",
          row.vibrationFront || "—",
          row.vibrationRear || "—",
          row.temp || "—",
          row.amp || "—",
          row.time || "—",
        ])
      : []),
  ];

  if (testingAndBalancingRows.length === 1) {
    testingAndBalancingRows.push([
      { text: "No testing & balancing trials recorded", colSpan: 7, alignment: "center", style: "valueCell" },
      "", "", "", "", "", ""
    ]);
  }

  const remarksRows = [["Sr.", "Remark"]];
  const allRemarks = [
    "Warm up spindle for min. 60 minutes before hand-over to production.",
    ...data.remarksList,
  ];
  allRemarks.forEach((remark, idx) => {
    remarksRows.push([idx + 1, remark]);
  });

  return {
    pageSize: "A4",
    pageMargins: [40, 20, 40, 20],
    content: [
      {
        columns: [
          {
            image: setcoLogo,
            width: 60,
            alignment: "left",
          },
          {
            stack: [
              { text: "Final Inspection Report", style: "companyTitle" },
            ],
            alignment: "center",
          },
          {
            image: spintrackLogo,
            width: 90,
            alignment: "right",
          },
        ],
        margin: [0, 0, 0, 10],
      },

      {
        columns: [
          { text: `Customer Name: ${data.customerName}`, style: "field" },
          { text: `Date: ${reportDate}`, alignment: "right", style: "field" },
        ],
        margin: [0, 0, 0, 10],
      },

      {
        table: {
          widths: ["*", "*", "*", "*"],
          body: [
            [
              { text: "Spindle Model:", style: "labelCell" },
              { text: data.spindleModel, style: "valueCell" },
              { text: "Sr. No.:", style: "labelCell" },
              { text: data.serialNumber, style: "valueCell" },
            ],
            [
              { text: "Job No.:", style: "labelCell" },
              { text: data.jobNumber, style: "valueCell" },
              { text: "Taper Type:", style: "labelCell" },
              { text: data.taperTypeLabel, style: "valueCell" },
            ],
          ],
        },
        layout: {
          fillColor: (rowIndex: number) => (rowIndex === 0 ? "#87CEEB" : null),
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => "#000000",
          vLineColor: () => "#000000",
        },
        margin: [0, 0, 0, 10],
      },

      sectionTitle("FINAL INSPECTION REPORT"),
      {
        table: {
          widths: [15, "*", 64, 64, 64, 64],
          body: finalInspectionTableBody,
        },
        layout: {
          fillColor: (rowIndex: number) => (rowIndex === 0 ? "#87CEEB" : null),
        },
        margin: [0, 0, 0, 10],
        style: "tableCell",
      },

      sectionTitle("TESTING AND BALANCING REPORT"),
      {
        table: {
          widths: ["*", "*", "*", "*", "*", "*", "*"],
          body: testingAndBalancingRows,
        },
        layout: {
          fillColor: (rowIndex: number) => (rowIndex === 0 ? "#87CEEB" : null),
        },
        margin: [0, 0, 0, 10],
        style: "tableCell",
      },

      sectionTitle("REMARKS FOR CUSTOMER"),
      {
        table: {
          widths: ["auto", "*"],
          body: remarksRows,
        },
        layout: {
          fillColor: (rowIndex: number) => (rowIndex === 0 ? "#87CEEB" : null),
        },
        margin: [0, 0, 0, 10],
        style: "tableCell",
      },

      sectionTitle("Approved By"),
      {
        table: {
          widths: ["*", "*", "*"],
          body: [
            [
              {
                text: "Testing In-charge",
                style: "valueCell",
                alignment: "center",
              },
              {
                text: "Assembly In-charge",
                style: "valueCell",
                alignment: "center",
              },
              {
                text: "ISR Manager",
                style: "valueCell",
                alignment: "center",
              },
            ],
          ],
        },
        layout: "headerLineOnly",
        margin: [0, 10, 0, 0],
      },
    ],
    styles: {
      companyTitle: { fontSize: 12, bold: true },
      subtitle: { fontSize: 8 },
      field: { fontSize: 8 },
      labelCell: { fillColor: "#cce5ff", fontSize: 8 },
      valueCell: { fillColor: "#dbeeff", fontSize: 8 },
      tableCell: {
        fontSize: 8,
        margin: [0, 0, 10, 10],
      },
    },
  };
}

const fonts = {
  Helvetica: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italics: "Helvetica-Oblique",
    bolditalics: "Helvetica-BoldOblique",
  },
};

export async function renderFinalInspectionPdf(docDefinition: TDocumentDefinitions): Promise<Buffer> {
  const urlResolver = new URLResolver(virtualFs);
  const printer = new PdfPrinter(fonts, virtualFs, urlResolver);
  const doc = await printer.createPdfKitDocument({
    ...docDefinition,
    defaultStyle: { font: "Helvetica" },
  });

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
    doc.end();
  });
}
