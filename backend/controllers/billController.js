const mongoose = require('mongoose');
const { PDFDocument, rgb } = require('pdf-lib'); // Ensure you import these if not already imported
const Bill = require('../models/billModel'); // Assume you have created a Bill model

const generateInvoice = async (data) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size in points

  const { customerName, billNumber, date, time, mobileNumber, items, totalAmount, amountInWords } = data;

  // Header
  page.drawText('ASHOK GENERAL STORE', { x: 50, y: 800, size: 20, color: rgb(0, 0, 0) });
  page.drawText('KATI GHATI, MALVIYA NAGAR', { x: 50, y: 780, size: 12, color: rgb(0, 0, 0) });
  page.drawText('ALWAR (RAJ.)', { x: 50, y: 765, size: 12, color: rgb(0, 0, 0) });
  page.drawText('Phone : 9414641072', { x: 50, y: 750, size: 12, color: rgb(0, 0, 0) });
  page.drawText('E-Mail : @gmail.com', { x: 50, y: 735, size: 12, color: rgb(0, 0, 0) });
  page.drawText('08AEDPJ9090A1ZN', { x: 50, y: 720, size: 12, color: rgb(0, 0, 0) });

  // Customer Details
  page.drawText(`Customer: ${customerName || 'User'}`, { x: 50, y: 700, size: 12, color: rgb(0, 0, 0) });
  page.drawText(`Mobile  : ${mobileNumber || '0'}`, { x: 50, y: 685, size: 12, color: rgb(0, 0, 0) });
  page.drawText(`Bill No. ${billNumber}`, { x: 50, y: 670, size: 12, color: rgb(0, 0, 0) });
  page.drawText(`Date : ${date}`, { x: 50, y: 655, size: 12, color: rgb(0, 0, 0) });
  page.drawText(`Time : ${time}`, { x: 50, y: 640, size: 12, color: rgb(0, 0, 0) });

  // Table Headers
  page.drawText('S. Description', { x: 50, y: 620, size: 12, color: rgb(0, 0, 0) });
  page.drawText('Qty', { x: 250, y: 620, size: 12, color: rgb(0, 0, 0) });
  page.drawText('RATE', { x: 300, y: 620, size: 12, color: rgb(0, 0, 0) });
  page.drawText('Amt', { x: 350, y: 620, size: 12, color: rgb(0, 0, 0) });

  // Product Details
  let currentY = 600;
  items.forEach((item, index) => {
    page.drawText(`${index + 1}. ${item.productName}`, { x: 50, y: currentY, size: 12, color: rgb(0, 0, 0) });
    page.drawText(`${item.quantity}`, { x: 250, y: currentY, size: 12, color: rgb(0, 0, 0) });
    page.drawText(`${item.price}`, { x: 300, y: currentY, size: 12, color: rgb(0, 0, 0) });
    page.drawText(`${item.totalPrice}`, { x: 350, y: currentY, size: 12, color: rgb(0, 0, 0) });
    currentY -= 20;
  });

  // Total
  page.drawText(`Total Items: ${items.length}`, { x: 50, y: currentY - 20, size: 12, color: rgb(0, 0, 0) });
  page.drawText(`Pls Pay Amount : ${totalAmount}`, { x: 50, y: currentY - 40, size: 12, color: rgb(0, 0, 0) });
  page.drawText(`Rs. ${amountInWords}`, { x: 50, y: currentY - 60, size: 12, color: rgb(0, 0, 0) });

  // Footer
  page.drawText('Terms & Conditions :-', { x: 50, y: currentY - 80, size: 12, color: rgb(0, 0, 0) });
  page.drawText('1. Goods once sold not be taken back & no cash Refund.', { x: 50, y: currentY - 100, size: 12, color: rgb(0, 0, 0) });
  page.drawText('2. All subjects to Alwar Jurisdiction Only.', { x: 50, y: currentY - 120, size: 12, color: rgb(0, 0, 0) });
  page.drawText('!!! Thanks !!! Visit Again !!!', { x: 50, y: currentY - 140, size: 12, color: rgb(0, 0, 0) });
  page.drawText('**Free Home Delivery Available **', { x: 50, y: currentY - 160, size: 12, color: rgb(0, 0, 0) });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};

const saveBill = async (req, res) => {
  const billData = req.body;
  try {
    const bill = new Bill(billData);
    await bill.save();

    const pdfBytes = await generateInvoice(billData);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBytes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to save bill', error });
  }
};

module.exports = { saveBill };
