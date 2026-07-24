export interface LikertStatement {
  id: number;
  type: 'positif' | 'negatif'; // Pro (Favorable) vs Kontra (Unfavorable)
  statement: string;
}

export const LIKERT_OPTIONS = [
  { label: 'Sangat Setuju', shortLabel: 'SS' },
  { label: 'Setuju', shortLabel: 'S' },
  { label: 'Tidak Setuju', shortLabel: 'TS' },
  { label: 'Sangat Tidak Setuju', shortLabel: 'STS' }
];

// Reverse Scoring for Unfavorable (Negatif) Items
export const getLikertScore = (type: 'positif' | 'negatif', optionIndex: number): number => {
  // optionIndex: 0 = Sangat Setuju, 1 = Setuju, 2 = Tidak Setuju, 3 = Sangat Tidak Setuju
  if (type === 'positif') {
    return 4 - optionIndex; // SS=4, S=3, TS=2, STS=1
  } else {
    return optionIndex + 1; // SS=1, S=2, TS=3, STS=4 (Reverse Scoring)
  }
};

// 1. PRE-TEST STATEMENTS (10 Pernyataan Evaluasi Pengetahuan & Sikap Awal Sebelum Modul)
export const PRETEST_STATEMENTS: LikertStatement[] = [
  {
    id: 1,
    type: 'positif',
    statement: '1. Pengangkatan unit server cabinet (15–30 kg) dengan teknik tekuk lutut (Squat Style) jauh lebih aman bagi tulang belakang dibanding membungkukkan punggung (Stoop Style).'
  },
  {
    id: 2,
    type: 'negatif',
    statement: '2. Mengangkat unit server cabinet seberat 30 kg seorang diri tanpa alat bantu dorong dianggap hal yang wajar selama teknisi merasa fisiknya kuat.'
  },
  {
    id: 3,
    type: 'positif',
    statement: '3. Mendekatkan posisi unit server ke dada saat memindahkan beban dapat mengurangi tekanan berlebih pada diskus tulang belakang.'
  },
  {
    id: 4,
    type: 'negatif',
    statement: '4. Gerakan memutar pinggang (twisting) secara mendadak saat memikul beban berat di server room dianggap tidak berisiko memicu cedera Low Back Pain.'
  },
  {
    id: 5,
    type: 'positif',
    statement: '5. Penggunaan alat bantu dorong atau trolley sangat disarankan saat memindahkan peralatan server yang berat.'
  },
  {
    id: 6,
    type: 'negatif',
    statement: '6. Rasa pegal atau kaku pada area leher dan pinggang seusai bekerja dapat diabaikan karena merupakan hal biasa yang tidak berbahaya bagi kesehatan.'
  },
  {
    id: 7,
    type: 'positif',
    statement: '7. Prosedur identifikasi bahaya di server room sangat penting diterapkan teknisi sebelum memulai pekerjaan pengangkatan beban.'
  },
  {
    id: 8,
    type: 'negatif',
    statement: '8. Penggunaan APD seperti sepatu safety anti-selip dan sarung tangan bertekstur hanya membuang waktu dan mengganggu kelancaran kerja teknisi.'
  },
  {
    id: 9,
    type: 'positif',
    statement: '9. Saya selalu menerapkan teknik tekuk lutut (Squat Lifting) dan bersedia meminta bantuan rekan kerja jika beban terlalu berat.'
  },
  {
    id: 10,
    type: 'negatif',
    statement: '10. Saya merasa masalah keselamatan kerja (K3) sepenuhnya merupakan tanggung jawab perusahaan, bukan tanggung jawab pribadi saya.'
  }
];

// 2. POST-TEST STATEMENTS (10 Pernyataan Evaluasi Hasil Pembelajaran Langsung Dari Modul K3)
export const POSTTEST_STATEMENTS: LikertStatement[] = [
  {
    id: 1,
    type: 'positif',
    statement: '1. Berdasarkan Modul WorkSafeBC, pengangkatan server cabinet di area Power Zone (antara paha & dada) dengan teknik Squat Style efektif mencegah gaya tekan 300+ kg pada lumbar L5/S1.'
  },
  {
    id: 2,
    type: 'negatif',
    statement: '2. Mengangkat unit server >25 kg sendirian tanpa Team Lifting dianggap wajar meskipun bertentangan dengan Standar SOP K3 Manual Handling PT. Sinar Powerindo Utama.'
  },
  {
    id: 3,
    type: 'positif',
    statement: '3. Mendekatkan beban server ke dada (Power Zone) dan menjaga punggung lurus terbukti meminimalkan beban aksial pada diskus tulang belakang.'
  },
  {
    id: 4,
    type: 'negatif',
    statement: '4. Gerakan memutar pinggang (twisting) saat memikul beban berat di server room dianggap tidak berisiko memicu pendarahan/perobekan jaringan diskus lumbar.'
  },
  {
    id: 5,
    type: 'positif',
    statement: '5. Penggunaan APD Sepatu Safety Anti-Selip dan Sarung Tangan Grip Coating terbukti krusial mencegah bahaya tergelincir di lantai raised floor saat instalasi server.'
  },
  {
    id: 6,
    type: 'negatif',
    statement: '6. Gejala kram otot atau kaku pada pinggang seusai kerja diabaikan saja karena tidak berdampak pada cedera permanen Low Back Pain (LBP) atau HNP.'
  },
  {
    id: 7,
    type: 'positif',
    statement: '7. Penerapan Matriks Pengendalian Risiko HIRADC (ISO 45001:2018) sangat efektif menurunkan tingkat risiko bahaya pengangkatan dari HIGH Risk menjadi LOW Risk.'
  },
  {
    id: 8,
    type: 'negatif',
    statement: '8. Menggunakan alat bantu Server Lift Trolley untuk beban >25 kg hanya membuang waktu dan tidak menambah keselamatan kerja teknisi.'
  },
  {
    id: 9,
    type: 'positif',
    statement: '9. Saya berkomitmen penuh menerapkan teknik Squat Style dan meminta bantuan rekan kerja (Team Lifting) sesuai Standar SOP K3 ErgoTech.'
  },
  {
    id: 10,
    type: 'negatif',
    statement: '10. Penerapan Prosedur K3 dan pencegahan cedera otot di area Server Room merupakan urusan manajemen saja, bukan kewajiban pribadi teknisi.'
  }
];

// For backward compatibility
export const LIKERT_STATEMENTS = PRETEST_STATEMENTS;
export const KNOWLEDGE_STATEMENTS = PRETEST_STATEMENTS;
export const ATTITUDE_STATEMENTS = PRETEST_STATEMENTS;
