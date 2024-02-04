import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';

// 表格内容起始行（包含表头）
let bodyStartRow = 1;
const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

const createWsSheet = (header, columns, dataList, exportName, options = {}) => {
  if (!(header && dataList && header.length && dataList.length)) {
    // Message.error('导出失败');
    return;
  }

  dataList.forEach((item) => {
    Object.keys(item).forEach((key) => {
      if (item[key] === null || item[key] === undefined) {
        item[key] = '--';
      }
    });
  });

  // 创建工作簿
  const workbook = new ExcelJS.Workbook();
  workbook.created = new Date();
  workbook.modified = new Date();
  // 获取水印
  const base64 = setWatermark('广东柯内特环境科技有限公司');
  const imageId1 = workbook.addImage({ base64, extension: 'png' });
  // 创建带有红色标签颜色的工作表
  let worksheet = workbook.addWorksheet('Sheet1', {
    //新建工作表
    // views: [{ state: 'frozen', xSplit: 1, ySplit: 1 }], // 冻结视图：xSplit：冻结多少列
  });

  // 添加背景图片
  worksheet.addBackgroundImage(imageId1);

  setDefaultStyle({ worksheet, columns });
  setTitle({ worksheet, options });
  setHeader({ worksheet, bodyStartRow, header });
  setBodyCells({ worksheet, dataList });
  mergeCells({ worksheet, options });
  outputTable({ workbook, exportName });
};

const outputTable = ({ workbook, exportName }) => {
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(blob, exportName);
  });
};

const setDefaultStyle = ({ worksheet, columns }) => {
  worksheet.properties.defaultColWidth = 14;
  worksheet.columns = columns;
  worksheet.columns.forEach(function (column) {
    var dataMax = 0;
    column.eachCell({ includeEmpty: true }, function (cell) {
      dataMax = cell.value ? cell.value.toString().length : 0;
      if (dataMax <= column.header.length + 2) {
        if (column.width > dataMax) {
          //retain its default width
        } else {
          column.width = column.header.length + 3;
        }
      } else {
        column.width = dataMax + 3;
        column.header.length = dataMax + 3;
      }
      dataMax = 0;
    });
  });
};

const setTitle = ({ worksheet, options }) => {
  // 判断是否存在表头选项
  if (options.excelTitle && Array.isArray(options.excelTitle)) {
    bodyStartRow = options.excelTitle.length + 1;
    options.excelTitle.forEach((item, index) => {
      worksheet.getRow(index + 1).values = [item];
      if (index === 0) {
        worksheet.getRow(index + 1).font = {
          bold: true,
          size: 18,
        };
      }
    });
  } else if (options.excelTitle) {
    bodyStartRow = 2;
    worksheet.getRow(1).values = [options.excelTitle];
    worksheet.getRow(1).font = {
      bold: true,
      size: 18,
    };
  } else {
    bodyStartRow = 1;
  }
};

const setHeader = ({ worksheet, bodyStartRow, header }) => {
  if (header.length && Array.isArray(header[0])) {
    header.forEach((itemArr, index) => {
      // 添加数据
      worksheet.getRow(bodyStartRow + index).values = [];
      // worksheet.mergeCells(bodyStartRow + index, 1, bodyStartRow + index, columns.length); //第1行  第1列  合并到第1行的第n列
      //   const title = worksheet.getRow(1).getCell(1)//第一行第一个单元格
      //   title.font = { size: 24 }
      worksheet.getRow(bodyStartRow + index).height = 40;
      worksheet.getRow(bodyStartRow + index).values = itemArr;
      for (let i = 0; i <= header.length - 1; i += 1) {
        setHeaderStyle({ worksheet, i });
      }
    });
  } else {
    // 添加数据
    worksheet.getRow(bodyStartRow).values = [];
    // worksheet.mergeCells(bodyStartRow, 1, bodyStartRow, columns.length); //第1行  第1列  合并到第1行的第n列
    //   const title = worksheet.getRow(1).getCell(1)//第一行第一个单元格
    //   title.font = { size: 24 }
    worksheet.getRow(bodyStartRow).height = 40;
    worksheet.getRow(bodyStartRow).values = header;
    setHeaderStyle({ worksheet });
  }
};

const setHeaderStyle = ({ worksheet, i = 0 }) => {
  worksheet.getRow(bodyStartRow + i).eachCell({ includeEmpty: true }, (cell, colNumber) => {
    worksheet.getRow(bodyStartRow + i).getCell(colNumber).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffd3d3d3' },
      bgColor: { argb: 'FF0000FF' },
    };
    worksheet.getRow(bodyStartRow + i).getCell(colNumber).font = {
      bold: true,
    };
    worksheet.getRow(bodyStartRow + i).getCell(colNumber).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  });
};

const setBodyCells = ({ worksheet, dataList }) => {
  worksheet.addRows(dataList);
  // 自定义样式
  worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    if (rowNumber > bodyStartRow) {
      worksheet.getRow(rowNumber).height = 28.6;
    }
    worksheet.getRow(rowNumber).eachCell({ includeEmpty: true }, (cell, colNumber) => {
      // 文字居中
      worksheet.getRow(rowNumber).getCell(colNumber).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };
      //边框样式
      worksheet.getRow(rowNumber).getCell(colNumber).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  });
};

const mergeCells = ({ worksheet, options }) => {
  // 合并行（按开始行，开始列，结束行，结束列合并（相当于 K10:M12））
  if (options.mergeList && options.mergeList.length) {
    options.mergeList.forEach((item) => {
      worksheet.mergeCells(...item);
    });
  }
};

/**
 * 判断该数据是否为空
 * @param data 要判断的数据
 * @returns 布尔值:true/false
 */
// eslint-disable-next-line no-unused-vars
const isNull = (data) => {
  return !!data;
};

/**
 * 绘画水印
 * @param str 要做出水印的文字
 * @returns Base64
 */
const setWatermark = (str) => {
  let id = '1.23452384164.123412416';

  if (document.getElementById(id) !== null) {
    document.body.removeChild(document.getElementById(id));
  }
  // 创建一个画布
  let can = document.createElement('canvas');
  // 设置画布的长宽
  can.width = 500;
  can.height = 220;
  let cans = can.getContext('2d');
  // 旋转角度
  cans.rotate((-25 * Math.PI) / 180);
  // 设置字体大小
  cans.font = '300 25px Microsoft JhengHei';
  // 设置填充绘画的颜色、渐变或者模式
  cans.fillStyle = 'rgba(130, 142, 162, 0.5)';
  // 设置文本内容的当前对齐方式
  cans.textAlign = 'center';
  // 设置在绘制文本时使用的当前文本基线
  cans.textBaseline = 'Middle';
  cans.fillText(str, 80, 180);

  const dataURL = can.toDataURL('image/png');
  return dataURL;
};
export default createWsSheet;
