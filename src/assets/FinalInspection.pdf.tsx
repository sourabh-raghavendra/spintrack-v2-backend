import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import useFinalInspectionData from "./useFinalInspectionValue";
import setcoLogo from "./setco";
import spintrackLogo from "./spintrack";
import type { Content, TDocumentDefinitions } from "pdfmake/interfaces";

import UploadAdditionalReports from "../additionalReports/UploadReports";

(pdfMake as any).vfs = pdfFonts.vfs;

const FinalInspectionPdfTemplate = () => {
  const {
    matchedFields,
    taperSpecification,
    testingAndBalancing,
    remarksForCustomer,
    headerData,
  } = useFinalInspectionData();

  const customerName = headerData.customerName;
  const reportDate = new Date().toLocaleDateString("en-GB");
  const spindleModel = headerData.spindleModel;
  const serialNumber = headerData.serialNumber;
  const jobNumber = headerData.jobNumber;

  const finalInspectionTableBody = [
    ["Sr.", "Test Name", "Measured", "Lower Limit", "Upper Limit", "Units"],
  ];

  let sr = 1;
  matchedFields.forEach((field) => {
    const value = field.value;
    const config = matchedFields.find((spec) => spec.key === field.key);
    if (!config) return;
    const unit = config.unit ?? "";
    const min = config.min ?? "";
    const max = config.max ?? "";

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

  // testing and balancing report columns
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
    ...(Array.isArray(testingAndBalancing)
      ? testingAndBalancing.map((row, idx) => [
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

  const remarksRows = [["Sr.", "Remark"]];

  const allRemarks = [
    "Warm up spindle for min. 60 minutes before hand-over to production.",
    ...(Array.isArray(remarksForCustomer) ? remarksForCustomer : []),
  ];
  allRemarks.forEach((remark, idx) => {
    remarksRows.push([idx + 1, remark]);
  });

  const docDefinition: TDocumentDefinitions = {
    pageSize: "A4",
    pageMargins: [40, 20, 40, 20],
    content: [
      {
        columns: [
          {
            image: setcoLogo,
            width: 60,
            alignment: "right",
          },
          {
            stack: [
              { text: "Final Inspection Report", style: "companyTitle" },
              // { text: "Final Inspection report", style: "subtitle" },
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
          { text: `Customer Name: ${customerName}`, style: "field" },
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
              { text: spindleModel, style: "valueCell" },
              { text: "Sr. No.:", style: "labelCell" },
              { text: serialNumber, style: "valueCell" },
            ],
            [
              { text: "Job No.:", style: "labelCell" },
              { text: jobNumber, style: "valueCell" },
              { text: "Taper Type:", style: "labelCell" },
              { text: taperSpecification, style: "valueCell" },
            ],
          ],
        },
        // layout: "noBorders",
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

        // valign: "middle",
      },
    },
  };

  const handleClick = () => pdfMake.createPdf(docDefinition).open();

  if (
    !headerData.customerName ||
    !headerData.jobNumber ||
    !headerData.serialNumber ||
    !headerData.spindleModel
  ) {
    return (
      <div className="px-6">
        Data is missing. Please ensure reports are filled in properly
      </div>
    );
  }

  return (
    <div className="px-4">
      <UploadAdditionalReports />
      <button
        onClick={handleClick}
        className="py-2 px-6 border border-gray-300 hover:bg-black rounded hover:text-white cursor-pointer min-w-fit whitespace-nowrap"
      >
        Download Final Inspection PDF
      </button>
    </div>
  );
};

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
          margin: [0, 0, 3, 3] as [number, number, number, number],
        },
      ],
    ],
  },
  layout: "noBorders",
  margin: [0, 10, 0, 5] as [number, number, number, number],
});

export default FinalInspectionPdfTemplate;
