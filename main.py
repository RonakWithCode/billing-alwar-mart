from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

def create_invoice():
    # Create a PDF file
    c = canvas.Canvas("invoice.pdf", pagesize=letter)
    width, height = letter
    
    # Add the store info
    c.drawString(50, 750, "ASHOK GENERAL STORE")
    c.drawString(50, 735, "KATI GHATI, MALVIYA NAGAR, ALWAR(RAJ.)")
    c.drawString(50, 720, "Phone: 9414641072, Email: email@gmail.com")
    c.drawString(50, 705, "GST No: 08AEDPJ9090A1ZN")
    
    # Customer info
    c.drawString(50, 690, "Customer: A.P.S SCHOOL")
    c.drawString(50, 675, "Bill No: A000298, Date: 13-06-2024, Time: 19:21")
    
    # Table headers
    c.drawString(50, 650, "S.No  Description  Qty  RATE  Amt")
    
    # Items
    items = [
        ("1", "GLASS", "10", "25.00", "250.00"),
        ("2", "TEA CUP", "12", "5.00", "60.00"),
        ("3", "GOOD DAY", "10", "115.00", "115.00"),
        ("4", "SARAS RED MILK", "34", "32.00", "192.00"),
        ("5", "NAMKEEN", "1", "90.00", "90.00")
    ]
    y = 635
    for item in items:
        c.drawString(50, y, "  ".join(item))
        y -= 15
    
    # Footer
    c.drawString(50, y-20, "Pls Pay Amount: 707.00")
    c.drawString(50, y-35, "Terms & Conditions: Goods once sold not be taken back & no cash Refund.")
    
    # Save the PDF
    c.save()

create_invoice()
