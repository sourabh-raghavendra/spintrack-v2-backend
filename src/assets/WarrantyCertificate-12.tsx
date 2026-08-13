import React from "react";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import type { TDocumentDefinitions } from "pdfmake/interfaces";

// Initialize pdfMake fonts
(pdfMake as any).vfs = pdfFonts.vfs;

export interface CertificateData {
  certificateNo: string;
  customerName: string;
  invoiceNo: string;
  invoiceDate: string;
  spindleDetails: string;
  srNo: string; // Added new Sr.No field
  validUntil: string;
  place?: string;
  issueDate: string;
}

export const getOneYearWarrantyCertificateDefinition = (
  data: CertificateData,
): TDocumentDefinitions => {
  return {
    pageSize: "A4",
    pageOrientation: "landscape",
    pageMargins: [40, 40, 40, 40],

    // Authoritative Canvas Borders for both pages
    background: function (_currentPage, pageSize) {
      return {
        canvas: [
          // Outer Navy Blue Border
          {
            type: "rect",
            x: 20,
            y: 20,
            w: pageSize.width - 40,
            h: pageSize.height - 40,
            lineWidth: 3,
            lineColor: "#2874a6",
          },
          // Inner Red Border
          {
            type: "rect",
            x: 26,
            y: 26,
            w: pageSize.width - 52,
            h: pageSize.height - 52,
            lineWidth: 1,
            lineColor: "#d32f2f",
          },
        ],
      };
    },

    content: [
      // ================= PAGE 1 =================
      {
        columns: [
          {
            text: "SETCO",
            fontSize: 28,
            bold: true,
            color: "#d32f2f",
            alignment: "left",
            width: "50%",
          },
          {
            text: [
              { text: "Job Order No. ", color: "#555555" },
              {
                text: data.certificateNo || "________________",
                bold: true,
                fontSize: 14,
              },
            ],
            alignment: "right",
            margin: [0, 10, 0, 0],
            width: "50%",
          },
        ],
      },

      // Title Banner
      {
        table: {
          widths: ["*"],
          body: [
            [
              {
                text: "WARRANTY CERTIFICATE",
                fontSize: 22,
                bold: true,
                color: "#2874a6",
                alignment: "center",
                margin: [0, 10, 0, 10],
                fillColor: "#eaf2f8",
                border: [false, true, false, true],
              },
            ],
          ],
        },
        margin: [0, 20, 0, 20],
      },

      // Main Declaration (Updated for 1 Year)
      {
        text: "We hereby certify that,\nthe repair work of this spindle\nis warranted for one year from the date of dispatch.",
        fontSize: 16,
        alignment: "center",
        margin: [0, 0, 0, 20],
      },
      {
        text: [
          "We, at ",
          { text: "SETCO", color: "#d32f2f", bold: true },
          ", are liable to offer free of cost\nrepair service if, spindle fails within one year because\nof our service quality *",
        ],
        fontSize: 14,
        alignment: "center",
        lineHeight: 1.4,
        margin: [0, 0, 0, 15],
      },
      {
        text: "*Please refer terms & conditions overleaf",
        fontSize: 10,
        italics: true,
        alignment: "center",
        color: "#555555",
        margin: [0, 0, 0, 20],
      },

      // Dynamic Form Fields (Aligned layout with new Sr.No)
      {
        columns: [
          { width: "15%", text: "" }, // Spacer
          {
            width: "70%",
            text: [
              { text: "Warranty offered to :   ", bold: true },
              {
                text: (data.customerName || "").padEnd(40, " "),
                decoration: "underline",
              },
              "\n\n",

              { text: "Against the invoice No. :   ", bold: true },
              {
                text: (data.invoiceNo || "").padEnd(20, " "),
                decoration: "underline",
              },
              { text: "      Dated :   ", bold: true },
              {
                text: (data.invoiceDate || "").padEnd(20, " "),
                decoration: "underline",
              },
              "\n\n",

              { text: "For spindle :   ", bold: true },
              {
                text: (data.spindleDetails || "").padEnd(25, " "),
                decoration: "underline",
              },
              { text: "      Sr. No. :   ", bold: true },
              {
                text: (data.srNo || "").padEnd(15, " "),
                decoration: "underline",
              },
              "\n\n",

              { text: "Warranty valid Up to :   ", bold: true },
              {
                text: (data.validUntil || "").padEnd(30, " "),
                decoration: "underline",
              },
            ],
            fontSize: 12,
            lineHeight: 1.2,
          },
          { width: "15%", text: "" }, // Spacer
        ],
      },

      // Footer block
      {
        columns: [
          {
            width: "50%",
            text: [
              { text: "Place : ", bold: true },
              data.place || "Pune",
              "\n\n",
              { text: "Date : ", bold: true },
              data.issueDate,
            ],
            margin: [40, 20, 0, 0],
          },
          {
            width: "50%",
            stack: [
              {
                canvas: [
                  { type: "line", x1: 0, y1: 0, x2: 200, y2: 0, lineWidth: 1 },
                ],
              },
              {
                text: "Setco Spindles India Pvt Ltd",
                bold: true,
                margin: [0, 5, 0, 2],
                alignment: "center",
              },
              {
                text: "Authority Sign & Stamp",
                margin: [0, 0, 0, 0],
                alignment: "center",
                fontSize: 10,
              },
            ],
            alignment: "right",
            margin: [0, 40, 40, 0],
          },
        ],
      },

      // ================= PAGE 2 (Terms & Conditions) =================
      {
        text: "Welcome To Setco Family Which Is More Than 100yrs Old",
        color: "#d32f2f",
        fontSize: 16,
        bold: true,
        alignment: "center",
        pageBreak: "before",
        margin: [0, 10, 0, 10],
      },
      {
        table: {
          widths: ["auto"],
          body: [
            [
              {
                text: "Terms & Conditions :",
                color: "white",
                fillColor: "#85c1e9",
                fontSize: 14,
                bold: true,
                alignment: "center",
                padding: [20, 5, 20, 5],
                border: [false, false, false, false],
              },
            ],
          ],
        },
        layout: "noBorders",
        margin: [0, 0, 0, 10],
        alignment: "center",
      },
      {
        columns: [
          { width: "5%", text: "" }, // Left Spacer
          {
            width: "90%",
            ol: [
              {
                text: "Produce certificate at the time of claiming warranty.",
                margin: [0, 0, 0, 5],
              },
              {
                text: "The warranty is offered against failure of spindle due to our workmanship failure.",
                margin: [0, 0, 0, 5],
              },
              // New Point 3 added
              {
                text: "Warranty on spindle will be offered for 15 months from date of invoice or 12 months from the date of installation whichever is earlier if installation details provided.",
                margin: [0, 0, 0, 5],
              },
              {
                text: [
                  "Bearing cost warranty is applicable only when bearings are supplied by ",
                  { text: "SETCO", bold: true, color: "#d32f2f" },
                ],
                margin: [0, 0, 0, 5],
              },
              {
                text: "Warranty is applicable only if payment is cleared as per terms & conditions",
                margin: [0, 0, 0, 5],
              },
              {
                text: "Validity of warranty is for stipulated time period as mentioned in the certificate.In case of repairs or replacement of any part/s of the unit, this warranty will thereafter continue and remain in force only for the unexpired period of the warranty.",
                margin: [0, 0, 0, 5],
              },
              {
                text: "Spindle is not warranted for transit damage.",
                margin: [0, 0, 0, 5],
              },
              {
                text: "The warranty will be void if it is found that spindle is failed because of customer mistake like accident, lubrication failure, Wrong mounting practice, contamination found due to poor sealing & unauthorized modification.",
                margin: [0, 0, 0, 5],
              },
              {
                text: [
                  "The process of attending under warranty service, if ",
                  { text: "SETCO", bold: true, color: "#d32f2f" },
                  " Spindles finds that spindle is failed due to some other reason than ",
                  { text: "SETCO", bold: true, color: "#d32f2f" },
                  " Spindles workmanship defect, charges will be applicable.",
                ],
                margin: [0, 0, 0, 5],
              },
              {
                text: "Warranty will be void if customer refuses to replace spares as per our recommendations",
                margin: [0, 0, 0, 5],
              },
              {
                text: "Electronics faults are not covered under warranty",
                margin: [0, 0, 0, 5],
              },
              {
                text: [
                  "Under warranty service calls will be chargeable if ",
                  { text: "SETCO", bold: true, color: "#d32f2f" },
                  " finds that spindle is running as per our standards.",
                ],
                margin: [0, 0, 0, 5],
              },
              {
                text: "Warranty voids if product is tampered.",
                margin: [0, 0, 0, 5],
              },
              {
                text: [
                  "In case of any disputes all rights reserved to ",
                  { text: "SETCO", bold: true, color: "#d32f2f" },
                  " spindles India Pvt Ltd.",
                ],
                margin: [0, 0, 0, 8],
              },
            ],
            fontSize: 10, // Slightly reduced font size to fit the extra point comfortably
            lineHeight: 1.2,
          },
          { width: "5%", text: "" }, // Right Spacer
        ],
      },
      {
        text: "SETCO India/WC/010", // Updated to WC/010
        fontSize: 9,
        color: "#777777",
        alignment: "left",
        margin: [0, 10, 0, 0],
      },
    ],
  };
};

const generateOneYearWarrantyCertificate = (data: CertificateData): void => {
  const docDefinition = getOneYearWarrantyCertificateDefinition(data);
  pdfMake
    .createPdf(docDefinition)
    .download(
      `1_Year_Warranty_Certificate_${data.certificateNo || "Draft"}.pdf`,
    );
};

export default generateOneYearWarrantyCertificate;

interface OneYearWarrantyCertificateProps {
  data: CertificateData;
}

export const OneYearWarrantyCertificate: React.FC<
  OneYearWarrantyCertificateProps
> = ({ data }) => {
  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h3>1-Year Certificate Ready for Download</h3>
      <p>Customer: {data.customerName}</p>
      <p>Invoice No: {data.invoiceNo}</p>
      <p>Sr. No: {data.srNo}</p>
      <button
        onClick={() => generateOneYearWarrantyCertificate(data)}
        style={{
          padding: "10px 20px",
          backgroundColor: "#d32f2f",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Download 1-Year PDF Certificate
      </button>
    </div>
  );
};
