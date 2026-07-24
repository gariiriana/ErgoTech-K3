import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, AlignmentType, WidthType, ImageRun, BorderStyle, HeadingLevel, TableBorders } from 'docx';
import { RespondentData } from '../types';
import { POWERINDO_LOGO_BASE64, URINDO_LOGO_BASE64 } from './logoBase64';
import { generateBarChartImage } from './chartGenerator';

// Helper to determine Likert SPSS Category (10-40 Scale)
export const getLikertCategory = (score: number): 'Kurang' | 'Baik' => {
  return score >= 26 ? 'Baik' : 'Kurang';
};

// Helper to format full Timestamp (Hari, Tanggal, Bulan, Tahun, Jam:Menit:Detik WIB)
export const formatFullTimestamp = (isoString?: string) => {
  if (!isoString) return '-';
  try {
    const d = new Date(isoString);
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const dayName = dayNames[d.getDay()];
    const dateNum = String(d.getDate()).padStart(2, '0');
    const monthName = monthNames[d.getMonth()];
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return `${dayName}, ${dateNum} ${monthName} ${year} • ${hours}:${minutes}:${seconds} WIB`;
  } catch (err) {
    return isoString;
  }
};

// Helper to convert base64 string to Uint8Array for docx ImageRun
const base64ToUint8Array = (base64Str: string): Uint8Array => {
  const binaryString = window.atob(base64Str);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

// Shared stats computation
const computeStats = (respondents: RespondentData[]) => {
  const totalCount = respondents.length;
  const avgPreA = totalCount > 0 ? respondents.reduce((sum, r) => sum + (r.preTest?.attitudeScore || 0), 0) / totalCount : 0;
  const avgPostA = totalCount > 0 ? respondents.reduce((sum, r) => sum + (r.postTest?.attitudeScore || 0), 0) / totalCount : 0;
  const preBaikCount = respondents.filter(r => (r.preTest?.attitudeScore || 0) >= 26).length;
  const postBaikCount = respondents.filter(r => (r.postTest?.attitudeScore || 0) >= 26).length;
  const preBaikPct = totalCount > 0 ? (preBaikCount / totalCount) * 100 : 0;
  const postBaikPct = totalCount > 0 ? (postBaikCount / totalCount) * 100 : 0;
  return { totalCount, avgPreA, avgPostA, preBaikCount, postBaikCount, preBaikPct, postBaikPct };
};

// Helper to get per-item P1-P10 scores
const getItemScores = (answersList: any[], totalScore: number) => {
  return Array.from({ length: 10 }, (_, i) => {
    const pNum = i + 1;
    const found = answersList.find((a: any) => a.questionId === pNum);
    if (found && found.selectedScore) return found.selectedScore;
    const base = Math.floor(totalScore / 10);
    const rem = totalScore % 10;
    return base + (pNum <= rem ? 1 : 0);
  });
};

// ============================================================
// 1. EXPORT TO EXCEL (.xlsx) — PROFESSIONAL FORMAT WITH CHART
// ============================================================
export const exportToExcel = (respondents: RespondentData[]) => {
  if (respondents.length === 0) {
    alert("Belum ada data responden untuk di-export.");
    return;
  }

  const stats = computeStats(respondents);
  const { totalCount, avgPreA, avgPostA, preBaikCount, postBaikCount, preBaikPct, postBaikPct } = stats;

  // ——— Sheet 1: Data Responden SPSS ———
  const dataHeader = [
    "No", "Waktu Selesai", "Nama Responden", "ID / Posisi",
    "Jenis Kelamin", "Usia", "Kat. Usia", "Masa Kerja", "Kat. Masa Kerja",
    "Pre_P1", "Pre_P2", "Pre_P3", "Pre_P4", "Pre_P5",
    "Pre_P6", "Pre_P7", "Pre_P8", "Pre_P9", "Pre_P10",
    "Total_Pre", "Kat_Pre",
    "Post_P1", "Post_P2", "Post_P3", "Post_P4", "Post_P5",
    "Post_P6", "Post_P7", "Post_P8", "Post_P9", "Post_P10",
    "Total_Post", "Kat_Post",
    "Delta", "Status"
  ];

  const dataRows = respondents.map((r, idx) => {
    const preA = r.preTest?.attitudeScore ?? 0;
    const postA = r.postTest?.attitudeScore ?? 0;
    const preItems = getItemScores(r.preTest?.attitudeAnswers || [], preA);
    const postItems = getItemScores(r.postTest?.attitudeAnswers || [], postA);

    return [
      idx + 1,
      formatFullTimestamp(r.postTest?.completedAt || r.createdAt),
      r.demographics.name,
      r.demographics.empId,
      r.demographics.gender || 'Laki-laki',
      r.demographics.age || '-',
      r.demographics.ageGroup === '<30' ? '< 30 Tahun' : '>= 30 Tahun',
      r.demographics.workDuration || '-',
      r.demographics.workDurationGroup === '<3' ? '< 3 Tahun' : '>= 3 Tahun',
      ...preItems,
      preA,
      getLikertCategory(preA),
      ...postItems,
      postA,
      getLikertCategory(postA),
      postA - preA,
      'Tuntas'
    ];
  });

  const wsData = XLSX.utils.aoa_to_sheet([dataHeader, ...dataRows]);

  // Column widths — compact and clean
  wsData['!cols'] = [
    { wch: 4 }, { wch: 30 }, { wch: 20 }, { wch: 16 },
    { wch: 13 }, { wch: 6 }, { wch: 14 }, { wch: 10 }, { wch: 14 },
    { wch: 7 }, { wch: 7 }, { wch: 7 }, { wch: 7 }, { wch: 7 },
    { wch: 7 }, { wch: 7 }, { wch: 7 }, { wch: 7 }, { wch: 7 },
    { wch: 10 }, { wch: 9 },
    { wch: 7 }, { wch: 7 }, { wch: 7 }, { wch: 7 }, { wch: 7 },
    { wch: 7 }, { wch: 7 }, { wch: 7 }, { wch: 7 }, { wch: 7 },
    { wch: 10 }, { wch: 9 },
    { wch: 7 }, { wch: 9 }
  ];

  // ——— Sheet 2: Ringkasan Statistik & Grafik ———
  const summaryData = [
    ["LAPORAN RINGKASAN EVALUASI SKALA LIKERT SKRIPSI K3"],
    ["Evaluasi Efektivitas Website ErgoTech K3 Terhadap Pemahaman & Sikap Ergonomi Teknisi"],
    [],
    ["Informasi Penelitian"],
    ["Peneliti", "Nur Virgi Arfiyanti (NIM: 235059048)"],
    ["Institusi", "Program Studi Sarjana Kesehatan Masyarakat URINDO"],
    ["Lokasi", "PT. Sinar Powerindo Utama (Data Center Server Room)"],
    ["Tanggal Cetak", formatFullTimestamp(new Date().toISOString())],
    [],
    ["Ringkasan Statistik Skala Likert Ergonomi"],
    ["Indikator", "Nilai"],
    ["Total Responden", `${totalCount} Teknisi`],
    ["Rata-rata Skor Pre-Test Likert", `${avgPreA.toFixed(2)} / 40 Poin`],
    ["Rata-rata Skor Post-Test Likert", `${avgPostA.toFixed(2)} / 40 Poin`],
    ["Peningkatan Rata-rata", `+${(avgPostA - avgPreA).toFixed(2)} Poin`],
    ["Responden Kategori Baik (Pre ≥26)", `${preBaikCount} (${preBaikPct.toFixed(0)}%)`],
    ["Responden Kategori Baik (Post ≥26)", `${postBaikCount} (${postBaikPct.toFixed(0)}%)`],
    [],
    ["Data Grafik Batang — Rata-rata Skor Likert (Skala 10-40)"],
    ["Kategori", "Skor"],
    ["Pre-Test Likert", avgPreA],
    ["Post-Test Likert", avgPostA],
    [],
    ["Data Grafik Batang — Persentase Kategori Baik (≥26 Poin)"],
    ["Kategori", "Persentase (%)"],
    ["Pre-Test Baik", preBaikPct],
    ["Post-Test Baik", postBaikPct],
    [],
    ["Cut-off Benchmark Kategori Baik", "≥ 26.0 Poin dari 40"]
  ];

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  wsSummary['!cols'] = [{ wch: 38 }, { wch: 35 }];

  // Merge header cells
  wsSummary['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, wsData, "Data Responden SPSS");
  XLSX.utils.book_append_sheet(workbook, wsSummary, "Ringkasan & Grafik");

  XLSX.writeFile(workbook, `Tabel_Induk_Likert_SPSS_ErgoTech_K3_URINDO_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

// ============================================================
// 2. EXPORT TO DOCX — PROFESSIONAL WITH REAL BAR CHART IMAGE
// ============================================================
export const exportToDocx = async (respondents: RespondentData[]) => {
  if (respondents.length === 0) {
    alert("Belum ada data responden untuk di-export.");
    return;
  }

  const stats = computeStats(respondents);
  const { totalCount, avgPreA, avgPostA, preBaikCount, postBaikCount, preBaikPct, postBaikPct } = stats;

  // Generate bar chart images using Canvas
  let scoreChartBytes: Uint8Array | null = null;
  let pctChartBytes: Uint8Array | null = null;

  try {
    scoreChartBytes = generateBarChartImage({
      title: 'Grafik Batang: Rata-rata Skor Likert Ergonomi (Skala 10 - 40)',
      yAxisLabel: 'Skor Likert',
      maxValue: 40,
      width: 480,
      height: 300,
      showCutoffLine: true,
      cutoffValue: 26,
      cutoffLabel: 'Cut-off Baik ≥ 26',
      data: [
        { label: 'Pre-Test Likert', value: avgPreA, color: '#64748B' },
        { label: 'Post-Test Likert', value: avgPostA, color: '#059669' },
      ]
    });
  } catch (err) {
    console.error('Error generating score chart:', err);
  }

  try {
    pctChartBytes = generateBarChartImage({
      title: 'Grafik Batang: Persentase Responden Kategori Baik (≥ 26 Poin)',
      yAxisLabel: 'Persentase (%)',
      maxValue: 100,
      width: 480,
      height: 300,
      data: [
        { label: 'Pre-Test Baik', value: preBaikPct, color: '#94A3B8' },
        { label: 'Post-Test Baik', value: postBaikPct, color: '#059669' },
      ]
    });
  } catch (err) {
    console.error('Error generating pct chart:', err);
  }

  // Embed logos
  let powerindoImgRun: ImageRun | null = null;
  let urindoImgRun: ImageRun | null = null;

  try {
    powerindoImgRun = new ImageRun({ data: base64ToUint8Array(POWERINDO_LOGO_BASE64), transformation: { width: 100, height: 45 }, type: 'png' });
  } catch (err) { console.error("Error embedding Powerindo logo:", err); }

  try {
    urindoImgRun = new ImageRun({ data: base64ToUint8Array(URINDO_LOGO_BASE64), transformation: { width: 48, height: 48 }, type: 'png' });
  } catch (err) { console.error("Error embedding URINDO logo:", err); }

  // Helper for thin-border cells
  const thinBorder = {
    top: { style: BorderStyle.SINGLE, size: 1, color: '999999' },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: '999999' },
    left: { style: BorderStyle.SINGLE, size: 1, color: '999999' },
    right: { style: BorderStyle.SINGLE, size: 1, color: '999999' },
  } as const;

  const makeCell = (text: string, bold = false, size = 18, color = '333333') => {
    return new TableCell({
      borders: thinBorder,
      children: [new Paragraph({
        spacing: { before: 40, after: 40 },
        children: [new TextRun({ text, bold, size, color })]
      })]
    });
  };

  // Build children array
  const children: (Paragraph | Table)[] = [];

  // ── Dual Logo Header Table ──
  children.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: TableBorders.NONE,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 20, type: WidthType.PERCENTAGE },
            borders: { top: { style: BorderStyle.NONE, size: 0 }, bottom: { style: BorderStyle.NONE, size: 0 }, left: { style: BorderStyle.NONE, size: 0 }, right: { style: BorderStyle.NONE, size: 0 } },
            verticalAlign: 'center' as any,
            children: [new Paragraph({ alignment: AlignmentType.LEFT, children: powerindoImgRun ? [powerindoImgRun] : [new TextRun({ text: "PTU", bold: true, size: 16 })] })]
          }),
          new TableCell({
            width: { size: 60, type: WidthType.PERCENTAGE },
            borders: { top: { style: BorderStyle.NONE, size: 0 }, bottom: { style: BorderStyle.NONE, size: 0 }, left: { style: BorderStyle.NONE, size: 0 }, right: { style: BorderStyle.NONE, size: 0 } },
            verticalAlign: 'center' as any,
            children: [
              new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 20 }, children: [new TextRun({ text: "PT. SINAR POWERINDO UTAMA", bold: true, size: 22, color: "1E293B" })] }),
              new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 20 }, children: [new TextRun({ text: "FAKULTAS ILMU KESEHATAN — UNIVERSITAS RESPATI INDONESIA", bold: true, size: 16, color: "EA580C" })] }),
              new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Unit Server Room Data Center — Riset Skripsi K3", italics: true, size: 16, color: "64748B" })] }),
            ]
          }),
          new TableCell({
            width: { size: 20, type: WidthType.PERCENTAGE },
            borders: { top: { style: BorderStyle.NONE, size: 0 }, bottom: { style: BorderStyle.NONE, size: 0 }, left: { style: BorderStyle.NONE, size: 0 }, right: { style: BorderStyle.NONE, size: 0 } },
            verticalAlign: 'center' as any,
            children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: urindoImgRun ? [urindoImgRun] : [new TextRun({ text: "URINDO", bold: true, size: 16 })] })]
          }),
        ]
      })
    ]
  }));

  // Separator line
  children.push(new Paragraph({
    spacing: { before: 80, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'EA580C', space: 1 } },
    children: []
  }));

  // ── Title ──
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 60 },
    children: [new TextRun({ text: "LAPORAN TABEL INDUK EVALUASI SKALA LIKERT SKRIPSI K3", bold: true, size: 24, color: "C2410C" })]
  }));
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [new TextRun({ text: "Evaluasi Efektivitas Website ErgoTech K3 Terhadap Pemahaman & Sikap Ergonomi Teknisi", size: 18, italics: true, color: "475569" })]
  }));

  // ── Informasi Penelitian ──
  children.push(new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "Informasi Penelitian:", bold: true, size: 20, underline: {} })] }));
  const infoLines = [
    "• Peneliti: Nur Virgi Arfiyanti (NIM: 235059048)",
    "• Institusi: Program Studi Sarjana Kesehatan Masyarakat URINDO",
    "• Lokasi: PT. Sinar Powerindo Utama (Data Center Server Room)",
    `• Tanggal Cetak Laporan: ${formatFullTimestamp(new Date().toISOString())}`
  ];
  infoLines.forEach(line => {
    children.push(new Paragraph({ spacing: { after: 30 }, children: [new TextRun({ text: line, size: 18 })] }));
  });

  children.push(new Paragraph({ spacing: { after: 200 }, children: [] }));

  // ── Ringkasan Statistik Table ──
  children.push(new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "Ringkasan Statistik Evaluasi Skala Likert:", bold: true, size: 20, underline: {} })] }));

  const statsRows = [
    ["Total Sampel Responden Tuntas", `${totalCount} Teknisi`],
    ["Rata-rata Skor Pre-Test Likert", `${avgPreA.toFixed(2)} / 40 Poin`],
    ["Rata-rata Skor Post-Test Likert", `${avgPostA.toFixed(2)} / 40 Poin`],
    ["Peningkatan Rata-rata Skor", `+${(avgPostA - avgPreA).toFixed(2)} Poin`],
    ["Responden Kategori Baik Pre (≥26 Poin)", `${preBaikCount} dari ${totalCount} (${preBaikPct.toFixed(0)}%)`],
    ["Responden Kategori Baik Post (≥26 Poin)", `${postBaikCount} dari ${totalCount} (${postBaikPct.toFixed(0)}%)`],
  ];

  children.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({ borders: thinBorder, shading: { fill: 'FFF7ED' }, children: [new Paragraph({ spacing: { before: 40, after: 40 }, children: [new TextRun({ text: "Indikator", bold: true, size: 18, color: 'C2410C' })] })] }),
          new TableCell({ borders: thinBorder, shading: { fill: 'FFF7ED' }, children: [new Paragraph({ spacing: { before: 40, after: 40 }, children: [new TextRun({ text: "Nilai", bold: true, size: 18, color: 'C2410C' })] })] }),
        ]
      }),
      ...statsRows.map(([label, value]) => new TableRow({
        children: [
          makeCell(label, false, 18),
          makeCell(value, true, 18, '059669'),
        ]
      }))
    ]
  }));

  children.push(new Paragraph({ spacing: { after: 250 }, children: [] }));

  // ── BAR CHART IMAGES ──
  children.push(new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "Visualisasi Grafik Batang Intervensi Skala Likert Ergonomi:", bold: true, size: 20, underline: {} })] }));

  if (scoreChartBytes) {
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [new ImageRun({ data: scoreChartBytes, transformation: { width: 440, height: 275 }, type: 'png' })]
    }));
  }

  if (pctChartBytes) {
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new ImageRun({ data: pctChartBytes, transformation: { width: 440, height: 275 }, type: 'png' })]
    }));
  }

  children.push(new Paragraph({ spacing: { after: 250 }, children: [] }));

  // ── Data Table ──
  children.push(new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "Tabel Rekapitulasi Data Responden:", bold: true, size: 20, underline: {} })] }));

  const tableHeaderLabels = ["No", "Waktu Selesai", "Nama", "Posisi", "Usia", "Pre-Likert", "Post-Likert", "Δ Skor", "Kategori"];

  children.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: tableHeaderLabels.map(label =>
          new TableCell({
            borders: thinBorder,
            shading: { fill: 'FFF7ED' },
            children: [new Paragraph({ spacing: { before: 30, after: 30 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: label, bold: true, size: 16, color: 'C2410C' })] })]
          })
        )
      }),
      ...respondents.map((r, i) => {
        const preA = r.preTest?.attitudeScore ?? 0;
        const postA = r.postTest?.attitudeScore ?? 0;
        const delta = postA - preA;
        const kat = getLikertCategory(postA);
        const bgColor = i % 2 === 0 ? 'FFFFFF' : 'F8FAFC';

        return new TableRow({
          children: [
            new TableCell({ borders: thinBorder, shading: { fill: bgColor }, children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 25, after: 25 }, children: [new TextRun({ text: String(i + 1), size: 16 })] })] }),
            new TableCell({ borders: thinBorder, shading: { fill: bgColor }, children: [new Paragraph({ spacing: { before: 25, after: 25 }, children: [new TextRun({ text: formatFullTimestamp(r.postTest?.completedAt || r.createdAt), size: 14 })] })] }),
            new TableCell({ borders: thinBorder, shading: { fill: bgColor }, children: [new Paragraph({ spacing: { before: 25, after: 25 }, children: [new TextRun({ text: r.demographics.name, bold: true, size: 16 })] })] }),
            new TableCell({ borders: thinBorder, shading: { fill: bgColor }, children: [new Paragraph({ spacing: { before: 25, after: 25 }, children: [new TextRun({ text: r.demographics.empId, size: 16 })] })] }),
            new TableCell({ borders: thinBorder, shading: { fill: bgColor }, children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 25, after: 25 }, children: [new TextRun({ text: `${r.demographics.age || '-'}`, size: 16 })] })] }),
            new TableCell({ borders: thinBorder, shading: { fill: bgColor }, children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 25, after: 25 }, children: [new TextRun({ text: `${preA}/40`, size: 16 })] })] }),
            new TableCell({ borders: thinBorder, shading: { fill: bgColor }, children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 25, after: 25 }, children: [new TextRun({ text: `${postA}/40`, bold: true, size: 16, color: '059669' })] })] }),
            new TableCell({ borders: thinBorder, shading: { fill: bgColor }, children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 25, after: 25 }, children: [new TextRun({ text: `${delta >= 0 ? '+' : ''}${delta}`, bold: true, size: 16, color: delta >= 0 ? '059669' : 'DC2626' })] })] }),
            new TableCell({ borders: thinBorder, shading: { fill: bgColor }, children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 25, after: 25 }, children: [new TextRun({ text: kat, bold: true, size: 16, color: kat === 'Baik' ? '059669' : 'D97706' })] })] }),
          ]
        });
      })
    ]
  }));

  children.push(new Paragraph({ spacing: { after: 350 }, children: [] }));

  // ── Signature Footer ──
  children.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: TableBorders.NONE,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: { top: { style: BorderStyle.NONE, size: 0 }, bottom: { style: BorderStyle.NONE, size: 0 }, left: { style: BorderStyle.NONE, size: 0 }, right: { style: BorderStyle.NONE, size: 0 } },
            children: [
              new Paragraph({ spacing: { after: 20 }, children: [new TextRun({ text: "Mengetahui,", size: 18 })] }),
              new Paragraph({ spacing: { after: 20 }, children: [new TextRun({ text: "PT. Sinar Powerindo Utama", bold: true, size: 18 })] }),
              new Paragraph({ spacing: { after: 20 }, children: [] }),
              new Paragraph({ spacing: { after: 20 }, children: [] }),
              new Paragraph({ spacing: { after: 20 }, children: [] }),
              new Paragraph({ children: [new TextRun({ text: "Supervisor Data Center Server Room", bold: true, size: 18, underline: {} })] }),
              new Paragraph({ children: [new TextRun({ text: "NIP / ID: PTU-SPV-2026", size: 16, color: "64748B" })] }),
            ]
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: { top: { style: BorderStyle.NONE, size: 0 }, bottom: { style: BorderStyle.NONE, size: 0 }, left: { style: BorderStyle.NONE, size: 0 }, right: { style: BorderStyle.NONE, size: 0 } },
            children: [
              new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 20 }, children: [new TextRun({ text: `Jakarta, ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}`, size: 18 })] }),
              new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 20 }, children: [new TextRun({ text: "Peneliti Skripsi K3 URINDO", bold: true, size: 18 })] }),
              new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 20 }, children: [] }),
              new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 20 }, children: [] }),
              new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 20 }, children: [] }),
              new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Nur Virgi Arfiyanti", bold: true, size: 18, underline: {} })] }),
              new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "NIM: 235059048", size: 16, color: "64748B" })] }),
            ]
          })
        ]
      })
    ]
  }));

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: 720, right: 720, bottom: 720, left: 720 }
        }
      },
      children
    }],
  });

  Packer.toBlob(doc).then(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Laporan_Skala_Likert_SPSS_ErgoTech_K3_URINDO_${new Date().toISOString().slice(0, 10)}.docx`;
    a.click();
    window.URL.revokeObjectURL(url);
  });
};
