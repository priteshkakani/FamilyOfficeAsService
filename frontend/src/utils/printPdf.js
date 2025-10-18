import html2pdf from "html2pdf.js";

export function printElementToPdf(el, filename = "export.pdf") {
  if (!el) return;
  const opt = {
    margin: 0.5,
    filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  };
  html2pdf().from(el).set(opt).save();
}
