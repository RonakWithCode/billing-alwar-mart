import { jsPDF } from "jspdf";

export const generatePDF = (billData, config) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'in',
    format: [7.5, 11] // 7.5 inches width and standard length
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(12).setFont("helvetica", "bold").text(config.companyName, pageWidth / 2, 0.5, { align: "center" });
  doc.setFontSize(10).setFont("helvetica", "normal");
  doc.text(config.companyAddress, pageWidth / 2, 0.7, { align: "center" });
  doc.text(`GST No: ${config.gstNumber}`, pageWidth / 2, 0.9, { align: "center" });
  doc.text(`Phone: ${config.phone}`, pageWidth / 2, 1.1, { align: "center" });
  doc.text(`E-Mail: ${config.email}`, pageWidth / 2, 1.3, { align: "center" });

  // Customer Details
  doc.setFontSize(10).setFont("helvetica", "bold");
  doc.text(`Customer: ${billData.customerName}`, 0.5, 1.7);
  doc.text(`Mobile: ${billData.customerPhone}`, 0.5, 1.9);
  doc.text(`User: ${billData.customerUser}`, 0.5, 2.1);

  // Bill Details
  doc.text(`Bill No: ${billData.billNumber}`, pageWidth - 2, 1.7);
  doc.text(`Date: ${billData.date}`, pageWidth - 2, 1.9);
  doc.text(`Time: ${billData.time}`, pageWidth - 2, 2.1);

  // Table Header
  doc.setFontSize(10).setFont("helvetica", "bold");
  doc.text('S. No.', 0.5, 2.5);
  doc.text('Description', 1.0, 2.5);
  doc.text('Qty', 3.0, 2.5);
  doc.text('RATE', 4.0, 2.5);
  doc.text('Amt', 5.0, 2.5);
  doc.setLineWidth(0.02);
  doc.line(0.5, 2.6, pageWidth - 0.5, 2.6);

  // Table Rows
  doc.setFontSize(10).setFont("helvetica", "normal");
  let y = 2.8;
  billData.items.forEach((item, index) => {
    doc.text((index + 1).toString(), 0.5, y);
    doc.text(item.productName, 1.0, y);
    doc.text(item.quantity.toString(), 3.0, y);
    doc.text(item.price.toString(), 4.0, y);
    doc.text(item.totalPrice.toString(), 5.0, y);
    y += 0.3;
  });

  // Total
  doc.setLineWidth(0.02);
  doc.line(0.5, y, pageWidth - 0.5, y);
  doc.text(`Item Qty: ${billData.items.length}`, 0.5, y + 0.2);
  doc.text(`Pls Pay Amount: ${billData.totalAmount}`, 5.0, y + 0.2);

  // Amount in Words
  doc.text(`Rs. ${billData.amountInWords}`, 0.5, y + 0.5);

  // Terms and Conditions
  doc.setFontSize(10).setFont("helvetica", "bold").text('Terms & Conditions:', 0.5, y + 0.8, { underline: true });
  config.termsAndConditions.forEach((line, index) => {
    doc.text(`${index + 1}. ${line}`, 0.5, y + 1.0 + (index * 0.2));
  });

  // Footer
  doc.text(config.footerNote, pageWidth / 2, y + 1.5 + (config.termsAndConditions.length * 0.2), { align: 'center' });

  // Save the PDF
  doc.save(`${billData.billNumber}.pdf`);
  return doc;
};
