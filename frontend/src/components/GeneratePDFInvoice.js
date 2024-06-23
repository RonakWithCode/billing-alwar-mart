import { jsPDF } from 'jspdf';

export const generatePDFInvoice = (billData, config) => {
  const doc = new jsPDF('p', 'mm', [80, 297]); // Roll paper size 80mm * 297mm

  // Header
  doc.setFontSize(10).setFont('helvetica', 'bold');
  doc.text('GST INVOICE', 40, 5, { align: 'center' });
  doc.setFontSize(12).setFont('helvetica', 'bold');
  doc.text(config.companyDetails.name, 40, 10, { align: 'center' });
  doc.setFontSize(8).setFont('helvetica', 'compressed');
  doc.text(config.companyDetails.address, 40, 15, { align: 'center' });
  doc.text(`Phone: ${config.companyDetails.phone}`, 40, 20, { align: 'center' });
  doc.text(`E-Mail: ${config.companyDetails.email}`, 40, 25, { align: 'center' });
  doc.text(`GSTIN: ${config.companyDetails.gstNumber}`, 40, 30, { align: 'center' });

  // Customer Details
  doc.setFontSize(8).setFont('helvetica', 'bold');
  doc.text(`Customer: ${billData.customerDetails.name}`, 5, 35);
  doc.text(`Mobile: ${billData.customerDetails.mobile}`, 5, 40);
  doc.text(`User: ${billData.customerDetails.user}`, 5, 45);
  doc.text(`Bill No: ${billData.billDetails.number}`, 55, 35);
  doc.text(`Date: ${billData.billDetails.date}`, 55, 40);
  doc.text(`Time: ${billData.billDetails.time}`, 55, 45);

  // Table Header
  doc.setFontSize(8).setFont('helvetica', 'bold');
  doc.text('S. No.', 5, 50);
  doc.text('Description', 15, 50);
  doc.text('Qty', 50, 50);
  doc.text('RATE', 60, 50);
  doc.text('Amt', 70, 50);
  doc.setLineWidth(0.1);
  doc.line(5, 52, 75, 52);

  // Table Rows
  let y = 57;
  billData.items.forEach((item, index) => {
    doc.text(`${index + 1}`, 5, y);
    doc.text(item.description, 15, y);
    doc.text(item.quantity.toString(), 50, y);
    doc.text(item.rate.toFixed(2), 60, y);
    doc.text(item.amount.toFixed(2), 70, y);
    y += 5;
  });

  // Total
  doc.setLineWidth(0.1);
  doc.line(5, y, 75, y);
  doc.text(`Item Qty: ${billData.totals.totalQuantity}`, 5, y + 5);
  doc.text(`Pls Pay Amount: ${billData.totals.totalAmount.toFixed(2)}`, 50, y + 5);

  // Amount in Words
  doc.setFontSize(8).setFont('helvetica', 'bold');
  doc.text(`Rs. ${billData.totals.amountInWords}`, 5, y + 10);

  // Terms and Conditions
  doc.setFontSize(8).setFont('helvetica', 'bold');
  doc.text('Terms & Conditions:', 5, y + 15);
  config.footer.terms.forEach((line, index) => {
    doc.text(`${index + 1}. ${line}`, 5, y + 20 + (index * 5));
  });

  // Footer
  doc.setFontSize(8).setFont('helvetica', 'bold');
  doc.text(config.footer.thankYouMessage, 40, y + 30 + (config.footer.terms.length * 5), { align: 'center' });

  // Save the PDF
  const fileName = `${billData.billDetails.number}.pdf`;
  doc.save(fileName);
  return fileName;
};