import { jsPDF } from 'jspdf';

export const generatePDFInvoice = (billData, config) => {
  // Create a new jsPDF document with a page size of 70mm x 297mm
  const doc = new jsPDF('portrait'); // Roll paper size 70mm * 297mm


  // Header section
  doc.setFontSize(10).setFont('helvetica', 'bold'); // Set font size and style for header
  doc.text('GST INVOICE', 35, 5, { align: 'center' }); // Centered text for GST INVOICE
  doc.setFontSize(12).setFont('helvetica', 'bold'); // Set font size and style for company name
  doc.text(config.companyDetails.name, 35, 10, { align: 'center' }); // Centered company name
  doc.setFontSize(8).setFont('helvetica', 'bold'); // Set font size and style for address details
  doc.text(config.companyDetails.address, 35, 15, { align: 'center' }); // Centered company address
  doc.text(`Phone: ${config.companyDetails.phone}`, 35, 20, { align: 'center' }); // Centered phone number
  doc.text(`E-Mail: ${config.companyDetails.email}`, 35, 25, { align: 'center' }); // Centered email address
  doc.text(`GSTIN: ${config.companyDetails.gstNumber}`, 35, 30, { align: 'center' }); // Centered GST number
  doc.setLineWidth(0.3); // Set line width for table lines

  doc.line(0, 32, 80, 32); // Draw line below table header

  doc.setFontSize(8).setFont('helvetica', 'bold'); // Set font size and style for customer details

  doc.text(`Customer: ${billData.customerDetails.name}`, 2, 35); // Customer name
  doc.text(`Mobile: ${billData.customerDetails.mobile}`, 2, 40); // Customer mobile number
  doc.text(`User: ${billData.customerDetails.user}`, 2, 45); // User
  doc.text(`Bill No: ${billData.billDetails.number}`, 50, 35); // Bill number
  doc.text(`Date: ${billData.billDetails.date}`, 50, 40); // Bill date
  doc.text(`Time: ${billData.billDetails.time}`, 50, 45); // Bill time

  doc.setLineWidth(0.3); // Set line width for table lines

  doc.line(0, 47, 80, 47); // Draw line below table header


  // Table header section
  doc.setFontSize(8).setFont('helvetica', 'bold'); // Set font size and style for table headers
  doc.text('S. No.', 2, 50); // Serial number column
  doc.text('Description', 10, 50); // Description column
  doc.text('Qty', 40, 50); // Quantity column
  doc.text('RATE', 50, 50); // Rate column
  doc.text('Amt', 60, 50); // Amount column
  doc.setLineWidth(0.3); // Set line width for table lines
  doc.line(0, 52, 80, 52); // Draw line below table header

  
  // Table rows section
  let y = 57; // Starting y-coordinate for table rows
  billData.items.forEach((item, index) => {
    const description = doc.splitTextToSize(item.description, 32); // Wrap text to fit within 28mm width
    doc.setFont('helvetica', 'bold'); // Set font style for table rows
    const lineHeight = 5; // Line height for text
    const lineCount = description.length; // Number of lines for wrapped text

    // Print each line of the description
    description.forEach((line, i) => {
      if (i === 0) {
        doc.text(`${index + 1}`, 2, y + (i * lineHeight)); // Serial number
      }
      if(lineCount > 1){
        doc.text(line, 5, y + (i * 3)); // Description
      }else{
        doc.text(line, 5, y + (i * 2)); // Description

      }
    });

    doc.text(item.quantity.toString(), 40, y); // Quantity
    doc.text(item.rate.toFixed(2), 46, y); // Rate
    doc.text(item.amount.toFixed(2), 60, y); // Amount
    // y += lineHeight * lineCount + 2; // Adjust y position based on the number of lines in the description

    if(lineCount > 1){
      y += 3 * lineCount + 2; // Adjust y position based on the number of lines in the description

      // doc.text(line, 5, y + (i * 5)); // Description
    }else{
      // doc.text(line, 5, y + (i * 2)); // Description
      y += 2 * lineCount + 2; // Adjust y position based on the number of lines in the description
    }


  });
  
  // Total section
  doc.setLineWidth(0.3); // Set line width for table lines
  doc.line(0, y-2, 80, y-2); // Draw line below last table row
  doc.setFont('helvetica', 'bold'); // Set font style for total section
  doc.text(`Item Qty: ${billData.totals.totalQuantity}`, 5, y+1); // Total item quantity
  doc.setLineWidth(0.3); // Set line width for table lines
  doc.line(0, y+3, 80, y+3); // Draw line below last table row
  doc.text(`Pls Pay Amount: ${billData.totals.totalAmount.toFixed(2)}`, 25, y + 6); // Total amount
  doc.setLineWidth(0.3); // Set line width for table lines
  doc.line(0, y+8, 80, y+8); // Draw line below last table row

  // Amount in words section 
  doc.text(`Rs. ${billData.totals.amountInWords}`, 2, y + 11); // Total amount in words

  doc.setLineWidth(0.3); // Set line width for table lines
  doc.line(0, y+12, 80, y+12); // Draw line below last table row

  // Terms and Conditions section
  doc.text('Terms & Conditions:', 2, y + 16); // Terms and conditions header
  doc.setFontSize(6).setFont('helvetica', 'bold'); // Set font size and style for terms
  config.footer.terms.forEach((line, index) => {
    doc.text(`${index + 1}. ${line}`, 2, y + 21 + (index * 5)); // `Each term and condition
  });
  // doc.text(config.footer.terms[0], 2, y + 20); // Each term and condition
  // doc.text(config.footer.terms[1], 2, y + 25); // Each term and condition
 

  // Footer section
  doc.setFontSize(9).setFont('helvetica', 'bold'); // Set font size and style for terms

  doc.text(config.footer.thankYouMessage, 35, y + 25 + (config.footer.terms.length * 5), { align: 'center' }); // Footer message

  // Save the PDF
  const fileName = `${billData.billDetails.number}.pdf`; // File name based on bill number
  doc.save(fileName); // Save the PDF
  return fileName; // Return file name
};
