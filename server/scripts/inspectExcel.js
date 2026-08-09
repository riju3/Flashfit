import xlsx from 'xlsx';
import path from 'path';

const filePath = "C:\\Users\\SUBHAMOY CHOWDHURY\\Downloads\\100_products_dataset.xlsx";

try {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);

  console.log(`Successfully read sheet "${sheetName}". Total rows: ${data.length}`);
  if (data.length > 0) {
    console.log("Sample Row 0 keys:", Object.keys(data[0]));
    console.log("Sample Row 0 data:", JSON.stringify(data[0], null, 2));
    console.log("Sample Row 1 data:", JSON.stringify(data[1], null, 2));
  }
} catch (err) {
  console.error("Error reading excel file:", err);
}
