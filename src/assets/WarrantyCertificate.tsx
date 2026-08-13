import generate6, { type CertificateData } from "./WarrantyCertificate-6";
import generate12 from "./WarrantyCertificate-12";

export type { CertificateData };

const generateWarrantyCertificate = (data: CertificateData, orderCreationDate?: string): void => {
  if (!orderCreationDate) {
    // Fallback to 6 months if creation date is missing
    generate6(data);
    return;
  }

  const created = new Date(orderCreationDate);
  const validUntil = new Date(data.validUntil);

  if (isNaN(created.getTime()) || isNaN(validUntil.getTime())) {
    generate6(data);
    return;
  }

  // Calculate difference in months
  const diffInMs = validUntil.getTime() - created.getTime();
  const diffInMonths = diffInMs / (1000 * 60 * 60 * 24 * 30.44);

  // If difference is 9 months or more, we assume it's a 12-month warranty (to allow for buffer)
  if (diffInMonths >= 9) {
    generate12(data);
  } else {
    generate6(data);
  }
};

export default generateWarrantyCertificate;
