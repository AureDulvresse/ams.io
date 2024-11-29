import * as XLSX from "xlsx";
  
const exportToExcel = (data : any, fileName:STRING) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, fileName);

    XLSX.writeFile(workbook, `${fileName}_data.xlsx`);
};

export default exportToExcel;