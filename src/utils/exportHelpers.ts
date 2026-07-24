import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, AlignmentType, WidthType } from 'docx';
import { RespondentData } from '../types';

// 1. EXPORT TO EXCEL (.xlsx)
export const exportToExcel = (respondents: RespondentData[]) => {
  if (respondents.length === 0) {
    alert("Belum ada data responden untuk di-export.");
    return;
  }

  // Header Metadata Block
  const headerBlock = [
    ["UNIVERSITAS RESPATI INDONESIA (URINDO)"],
    ["FAKULTAS ILMU KESEHATAN — PROGRAM STUDI SARJANA KESEHATAN MASYARAKAT"],
    ["PT. SINAR POWERINDO UTAMA — UNIT DATA CENTER SERVER ROOM"],
    ["LAPORAN HASIL EVALUASI INTERVENSI EDUKASI ERGONOMI & MANUAL HANDLING (ErgoTech K3)"],
    ["Peneliti: Nur Virgi Arfiyanti (NIM: 235059048)"],
    ["Tanggal Cetak:", new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })],
    []
  ];

  // Data Rows
  const dataHeader = [
    "No", "Nama Responden", "ID Teknisi", "Kategori Usia", "Kategori Masa Kerja",
    "Pre-Test Pengetahuan (0-20)", "Post-Test Pengetahuan (0-20)", "Selisih Pengetahuan",
    "Pre-Test Sikap (10-40)", "Post-Test Sikap (10-40)", "Selisih Sikap",
    "Status Pengisian", "Waktu Terakhir Update"
  ];

  const dataRows = respondents.map((r, idx) => [
    idx + 1,
    r.demographics.name,
    r.demographics.empId,
    r.demographics.ageGroup === '<30' ? '< 30 Tahun' : '>= 30 Tahun',
    r.demographics.workDurationGroup === '<3' ? '< 3 Tahun' : '>= 3 Tahun',
    r.preTest?.knowledgeScore ?? 0,
    r.postTest?.knowledgeScore ?? 0,
    (r.postTest?.knowledgeScore || 0) - (r.preTest?.knowledgeScore || 0),
    r.preTest?.attitudeScore ?? 0,
    r.postTest?.attitudeScore ?? 0,
    (r.postTest?.attitudeScore || 0) - (r.preTest?.attitudeScore || 0),
    r.postTest ? 'Lengkap (Pre & Post)' : 'Hanya Pre-Test',
    new Date(r.createdAt).toLocaleString('id-ID')
  ]);

  const worksheet = XLSX.utils.aoa_to_sheet([...headerBlock, dataHeader, ...dataRows]);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 5 }, { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 20 },
    { wch: 26 }, { wch: 26 }, { wch: 18 },
    { wch: 22 }, { wch: 22 }, { wch: 15 },
    { wch: 20 }, { wch: 22 }
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data 35 Responden SPSS");

  XLSX.writeFile(workbook, `Laporan_Evaluasi_ErgoTech_K3_URINDO_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

// 2. EXPORT TO DOCX (.docx)
export const exportToDocx = async (respondents: RespondentData[]) => {
  if (respondents.length === 0) {
    alert("Belum ada data responden untuk di-export.");
    return;
  }

  // Calculate Summary
  const totalCount = respondents.length;
  const avgPreK = totalCount > 0 ? (respondents.reduce((sum, r) => sum + (r.preTest?.knowledgeScore || 0), 0) / totalCount).toFixed(2) : "0";
  const avgPostK = totalCount > 0 ? (respondents.reduce((sum, r) => sum + (r.postTest?.knowledgeScore || 0), 0) / totalCount).toFixed(2) : "0";
  const avgPreA = totalCount > 0 ? (respondents.reduce((sum, r) => sum + (r.preTest?.attitudeScore || 0), 0) / totalCount).toFixed(2) : "0";
  const avgPostA = totalCount > 0 ? (respondents.reduce((sum, r) => sum + (r.postTest?.attitudeScore || 0), 0) / totalCount).toFixed(2) : "0";

  const createHeaderCell = (text: string) => new TableCell({
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, color: "FFFFFF" })] })],
    shading: { fill: "0F172A" }
  });

  // Data Table Rows
  const tableRows = [
    new TableRow({
      children: [
        createHeaderCell("No"),
        createHeaderCell("Nama Responden"),
        createHeaderCell("ID Teknisi"),
        createHeaderCell("Usia"),
        createHeaderCell("Masa Kerja"),
        createHeaderCell("Pre-K"),
        createHeaderCell("Post-K"),
        createHeaderCell("Pre-S"),
        createHeaderCell("Post-S"),
      ],
    }),
    ...respondents.map((r, idx) => new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ text: `${idx + 1}` })] }),
        new TableCell({ children: [new Paragraph({ text: r.demographics.name })] }),
        new TableCell({ children: [new Paragraph({ text: r.demographics.empId })] }),
        new TableCell({ children: [new Paragraph({ text: `${r.demographics.ageGroup} thn` })] }),
        new TableCell({ children: [new Paragraph({ text: `${r.demographics.workDurationGroup} thn` })] }),
        new TableCell({ children: [new Paragraph({ text: `${r.preTest?.knowledgeScore ?? '-'}` })] }),
        new TableCell({ children: [new Paragraph({ text: `${r.postTest?.knowledgeScore ?? '-'}` })] }),
        new TableCell({ children: [new Paragraph({ text: `${r.preTest?.attitudeScore ?? '-'}` })] }),
        new TableCell({ children: [new Paragraph({ text: `${r.postTest?.attitudeScore ?? '-'}` })] }),
      ]
    }))
  ];

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Top Accent Line
        new Paragraph({
          children: [new TextRun({ text: "_________________________________________________________________________________", color: "059669", bold: true })],
          alignment: AlignmentType.CENTER
        }),
        // Header Text Block
        new Paragraph({
          children: [
            new TextRun({ text: "PT. SINAR POWERINDO UTAMA  |  UNIVERSITAS RESPATI INDONESIA", bold: true, size: 20, color: "0F172A" })
          ],
          alignment: AlignmentType.CENTER
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "LAPORAN HASIL EVALUASI ERGONOMI K3 (ErgoTech K3)", bold: true, size: 26, color: "059669" })
          ],
          alignment: AlignmentType.CENTER
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Riset Skripsi: Nur Virgi Arfiyanti (NIM: 235059048) — FIK Kesmas URINDO", italics: true, size: 18, color: "64748B" })
          ],
          alignment: AlignmentType.CENTER
        }),
        new Paragraph({ text: "" }),

        // Summary Statistics Paragraph
        new Paragraph({
          children: [
            new TextRun({ text: "RANGKUMAN STATISTIK EVALUASI LAPANGAN:", bold: true, color: "0F172A" }),
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `• Total Sampel Responden: ${totalCount} Teknisi Manual Handling\n` }),
            new TextRun({ text: `• Pengetahuan Ergonomi (0-20): Rerata Pre-Test = ${avgPreK}  ==>  Rerata Post-Test = ${avgPostK}\n` }),
            new TextRun({ text: `• Sikap Pencegahan MSDs (10-40): Rerata Pre-Test = ${avgPreA}  ==>  Rerata Post-Test = ${avgPostA}\n` }),
          ]
        }),
        new Paragraph({ text: "" }),

        // Main Table
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: tableRows
        }),
        new Paragraph({ text: "" }),

        // Signatures Block
        new Paragraph({
          children: [
            new TextRun({ text: "Jakarta, " + new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }), italics: true })
          ],
          alignment: AlignmentType.RIGHT
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Peneliti Skripsi K3 URINDO,\n\n\n\n", bold: true }),
            new TextRun({ text: "Nur Virgi Arfiyanti", underline: {} }),
            new TextRun({ text: "\nNIM: 235059048" })
          ],
          alignment: AlignmentType.RIGHT
        })
      ]
    }]
  });

  const blob = await Packer.toBlob(doc);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Laporan_Evaluasi_ErgoTech_K3_URINDO_${new Date().toISOString().slice(0, 10)}.docx`;
  a.click();
  window.URL.revokeObjectURL(url);
};
