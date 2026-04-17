import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';

export const generatePDF = async (elementId, filename = 'EnergyAI-Report.pdf') => {
  try {
    const element = document.getElementById(elementId);
    
    if (!element) {
      alert("Error: Could not find the dashboard to export.");
      return;
    }

    // 1. Force a "Desktop" width so Tailwind Grids don't collapse into mobile view
    const captureWidth = 1200;

    // 2. Capture the image using html-to-image
    const imgData = await toPng(element, {
      quality: 1.0,
      pixelRatio: 2, // High resolution for crisp text
      backgroundColor: '#f9fafb', // Matches the gray-50 background
      width: captureWidth,
      style: {
        width: `${captureWidth}px`,
        margin: '0 auto',
        padding: '40px' // Adds a nice breathing room border inside the PDF
      }
    });
    
    // 3. Calculate exact image dimensions
    // We create a temporary image object to read the true pixel dimensions
    const img = new Image();
    img.src = imgData;
    
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const imgWidth = img.width;
    const imgHeight = img.height;

    // 4. THE FIX: Create a PDF with the EXACT dimensions of the dashboard
    // No more squishing into A4!
    const pdf = new jsPDF({
      orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
      unit: 'px',
      format: [imgWidth, imgHeight]
    });

    // 5. Place the image precisely on the custom-sized PDF and save
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(filename);

  } catch (error) {
    console.error("PDF Generation Error: ", error);
    alert("Failed to generate PDF. Check the Console for details.");
  }
};