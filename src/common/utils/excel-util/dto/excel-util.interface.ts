interface GenerateExcelParams {
  // (danh sách các sheet trong file Excel)
  worksheets: {
    sheetName?: string;
    data: any[];
    fieldsExclude?: string[]; // (Các field KHÔNG muốn xuất ra Excel)
    fieldsMapping?: Record<string, string>;
    fieldsExtend?: string[]; // (Thêm field không có sẵn trong data)
  }[];
}

type File = Express.Multer.File; // (kiểu file upload từ Multer)

export type { GenerateExcelParams, File };
