// Path: server/src/domain/fullReportPdf/buildFullReportDoc.ts
import { TDocumentDefinitions, Content } from "pdfmake/interfaces";
import { FullReportPdfService } from "./FullReportPdfService";

type AssembledData = Awaited<ReturnType<FullReportPdfService["assembleFullReportData"]>>;

export function buildFullReportDoc(data: AssembledData): TDocumentDefinitions {
  const content: Content[] = [
    { text: "Full Report Summary", fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
    {
      columns: [
        { text: `JO: ${data.orderMeta.jo || "—"}   RMA: ${data.orderMeta.rma || "—"}   SO: ${data.orderMeta.so || "—"}` },
        { text: `Customer: ${data.orderMeta.customerName}`, alignment: "right" },
      ],
      margin: [0, 0, 0, 4],
    },
    {
      text: `Spindle: ${data.orderMeta.spindleMake} — ${data.orderMeta.spindleSerial}   Taper: ${data.orderMeta.taperType}`,
      margin: [0, 0, 0, 15],
    },
  ];

  const spaciousLayout = {
    hLineWidth: (i: number, node: any) => 0.5,
    vLineWidth: (i: number, node: any) => 0,
    hLineColor: (i: number, node: any) => "#dddddd",
    paddingLeft: (i: number, node: any) => 10,
    paddingRight: (i: number, node: any) => 10,
    paddingTop: (i: number, node: any) => 8,
    paddingBottom: (i: number, node: any) => 8,
  };

  for (let i = 0; i < data.sections.length; i++) {
    const section = data.sections[i];
    content.push({
      text: section.title,
      fontSize: 13,
      bold: true,
      fillColor: "#eaeaea",
      margin: [0, 20, 0, 8],
      pageBreak: i > 0 ? "before" : undefined,
    });

    if (section.kind === "flat") {
      const rows = section.rows[0] ?? [];
      content.push({
        table: {
          widths: ["40%", "60%"],
          body: rows.map((r) => [
            { text: r.label, bold: true },
            section.reportName === "drawbar_details" && r.key === "arrangement"
              ? buildShapeCell(r.value)
              : r.value,
          ]),
        },
        layout: spaciousLayout,
        margin: [0, 0, 0, 15],
      });
    } else {
      if (section.rows.length === 0) {
        content.push({ text: "No entries.", italics: true, color: "#888888", margin: [0, 0, 0, 5] });
        continue;
      }
      const headers = section.rows[0].map((r) => r.label);
      const tableWidths: Record<string, any[]> = {
        old_bearing_report: [100, 150, 180, 50],
        new_bearing_report: [100, 150, 180, 50],
        electrical_test: [120, 120, 120, 120],
        testing_balancing_trials: [50, 50, 50, 80, 80, 50, 50, 50],
        deviations: [150, 70, 250],
        in_process_inspection: [70, 40, 60, 60, 40, 60, 60],
      };
      const widths = tableWidths[section.reportName] ?? headers.map(() => "*");

      if (section.reportName === "in_process_inspection") {
        content.push({
          table: {
            widths,
            body: [
              headers.map((h) => ({ text: h, bold: true, fillColor: "#f0f0f0", fontSize: 8 })),
              ...section.rows.map((row) =>
                row.map((cell) => ({
                  text: cell.value,
                  fontSize: 8,
                }))
              ),
            ],
          },
          layout: spaciousLayout,
          margin: [0, 0, 0, 15],
        });
      } else {
        content.push({
          table: {
            widths,
            body: [
              headers.map((h) => ({ text: h, bold: true, fillColor: "#f0f0f0", fontSize: 8 })),
              ...section.rows.map((row) =>
                row.map((cell) =>
                  cell.key === "arrangement"
                    ? buildShapeCell(cell.value)
                    : { text: cell.value, fontSize: 8 }
                )
              ),
            ],
          },
          layout: spaciousLayout,
          margin: [0, 0, 0, 15],
        });
      }
    }
  }

  if (data.personnelSections.length > 0) {
    content.push({ text: "Personnel", fontSize: 15, bold: true, margin: [0, 20, 0, 8] });
    for (const p of data.personnelSections) {
      content.push({ text: p.title, fontSize: 11, bold: true, margin: [0, 8, 0, 3] });
      content.push({
        ul: p.rows.map((r) => `${r.role}: ${r.name}`),
        fontSize: 10,
      });
    }
  }

  return {
    pageSize: "A4",
    pageMargins: [40, 40, 40, 40],
    defaultStyle: { font: "Helvetica", fontSize: 9 },
    content,
  };
}

const SHAPE_DRAWERS: Record<string, (x: number) => { width: number; xml: string }> = {
  "<": (x) => ({
    width: 14,
    xml: `<path d="M${x + 10} 2 L${x + 4} 7 L${x + 10} 12" stroke="black" fill="none" stroke-width="1.5"/>`,
  }),
  ">": (x) => ({
    width: 14,
    xml: `<path d="M${x + 4} 2 L${x + 10} 7 L${x + 4} 12" stroke="black" fill="none" stroke-width="1.5"/>`,
  }),
  "◯": (x) => ({
    width: 14,
    xml: `<circle cx="${x + 7}" cy="7" r="5" stroke="black" fill="none" stroke-width="1.5"/>`,
  }),
  "■": (x) => ({
    width: 14,
    xml: `<rect x="${x + 2}" y="2" width="10" height="10" fill="black"/>`,
  }),
  "▭": (x) => ({
    width: 18,
    xml: `<rect x="${x + 1}" y="1" width="16" height="10" fill="black"/>`,
  }),
  "▯": (x) => ({
    width: 18,
    xml: `<rect x="${x + 1}" y="1" width="16" height="10" stroke="black" fill="none" stroke-width="1.5"/>`,
  }),
  "NN": (x) => ({
    width: 20,
    xml: `<text x="${x}" y="11" font-size="10" font-family="Helvetica" font-weight="bold">NN</text>`,
  }),
  "N": (x) => ({
    width: 14,
    xml: `<text x="${x + 2}" y="11" font-size="10" font-family="Helvetica" font-weight="bold">N</text>`,
  }),
  "THRUST": (x) => ({
    width: 45,
    xml: `<text x="${x}" y="11" font-size="9" font-family="Helvetica">THRUST</text>`,
  }),
  "X": (x) => ({
    width: 14,
    xml: `<path d="M${x + 2} 2 L${x + 12} 12 M${x + 12} 2 L${x + 2} 12" stroke="black" stroke-width="1.5"/>`,
  }),
  "=||": (x) => ({
    width: 20,
    xml: `<line x1="${x + 2}" y1="3" x2="${x + 2}" y2="11" stroke="black" stroke-width="1.5"/><line x1="${x + 6}" y1="3" x2="${x + 6}" y2="11" stroke="black" stroke-width="1.5"/>`,
  }),
};

function buildShapeCell(value: unknown): any {
  if (typeof value !== "string" || !value || value === "—") return { text: "—", fontSize: 8 };
  const symbols = value.split(",");
  let currentX = 0;
  const gap = 4;
  const paths: string[] = [];

  for (const s of symbols) {
    const key = s.trim();
    const drawer = SHAPE_DRAWERS[key];
    if (drawer) {
      const res = drawer(currentX);
      paths.push(res.xml);
      currentX += res.width + gap;
    } else {
      const textWidth = key.length * 6 + 4;
      paths.push(`<text x="${currentX}" y="11" font-size="8" font-family="Helvetica">${key}</text>`);
      currentX += textWidth + gap;
    }
  }

  const totalWidth = Math.max(14, currentX - gap);
  const svgString = `<svg width="${totalWidth}" height="14">${paths.join("")}</svg>`;
  return {
    svg: svgString,
    width: totalWidth,
  };
}
