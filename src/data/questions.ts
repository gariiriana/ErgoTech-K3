import { Question, AttitudeStatement } from '../types';

export const KNOWLEDGE_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Apa definisi utama dari manual handling menurut standar keselamatan kerja K3?",
    options: [
      "Setiap aktivitas memindahkan beban menggunakan alat bantu otomatis saja.",
      "Aktivitas mengangkut, menurunkan, mendorong, menarik, atau membawa beban secara fisik oleh tubuh manusia.",
      "Pekerjaan memeriksa komponen server room tanpa menyentuh beban berat.",
      "Prosedur pengoperasian sistem pendingin udara di data center."
    ],
    correctAnswer: 1,
    explanation: "Manual handling adalah aktivitas memindahkan beban yang melibatkan tenaga otot manusia, termasuk mengangkat, menaruh, mendorong, dan menarik."
  },
  {
    id: 2,
    text: "Berapakah batas rekomendasi beban maksimum pengangkatan manual oleh satu orang pekerja laki-laki dewasa dalam kondisi ideal menurut NIOSH?",
    options: ["10 kg", "15 kg", "25 kg", "50 kg"],
    correctAnswer: 2,
    explanation: "Standard NIOSH Lifting Equation merekomendasikan batas beban angkat ideal (Recommended Weight Limit) sebesar 25 kg bagi pekerja dewasa."
  },
  {
    id: 3,
    text: "Posisi tubuh manakah yang paling aman saat mengangkat unit server cabinet dari lantai?",
    options: [
      "Membungkukkan punggung dengan lutut tetap lurus (Stoop Style).",
      "Menekuk lutut, menjaga tulang belakang tetap lurus, dan mendekatkan beban ke tubuh (Squat Style).",
      "Memutar badan ke samping saat membawa beban berat.",
      "Mengangkat beban dengan menjangkau jauh di depan dada."
    ],
    correctAnswer: 1,
    explanation: "Squat Style mengandalkan otot paha dan kaki yang kuat serta menjaga tumpuan beban tetap pada aksis tulang belakang secara lurus."
  },
  {
    id: 4,
    text: "Bagian tubuh manakah yang paling sering mengalami gangguan Muskuloskeletal Disorders (MSDs) akibat teknik manual handling yang salah?",
    options: ["Pergelangan kaki", "Pinggang dan Punggung Bawah (Low Back Pain)", "Otot Paha", "Telapak Tangan"],
    correctAnswer: 1,
    explanation: "Low Back Pain (LBP) merupakan keluhan MSDs paling dominan akibat tekanan berlebih pada bantalan tulang belakang (lumbar disc)."
  },
  {
    id: 5,
    text: "Mengapa posisi memutar badan (twisting) saat membawa beban sangat berbahaya bagi tulang belakang?",
    options: [
      "Dapat merusak saraf mata.",
      "Meningkatkan gaya geser dan tekanan asimetris pada discus intervertebralis tulang belakang.",
      "Mempercepat detak jantung melebihi batas aman.",
      "Mengurangi aliran darah ke jari kaki."
    ],
    correctAnswer: 1,
    explanation: "Gerakan memutar pinggang saat memikul beban menyebabkan tekanan tidak merata pada discus intervertebralis yang berisiko memicu HNP."
  },
  {
    id: 6,
    text: "Apakah tujuan utama dari prosedur HIRADC (Hazard Identification, Risk Assessment, and Determining Control) dalam ergonomi?",
    options: [
      "Menghitung jumlah gaji teknisi bulanan.",
      "Mengidentifikasi bahaya kerja, menilai tingkat risiko, dan menentukan langkah pengendalian risiko secara sistematis.",
      "Mengukur kecepatan koneksi jaringan server.",
      "Mengatur jadwal piket kerja teknisi."
    ],
    correctAnswer: 1,
    explanation: "HIRADC merupakan standar ISO 45001 untuk mengenali potensi bahaya fisik/ergonomi dan menentukan hirarki kontrol yang tepat."
  },
  {
    id: 7,
    text: "Apa langkah pengendalian utama (hierarki kontrol) jika beban server cabinet melebihi 25 kg?",
    options: [
      "Mengangkatnya sendirian secara cepat.",
      "Menggunakan alat bantu mekanis (Server Lift/Jack) atau mengangkat berpasangan (Team Lifting).",
      "Membiarkan beban di lantai tanpa dipindahkan.",
      "Hanya memakai sarung tangan kain biasa."
    ],
    correctAnswer: 1,
    explanation: "Beban di atas 25 kg membutuhkan kontrol rekayasa (alat angkat mekanis) atau pengangkatan tim (2 orang) untuk membagi beban fisik."
  },
  {
    id: 8,
    text: "Berapa lama durasi ideal peregangan otot (stretching) yang direkomendasikan di sela-sela jam kerja operasional?",
    options: ["10 detik seminggu sekali", "3 hingga 5 menit setiap 2 jam kerja", "30 menit terus menerus", "Tidak perlu stretching"],
    correctAnswer: 1,
    explanation: "Peregangan singkat (micro-break stretching) 3-5 menit tiap 2 jam dapat merelaksasi ketegangan otot statis dan melancarkan sirkulasi darah."
  },
  {
    id: 9,
    text: "Manakah yang merupakan tanda awal gejala kram dan kelelahan otot akibat beban kerja ergonomis statis?",
    options: [
      "Penglihatan membaik secara mendadak.",
      "Rasa kaku, pegal, dan nyeri tumpul pada leher, bahu, atau pinggang sesudah bekerja.",
      "Penurunan berat badan drastis.",
      "Peningkatan pendengaran."
    ],
    correctAnswer: 1,
    explanation: "Pegal dan rasa kaku pada area muskuloskeletal merupakan akumulasi kelelahan mikroskopis pada serabut otot sebelum timbul cedera kronis."
  },
  {
    id: 10,
    text: "Bagaimana cara membawa barang berat yang paling ergonomis jika harus berjalan memindahkan unit?",
    options: [
      "Memegang beban jauh dari dada.",
      "Menempelkan atau mendekatkan beban sedekat mungkin ke pusat gravitasi tubuh (dada/perut).",
      "Menaruh beban di atas kepala.",
      "Memegang beban dengan satu tangan secara miring."
    ],
    correctAnswer: 1,
    explanation: "Mendekatkan beban ke pusat gravitasi tubuh akan meminimalkan beban momen puntir pada tulang belakang."
  },
  {
    id: 11,
    text: "Apakah definisi dari Muskuloskeletal Disorders (MSDs)?",
    options: [
      "Penyakit menular akibat infeksi virus udara.",
      "Gangguan pada jaringan lunak seperti otot, tendon, ligamen, sendi, dan saraf akibat kerja berulang.",
      "Gangguan sistem pencernaan makanan.",
      "Penyakit alergi kulit."
    ],
    correctAnswer: 1,
    explanation: "MSDs merujuk pada kerusakan atau gangguan fungsional pada otot, tendon, ligamen, dan persendian akibat paparan beban kerja fisik berulang."
  },
  {
    id: 12,
    text: "Manakah postur kerja yang termasuk kategori postur janggal (awkward posture)?",
    options: [
      "Berdiri tegak dengan posisi tangan berada di bawah dada.",
      "Membungkuk berlebih >45 derajat dan menggapai beban di atas kepala dengan posisi jinjit.",
      "Duduk tegak dengan dukungan punggung yang baik.",
      "Menekuk lutut saat mengambil barang di bawah."
    ],
    correctAnswer: 1,
    explanation: "Postur janggal adalah posisi tubuh yang menyimpang jauh dari posisi netral alami, seperti membungkuk ekstrem atau menjangkau terlalu jauh."
  },
  {
    id: 13,
    text: "Prinsip dasar ergonomi adalah...",
    options: [
      "Mengubah bentuk tubuh manusia agar pas dengan mesin.",
      "Menyesuaikan pekerjaan, alat, dan lingkungan kerja dengan kemampuan serta keterbatasan tubuh manusia (Fitting the Task to the Man).",
      "Memaksa pekerja bekerja tanpa istirahat.",
      "Menghilangkan semua peralatan kerja."
    ],
    correctAnswer: 1,
    explanation: "Ergonomi berprinsip 'Fitting the Task to the Man', yaitu merancang tugas dan peralatan kerja agar sesuai dengan kondisi anatomis & fisiologis manusia."
  },
  {
    id: 14,
    text: "Mengapa teknisi server room rentan mengalami keluhan pegal bahu dan leher?",
    options: [
      "Karena suhu ruangan dingin saja.",
      "Akibat posisi menengadah/menunduk berlebih dalam waktu lama saat instalasi kabel dan rack server (postur leher statis).",
      "Karena mendengarkan musik.",
      "Karena warna cat ruangan server."
    ],
    correctAnswer: 1,
    explanation: "Kerja statis menahan leher menengadah/menunduk saat *cabling* atau memasang server memicu kelelahan otot trapezius."
  },
  {
    id: 15,
    text: "Manakah keuntungan utama dari penerapan latihan peregangan otot rutin di tempat kerja?",
    options: [
      "Membuat waktu kerja terbuang sia-sia.",
      "Mengurangi ketegangan asam laktat, meningkatkan fleksibilitas otot, dan mencegah risiko cedera MSDs.",
      "Menggantikan fungsi makanan harian.",
      "Menghilangkan kebutuhan alat K3."
    ],
    correctAnswer: 1,
    explanation: "Stretching membantu membuang akumulasi asam laktat, melancarkan oksigenasi sel otot, dan meningkatkan fleksibilitas gerakan sendi."
  },
  {
    id: 16,
    text: "Sebelum mengangkat unit berat berdua (team lifting), hal apakah yang paling penting dilakukan antar sesama teknisi?",
    options: [
      "Tidur sebentar.",
      "Komunikasi dan aba-aba yang jelas mengenai siapa yang memimpin serta kapan memulai angkatan.",
      "Berteriak keras tanpa koordinasi.",
      "Mengangkat sendiri-sendiri tanpa bicara."
    ],
    correctAnswer: 1,
    explanation: "Koordinasi dan komando yang jelas mencegah kejutan beban mendadak pada salah satu pekerja yang dapat memicu cedera pinggang."
  },
  {
    id: 17,
    text: "Faktor risiko ergonomi utama dalam aktivitas manual handling meliputi 3 hal, yaitu...",
    options: [
      "Warna baju, merek sepatu, dan jam tangan.",
      "Beban (Force), Postur Kerja (Posture), dan Frekuensi/Durasi Pengulangan (Repetition).",
      "Suhu udara, intensitas cahaya, dan aroma ruangan.",
      "Gaji, tunjangan, dan bonus."
    ],
    correctAnswer: 1,
    explanation: "Tiga faktor risiko ergonomi utama adalah Gaya/Beban fisik (Force), Postur Tubuh (Posture), dan Pengulangan/Durasi (Repetition)."
  },
  {
    id: 18,
    text: "Apa tindakan pertama yang harus dilakukan teknisi jika merasakan nyeri tajam yang hebat di pinggang saat mengangkat beban?",
    options: [
      "Melanjutkan pengangkatan hingga selesai.",
      "Segera menghentikan aktivitas pengangkatan, menaruh beban secara perlahan, dan melapor ke petugas K3/medis.",
      "Meminum air dingin banyak-banyak.",
      "Menyembunyikan rasa sakit dari kawan kerja."
    ],
    correctAnswer: 1,
    explanation: "Nyeri tajam menandakan adanya cedera akut jaringan otot/diskus; pengangkatan harus segera dihentikan untuk mencegah kerosakan permanen."
  },
  {
    id: 19,
    text: "Bagaimanakah media edukasi berbasis website interaktif membantu meningkatkan keselamatan kerja teknisi?",
    options: [
      "Menambah beban pekerjaan administrasi.",
      "Memberikan akses pembelajaran ergonomi visual dan fleksibel yang dapat dipelajari mandiri di mana saja melalui smartphone.",
      "Menggantikan seluruh peralatan server.",
      "Mengharuskan teknisi membaca buku tebal."
    ],
    correctAnswer: 1,
    explanation: "Website interaktif memudahkan pekerja mengakses simulasi visual, video gerakan aman, dan evaluasi mandiri kapan saja dari genggaman."
  },
  {
    id: 20,
    text: "Apakah tujuan dari pengisian kuesioner Pre-Test dan Post-Test pada penelitian edukasi K3 ini?",
    options: [
      "Untuk memberikan sanksi bagi pekerja.",
      "Mengukur peningkatan tingkat pengetahuan dan perubahan sikap pencegahan MSDs secara objektif sebelum dan sesudah intervensi.",
      "Menghitung jumlah jam lembur teknisi.",
      "Sebagai sarana promosi penjualan barang."
    ],
    correctAnswer: 1,
    explanation: "Pre-test dan Post-test mengukur efektivitas intervensi edukasi secara ilmiah melalui uji perbandingan rerata statistik."
  }
];

