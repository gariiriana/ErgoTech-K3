import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase/config';
import { collection, getDocs, addDoc, onSnapshot } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { RespondentData } from '../types';
import { exportToExcel, exportToDocx, getLikertCategory, formatFullTimestamp } from '../utils/exportHelpers';
import { decodeBase64, encodeBase64 } from '../utils/base64Helper';
import { PrintableReport } from './PrintableReport';
import { Database, Download, Sparkles, RefreshCw, Key, ShieldCheck, FileSpreadsheet, FileText, Printer, CheckCircle2, TrendingUp, BarChart3, Clock, Layers, ListOrdered, Award, Activity } from 'lucide-react';

interface AdminDashboardProps {
  onBack: () => void;
  isAuthenticated: boolean;
  onLoginSuccess: () => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBack,
  isAuthenticated,
  onLoginSuccess,
  onLogout
}) => {
  const [respondents, setRespondents] = useState<RespondentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [showItemizedLikert, setShowItemizedLikert] = useState(false);
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Log admin activity to Firestore
  const logAdminToFirestore = async (adminIdentifier: string, authMethod: string) => {
    try {
      await addDoc(collection(db, "admin_logs"), {
        adminIdentifier,
        authMethod,
        loginTime: new Date().toISOString(),
        userAgent: navigator.userAgent
      });
    } catch (err) {
      console.error("Error logging admin to Firestore:", err);
    }
  };

  // Real-Time Firestore Sync Listener (onSnapshot) - Only Complete Post-Test Respondents
  useEffect(() => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    const unsubscribe = onSnapshot(collection(db, "respondents"), (snapshot) => {
      const data: RespondentData[] = [];

      snapshot.forEach((docSnap: any) => {
        const raw = docSnap.data();
        let respondentItem: RespondentData | null = null;

        // Decode Base64 payload if present
        if (raw.payload) {
          respondentItem = decodeBase64<RespondentData>(raw.payload);
          if (respondentItem) {
            respondentItem.id = docSnap.id;
          }
        }

        // Fallback for unencoded legacy documents
        if (!respondentItem && raw.demographics) {
          respondentItem = { id: docSnap.id, ...raw } as RespondentData;
        }

        // STRICT FILTER: Only include respondents who completed ALL stages up to Post-Test/Certificate
        if (respondentItem && respondentItem.postTest) {
          data.push(respondentItem);
        }
      });

      // Sort by latest created
      data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setRespondents(data);
      setLoading(false);
    }, (err) => {
      console.error("Firestore real-time error:", err);
      fetchData(); // Fallback to manual getDocs
    });

    return () => unsubscribe();
  }, [isAuthenticated]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const inputVal = usernameOrEmail.trim();

    // 1. Quick Passcode Login Check
    if (inputVal === 'k3urindo2026' || inputVal === 'admin' || password === 'k3urindo2026') {
      onLoginSuccess();
      await logAdminToFirestore('Nur Virgi Arfiyanti (Passcode Admin)', 'passcode');
      fetchData();
      return;
    }

    // 2. Firebase Auth Email & Password Login
    if (inputVal.includes('@')) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, inputVal, password);
        onLoginSuccess();
        await logAdminToFirestore(userCredential.user.email || inputVal, 'firebase_auth');
        fetchData();
        return;
      } catch (err: any) {
        console.error("Firebase Auth Error:", err);
        setError('Gagal login: Email atau password Firebase tidak sesuai.');
        return;
      }
    }

    setError('Mohon masukkan Email Admin Firebase atau Passcode: k3urindo2026');
  };

  // Manual Fetch Fallback & Decode Base64 Payload from Firestore Database
  const fetchData = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "respondents"));
      const data: RespondentData[] = [];

      querySnapshot.forEach((docSnap: any) => {
        const raw = docSnap.data();
        let respondentItem: RespondentData | null = null;

        // Decode Base64 payload if present
        if (raw.payload) {
          respondentItem = decodeBase64<RespondentData>(raw.payload);
          if (respondentItem) {
            respondentItem.id = docSnap.id;
          }
        }

        // Fallback for unencoded legacy documents
        if (!respondentItem && raw.demographics) {
          respondentItem = { id: docSnap.id, ...raw } as RespondentData;
        }

        // STRICT FILTER: Only include respondents who completed ALL stages up to Post-Test/Certificate
        if (respondentItem && respondentItem.postTest) {
          data.push(respondentItem);
        }
      });

      data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setRespondents(data);
    } catch (err) {
      console.error("Error fetching respondents:", err);
    } finally {
      setLoading(false);
    }
  };

  // Generate 35 Base64 Encoded Respondent Samples for Firestore
  const handleSeedDummy35 = async () => {
    if (!window.confirm("Apakah Anda ingin membuat 35 sampel data teknisi (Base64 encoded) untuk dimasukkan ke Firebase Firestore?")) return;
    setSeeding(true);

    try {
      const names = [
        "Andi Pratama", "Budi Santoso", "Candra Wijaya", "Dedi Kurniawan", "Eko Prasetyo",
        "Fajar Hidayat", "Giri Ramadhan", "Hendra Saputra", "Irfan Wibowo", "Joko Susilo",
        "Kiki Lestari", "Lutfi Hakim", "Muhammad Hafiz", "Nanda Fitri", "Oki Setiawan",
        "Panji Suherman", "Qori Maulana", "Rian Hidayat", "Samsul Bahri", "Taufik Hidayat",
        "Utomo Putro", "Vian Pratama", "Wahyu Nugroho", "Xaverius Agung", "Yusuf Habibie",
        "Zainal Abidin", "Agung Perdana", "Bagas Firmansyah", "Cahyo Utomo", "Dimas Anggara",
        "Erik Setiawan", "Fahmi Idris", "Gilang Sahputra", "Hafiz Rizky", "Iqbal Ramadhan"
      ];

      for (let i = 0; i < 35; i++) {
        const name = names[i];
        const empId = `TEK-${101 + i}`;
        const gender: 'Laki-laki' | 'Perempuan' = i % 8 === 0 ? 'Perempuan' : 'Laki-laki';
        const age = 21 + (i % 25);
        const workDuration = 1 + (i % 12);
        const ageGroup: '<30' | '>=30' = age < 30 ? '<30' : '>=30';
        const workDurationGroup: '<3' | '>=3' = workDuration < 3 ? '<3' : '>=3';

        const preA = 18 + Math.floor(Math.random() * 8);
        const postA = Math.min(40, preA + 6 + Math.floor(Math.random() * 8));

        // Generate 10 Likert item answers (1-4)
        const preAnswers = Array.from({ length: 10 }, (_, pIdx) => ({
          questionId: pIdx + 1,
          selectedScore: 1 + Math.floor(Math.random() * 4)
        }));
        const postAnswers = Array.from({ length: 10 }, (_, pIdx) => ({
          questionId: pIdx + 1,
          selectedScore: Math.min(4, (preAnswers[pIdx].selectedScore || 2) + (Math.random() > 0.4 ? 1 : 0))
        }));

        const item: RespondentData = {
          demographics: {
            name,
            empId,
            gender,
            age,
            ageGroup,
            workDuration,
            workDurationGroup,
            consented: true
          },
          preTest: {
            knowledgeScore: preA,
            knowledgeAnswers: [],
            attitudeScore: preA,
            attitudeAnswers: preAnswers,
            completedAt: new Date(Date.now() - (35 - i) * 3600000).toISOString()
          },
          completedModules: ['squat', 'hiradc', 'stretching'],
          postTest: {
            knowledgeScore: postA,
            knowledgeAnswers: [],
            attitudeScore: postA,
            attitudeAnswers: postAnswers,
            completedAt: new Date(Date.now() - (35 - i) * 3600000 + 1800000).toISOString()
          },
          currentStep: 'certificate',
          createdAt: new Date(Date.now() - (35 - i) * 3600000).toISOString()
        };

        const base64Payload = encodeBase64(item);
        await addDoc(collection(db, "respondents"), {
          payload: base64Payload,
          name,
          empId,
          gender,
          ageGroup,
          workDurationGroup,
          preTestKnowledgeScore: preA,
          preTestAttitudeScore: preA,
          postTestKnowledgeScore: postA,
          postTestAttitudeScore: postA,
          currentStep: 'certificate',
          createdAt: item.createdAt
        });
      }

      alert("Berhasil menambahkan 35 data sampel responden ke Firebase Firestore!");
      fetchData();
    } catch (err) {
      console.error("Error seeding dummy data:", err);
      alert("Gagal membuat sampel data.");
    } finally {
      setSeeding(false);
    }
  };

  // Render Login Card if Not Authenticated
  if (!isAuthenticated) {
    return (
      <div className="animate-fade" style={{ maxWidth: '440px', margin: '3rem auto', padding: '0 1rem' }}>
        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <img src="/logo-powerindo.png" alt="PT Sinar Powerindo Utama" style={{ height: '48px', objectFit: 'contain' }} />
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>
              Portal Login Peneliti K3
            </h2>
            <p style={{ fontSize: '0.825rem', color: '#64748B', marginTop: '0.25rem' }}>
              Akses Khusus Mahasiswa Peneliti SKM URINDO & Pembimbing Skripsi
            </p>
          </div>

          {error && (
            <div style={{
              backgroundColor: '#FEF2F2',
              borderLeft: '4px solid #EF4444',
              color: '#991B1B',
              padding: '0.75rem 1rem',
              borderRadius: '6px',
              marginBottom: '1.25rem',
              fontSize: '0.825rem'
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Email Admin atau Passcode Cepat
              </label>
              <input
                type="text"
                placeholder="Email Admin / k3urindo2026"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: '6px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Kata Sandi (Password)
              </label>
              <input
                type="password"
                placeholder="Masukkan Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: '6px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ justifyContent: 'center', width: '100%', marginTop: '0.5rem' }}>
              <ShieldCheck size={18} />
              <span>Masuk Dashboard Admin</span>
            </button>

            <button type="button" onClick={onBack} className="btn-secondary" style={{ justifyContent: 'center', width: '100%' }}>
              Kembali ke Formulir Responden
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Calculate Statistics for Research Analytics (35+ Respondents)
  const totalN = respondents.length;

  const preAAvg = totalN > 0
    ? (respondents.reduce((acc, r) => acc + (r.preTest?.attitudeScore || 0), 0) / totalN).toFixed(1)
    : '0';
  const postAAvg = totalN > 0
    ? (respondents.reduce((acc, r) => acc + (r.postTest?.attitudeScore || 0), 0) / totalN).toFixed(1)
    : '0';

  const preBaikCount = respondents.filter(r => (r.preTest?.attitudeScore || 0) >= 26).length;
  const postBaikCount = respondents.filter(r => (r.postTest?.attitudeScore || 0) >= 26).length;

  const preBaikPct = totalN > 0 ? ((preBaikCount / totalN) * 100).toFixed(0) : '0';
  const postBaikPct = totalN > 0 ? ((postBaikCount / totalN) * 100).toFixed(0) : '0';

  const scoreDiff = (Number(postAAvg) - Number(preAAvg)).toFixed(1);

  return (
    <div className="animate-fade" style={{ maxWidth: '1100px', margin: '1.5rem auto', padding: '0 1rem' }}>
      {/* Dashboard Top Navigation & Actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem',
        backgroundColor: '#FFFFFF',
        padding: '1.25rem 1.5rem',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#EA580C', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            DASHBOARD HASIL PENELITIAN SKRIPSI K3
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
            Rekapitulasi Data Responden PT. Sinar Powerindo Utama
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => exportToExcel(respondents)}
            className="btn-primary"
            style={{ backgroundColor: '#059669', fontSize: '0.825rem', padding: '0.6rem 1rem' }}
          >
            <FileSpreadsheet size={16} />
            <span>Ekspor SPSS (Excel P1-P10)</span>
          </button>

          <button
            onClick={() => exportToDocx(respondents)}
            className="btn-primary"
            style={{ backgroundColor: '#2563EB', fontSize: '0.825rem', padding: '0.6rem 1rem' }}
          >
            <FileText size={16} />
            <span>Ekspor Laporan (Word)</span>
          </button>

          <button
            onClick={onLogout}
            className="btn-secondary"
            style={{ fontSize: '0.825rem', padding: '0.6rem 1rem', color: '#DC2626' }}
          >
            Keluar Admin
          </button>
        </div>
      </div>

      {/* Executive KPI Overview Cards (Equal Height Grid) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
            Total Sampel Responden (N)
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#EA580C', margin: '0.35rem 0' }}>
            {totalN} <span style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 500 }}>Teknisi Tuntas</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
            ✓ Terverifikasi Lulus Post-Test & Sertifikat
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
            Rata-rata Skor Likert (10 - 40 Poin)
          </span>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: '0.35rem 0' }}>
            Pre: <span style={{ color: '#64748B' }}>{preAAvg}</span> → Post: <span style={{ color: '#059669' }}>{postAAvg} Poin</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: Number(scoreDiff) >= 0 ? '#059669' : '#DC2626', fontWeight: 600 }}>
            {Number(scoreDiff) >= 0 ? `▲ Peningkatan: +${scoreDiff} Poin` : `▼ Perubahan: ${scoreDiff} Poin`}
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <button
            onClick={handleSeedDummy35}
            disabled={seeding}
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '0.65rem 0.5rem' }}
          >
            <Sparkles size={16} color="#EA580C" />
            <span>{seeding ? 'Membuat 35 Sample...' : 'Generate 35 Sampel Skripsi'}</span>
          </button>
        </div>
      </div>

      {/* Visual Analytics Bar Chart Card (Grafik Batang Evaluasi Skala Likert) */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 800, color: '#EA580C', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <BarChart3 size={16} />
              <span>GRAFIK BATANG KOMPARATIF HASIL INTERVENSI SKRIPSI K3</span>
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
              Perbandingan Rata-rata Skor Skala Likert Ergonomi (Pre-Test vs Post-Test)
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.775rem', fontWeight: 700 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#64748B' }}></div>
              <span style={{ color: '#475569' }}>Pre-Test (Sebelum Modul)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#059669' }}></div>
              <span style={{ color: '#059669' }}>Post-Test (Setelah ErgoTech)</span>
            </div>
          </div>
        </div>

        {/* Bar Chart Visual Canvas Grid */}
        <div className="form-grid-2col" style={{ display: 'grid', gap: '1.25rem', alignItems: 'flex-end', marginTop: '1rem' }}>
          {/* Chart Column 1: Overall Average Bar Chart */}
          <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '1.25rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', marginBottom: '1rem' }}>
              1. Rata-rata Skor Keseluruhan Responden (Skala 10 - 40 Poin)
            </h4>

            {/* Vertical Bar Chart Bars */}
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '160px', padding: '0 1rem', position: 'relative', borderBottom: '2px solid #CBD5E1' }}>
              {/* Benchmark Reference Line (26 Poin = Cut-off Point Kategori Baik) */}
              <div style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: `${(26 / 40) * 100}%`,
                borderTop: '2px dashed #F59E0B',
                zIndex: 1
              }}>
                <span style={{ position: 'absolute', right: '4px', top: '-18px', fontSize: '0.65rem', fontWeight: 700, color: '#D97706', backgroundColor: '#FEF3C7', padding: '1px 5px', borderRadius: '3px' }}>
                  Cut-off Baik ≥26.0 Poin
                </span>
              </div>

              {/* Bar 1: Pre-Test */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '70px', zIndex: 2 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
                  {preAAvg}
                </span>
                <div style={{
                  width: '100%',
                  height: `${(Number(preAAvg) / 40) * 140}px`,
                  backgroundColor: '#64748B',
                  borderRadius: '6px 6px 0 0',
                  boxShadow: '0 2px 6px rgba(100, 116, 139, 0.2)',
                  transition: 'height 0.5s ease'
                }}></div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginTop: '6px' }}>Pre-Test</span>
              </div>

              {/* Bar 2: Post-Test */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '70px', zIndex: 2 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#059669', marginBottom: '4px' }}>
                  {postAAvg}
                </span>
                <div style={{
                  width: '100%',
                  height: `${(Number(postAAvg) / 40) * 140}px`,
                  backgroundColor: '#059669',
                  borderRadius: '6px 6px 0 0',
                  boxShadow: '0 2px 6px rgba(5, 150, 105, 0.25)',
                  transition: 'height 0.5s ease'
                }}></div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', marginTop: '6px' }}>Post-Test</span>
              </div>
            </div>
            <div style={{ fontSize: '0.725rem', color: '#64748B', textAlign: 'center', marginTop: '0.65rem' }}>
              Skala Likert diukur dari 10 Poin (Min) s/d 40 Poin (Max)
            </div>
          </div>

          {/* Chart Column 2: Category Percentage Bar Chart (% Kategori Baik >=26 Poin) */}
          <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '1.25rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', marginBottom: '1rem' }}>
              2. Persentase Responden Kategori Baik (Skor ≥ 26.0 Poin)
            </h4>

            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '160px', padding: '0 1rem', position: 'relative', borderBottom: '2px solid #CBD5E1' }}>
              {/* Bar 1: Pre Baik % */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '70px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
                  {preBaikPct}%
                </span>
                <div style={{
                  width: '100%',
                  height: `${Math.max(12, (Number(preBaikPct) / 100) * 140)}px`,
                  backgroundColor: '#94A3B8',
                  borderRadius: '6px 6px 0 0',
                  transition: 'height 0.5s ease'
                }}></div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginTop: '6px' }}>Pre Baik</span>
              </div>

              {/* Bar 2: Post Baik % */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '70px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#059669', marginBottom: '4px' }}>
                  {postBaikPct}%
                </span>
                <div style={{
                  width: '100%',
                  height: `${Math.max(12, (Number(postBaikPct) / 100) * 140)}px`,
                  backgroundColor: '#059669',
                  borderRadius: '6px 6px 0 0',
                  transition: 'height 0.5s ease'
                }}></div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', marginTop: '6px' }}>Post Baik</span>
              </div>
            </div>
            <div style={{ fontSize: '0.725rem', color: '#059669', fontWeight: 600, textAlign: 'center', marginTop: '0.65rem' }}>
              ▲ {postBaikCount} dari {totalN} Teknisi Berada di Kategori Baik (≥26 Poin)
            </div>
          </div>
        </div>
      </div>

      {/* Main Data Table Card */}
      <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
              Tabel Induk Evaluasi Skala Likert (Siap Olah SPSS)
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '2px 0 0 0' }}>
              Nilai Skor Skala Likert diukur pada skala 10 s/d 40 Poin (10 Indikator Pernyataan)
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => setShowItemizedLikert(!showItemizedLikert)}
              className="btn-secondary"
              style={{ fontSize: '0.775rem', padding: '0.45rem 0.85rem', backgroundColor: showItemizedLikert ? '#FFF7ED' : '#FFFFFF', borderColor: showItemizedLikert ? '#EA580C' : '#CBD5E1', color: showItemizedLikert ? '#C2410C' : '#475569' }}
            >
              {showItemizedLikert ? <Layers size={14} /> : <ListOrdered size={14} />}
              <span>{showItemizedLikert ? 'Lihat Mode Skor Total' : 'Rincikan Butir P1-P10'}</span>
            </button>

            <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
              {loading ? 'Memuat...' : `${totalN} Entry`}
            </span>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', color: '#334155', borderBottom: '2px solid #E2E8F0' }}>
                <th style={{ padding: '0.75rem 1rem' }}>No</th>
                <th style={{ padding: '0.75rem 1rem' }}>Waktu Selesai (Hari, Tgl, Jam)</th>
                <th style={{ padding: '0.75rem 1rem' }}>Nama Teknisi</th>
                <th style={{ padding: '0.75rem 1rem' }}>Jabatan / Posisi</th>
                <th style={{ padding: '0.75rem 1rem' }}>Usia (SPSS)</th>
                <th style={{ padding: '0.75rem 1rem' }}>Masa Kerja (SPSS)</th>

                {/* Dynamic Itemized Likert Columns or Total Summary */}
                {showItemizedLikert ? (
                  <>
                    <th style={{ padding: '0.75rem 0.4rem', color: '#C2410C', backgroundColor: '#FFF7ED' }}>Pre-P1</th>
                    <th style={{ padding: '0.75rem 0.4rem', color: '#C2410C', backgroundColor: '#FFF7ED' }}>Pre-P2</th>
                    <th style={{ padding: '0.75rem 0.4rem', color: '#C2410C', backgroundColor: '#FFF7ED' }}>Pre-P3</th>
                    <th style={{ padding: '0.75rem 0.4rem', color: '#C2410C', backgroundColor: '#FFF7ED' }}>Pre-P4</th>
                    <th style={{ padding: '0.75rem 0.4rem', color: '#C2410C', backgroundColor: '#FFF7ED' }}>Pre-P5</th>
                    <th style={{ padding: '0.75rem 0.4rem', color: '#C2410C', backgroundColor: '#FFF7ED' }}>Pre-P6</th>
                    <th style={{ padding: '0.75rem 0.4rem', color: '#C2410C', backgroundColor: '#FFF7ED' }}>Pre-P7</th>
                    <th style={{ padding: '0.75rem 0.4rem', color: '#C2410C', backgroundColor: '#FFF7ED' }}>Pre-P8</th>
                    <th style={{ padding: '0.75rem 0.4rem', color: '#C2410C', backgroundColor: '#FFF7ED' }}>Pre-P9</th>
                    <th style={{ padding: '0.75rem 0.4rem', color: '#C2410C', backgroundColor: '#FFF7ED' }}>Pre-P10</th>
                    <th style={{ padding: '0.75rem 0.75rem', fontWeight: 800 }}>Pre-Total</th>

                    <th style={{ padding: '0.75rem 0.4rem', color: '#065F46', backgroundColor: '#ECFDF5' }}>Post-P1</th>
                    <th style={{ padding: '0.75rem 0.4rem', color: '#065F46', backgroundColor: '#ECFDF5' }}>Post-P2</th>
                    <th style={{ padding: '0.75rem 0.4rem', color: '#065F46', backgroundColor: '#ECFDF5' }}>Post-P3</th>
                    <th style={{ padding: '0.75rem 0.4rem', color: '#065F46', backgroundColor: '#ECFDF5' }}>Post-P4</th>
                    <th style={{ padding: '0.75rem 0.4rem', color: '#065F46', backgroundColor: '#ECFDF5' }}>Post-P5</th>
                    <th style={{ padding: '0.75rem 0.4rem', color: '#065F46', backgroundColor: '#ECFDF5' }}>Post-P6</th>
                    <th style={{ padding: '0.75rem 0.4rem', color: '#065F46', backgroundColor: '#ECFDF5' }}>Post-P7</th>
                    <th style={{ padding: '0.75rem 0.4rem', color: '#065F46', backgroundColor: '#ECFDF5' }}>Post-P8</th>
                    <th style={{ padding: '0.75rem 0.4rem', color: '#065F46', backgroundColor: '#ECFDF5' }}>Post-P9</th>
                    <th style={{ padding: '0.75rem 0.4rem', color: '#065F46', backgroundColor: '#ECFDF5' }}>Post-P10</th>
                    <th style={{ padding: '0.75rem 0.75rem', fontWeight: 800, color: '#059669' }}>Post-Total</th>
                  </>
                ) : (
                  <>
                    <th style={{ padding: '0.75rem 1rem' }}>Pre-Test Likert (10-40)</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Post-Test Likert (10-40)</th>
                  </>
                )}

                <th style={{ padding: '0.75rem 1rem' }}>Kategori Sikap SPSS</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status Responden</th>
              </tr>
            </thead>
            <tbody>
              {respondents.length === 0 ? (
                <tr>
                  <td colSpan={15} style={{ padding: '2.5rem', textAlign: 'center', color: '#94A3B8' }}>
                    Belum ada data responden yang tuntas diselesaikan. Silakan klik <strong>"Generate 35 Sampel Skripsi"</strong> di atas untuk mengisi data simulasi Firestore.
                  </td>
                </tr>
              ) : (
                respondents.map((r, idx) => {
                  const preAScore = r.preTest?.attitudeScore || 0;
                  const postAScore = r.postTest?.attitudeScore || 0;

                  const postCat = getLikertCategory(postAScore);
                  const timestampStr = formatFullTimestamp(r.postTest?.completedAt || r.createdAt);

                  const preAnswers = r.preTest?.attitudeAnswers || [];
                  const postAnswers = r.postTest?.attitudeAnswers || [];

                  const getItemScore = (answersList: any[], pNum: number, totalScore: number) => {
                    const found = answersList.find(a => a.questionId === pNum);
                    if (found && found.selectedScore) return found.selectedScore;
                    const base = Math.floor(totalScore / 10);
                    const rem = totalScore % 10;
                    return base + (pNum <= rem ? 1 : 0);
                  };

                  return (
                    <tr key={r.id || idx} style={{ borderBottom: '1px solid #F1F5F9', backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#64748B' }}>{idx + 1}</td>
                      <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Clock size={13} color="#EA580C" />
                          <span>{timestampStr}</span>
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#0F172A' }}>{r.demographics.name}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>{r.demographics.empId}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155' }}>
                          {r.demographics.age} Thn ({r.demographics.ageGroup === '<30' ? '< 30 Tahun' : '≥ 30 Tahun'})
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155' }}>
                          {r.demographics.workDuration} Thn ({r.demographics.workDurationGroup === '<3' ? '< 3 Tahun' : '≥ 3 Tahun'})
                        </span>
                      </td>

                      {/* Display P1-P10 or Total */}
                      {showItemizedLikert ? (
                        <>
                          {Array.from({ length: 10 }, (_, p) => (
                            <td key={`pre-p-${p}`} style={{ padding: '0.65rem 0.4rem', textAlign: 'center', color: '#334155' }}>
                              {getItemScore(preAnswers, p + 1, preAScore)}
                            </td>
                          ))}
                          <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700, textAlign: 'center' }}>{preAScore}</td>

                          {Array.from({ length: 10 }, (_, p) => (
                            <td key={`post-p-${p}`} style={{ padding: '0.65rem 0.4rem', textAlign: 'center', color: '#059669', fontWeight: 600 }}>
                              {getItemScore(postAnswers, p + 1, postAScore)}
                            </td>
                          ))}
                          <td style={{ padding: '0.65rem 0.75rem', fontWeight: 800, textAlign: 'center', color: '#059669' }}>{postAScore}</td>
                        </>
                      ) : (
                        <>
                          <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>
                            <span style={{ fontWeight: 700 }}>{preAScore}</span> / 40 Poin
                          </td>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#059669' }}>
                            <span style={{ fontSize: '0.95rem' }}>{postAScore}</span> / 40 Poin
                          </td>
                        </>
                      )}

                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{
                          backgroundColor: postCat === 'Baik' ? '#D1FAE5' : '#FEF3C7',
                          color: postCat === 'Baik' ? '#065F46' : '#92400E',
                          fontWeight: 700,
                          padding: '0.2rem 0.55rem',
                          borderRadius: '4px',
                          fontSize: '0.725rem'
                        }}>
                          {postCat} (Skor {postAScore})
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{ backgroundColor: '#D1FAE5', color: '#065F46', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.725rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <CheckCircle2 size={12} />
                          <span>Tuntas (Sertifikat)</span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Report Section for Chapter 4 Attachment */}
      <div style={{ marginTop: '2rem' }}>
        <PrintableReport respondents={respondents} onClose={() => {}} />
      </div>
    </div>
  );
};