export const ATTITUDE_STATEMENTS: AttitudeStatement[] = [
  {
    id: 1,
    text: "Saya meyakini bahwa menerapkan teknik angkat squat style (menekuk lutut & menjaga tulang belakang lurus) sangat penting untuk mencegah cedera pinggang."
  },
  {
    id: 2,
    text: "Saya bersedia menyisihkan waktu 3-5 menit untuk melakukan peregangan otot di sela-sela jam operasional server room."
  },
  {
    id: 3,
    text: "Saya merasa tidak ragu untuk meminta bantuan rekan kerja (team lifting) ketika harus memindahkan beban di atas 25 kg."
  },
  {
    id: 4,
    text: "Saya selalu mengutamakan posisi tubuh netral dan menghindari gerakan memutar pinggang saat membawa barang berat."
  },
  {
    id: 5,
    text: "Saya beranggapan bahwa mempelajari modul edukasi ergonomi via website sangat bermanfaat untuk kesehatan jangka panjang saya."
  },
  {
    id: 6,
    text: "Saya akan secara konsisten memperhatikan jarak beban dengan tubuh saya agar selalu dekat dengan pusat gravitasi dada."
  },
  {
    id: 7,
    text: "Saya setuju bahwa pelaporan awal jika merasakan pegal/nyeri otot merupakan langkah bijak untuk mencegah cedera berlanjut."
  },
  {
    id: 8,
    text: "Saya mendukung digunakannya alat bantu mekanis (seperti server lift) saat proses instalasi cabinet berat di server room."
  },
  {
    id: 9,
    text: "Saya berkomitmen untuk mengingatkan rekan kerja jika melihat mereka melakukan teknik pengangkatan yang membungkuk (stoop style)."
  },
  {
    id: 10,
    text: "Saya yakin penerapan prinsip ergonomi yang baik di tempat kerja dapat meningkatkan kenyamanan dan produktivitas harian saya."
  }
];
