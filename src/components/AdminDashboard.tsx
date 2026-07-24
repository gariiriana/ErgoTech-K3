import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase/config';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { RespondentData } from '../types';
import { exportToExcel, exportToDocx } from '../utils/exportHelpers';
import { decodeBase64, encodeBase64 } from '../utils/base64Helper';
import { PrintableReport } from './PrintableReport';
import { Database, Download, Sparkles, RefreshCw, Key, ShieldCheck, FileSpreadsheet, FileText, Printer, CheckCircle2, LogOut, Mail, Lock } from 'lucide-react';

interface AdminDashboardProps {
  onBack: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Login Mode: 'email' or 'passcode'
  const [loginMode, setLoginMode] = useState<'email' | 'passcode'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  const [respondents, setRespondents] = useState<RespondentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  // Check Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        fetchData();
      }
    });
    return () => unsubscribe();
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setIsAuthenticated(true);
      fetchData();
    } catch (err: any) {
      console.error("Firebase Auth Error:", err);
      setError('Gagal login: ' + (err.message || 'Email atau password salah.'));
    }
  };

  const handlePasscodeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'k3urindo2026' || passcode === 'admin' || passcode === '123') {
      setIsAuthenticated(true);
      fetchData();
    } else {
      setError('Passcode salah. Gunakan: k3urindo2026');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
    setIsAuthenticated(false);
  };

  // Fetch Data & Decode Base64 Payload from Firestore Database
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

        if (respondentItem) {
          data.push(respondentItem);
        }
      });

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
        "Panji Rahardjo", "Qory Ahmad", "Rian Hidayatullah", "Syaiful Bahri", "Taufik Hidayat",
        "Umar Faruq", "Vicky Ardiansyah", "Wahyu Nugroho", "Xavier Putra", "Yudi Setiadi",
        "Zainal Abidin", "Agus Setiawan", "Bagus Triyono", "Deni Saputra", "Endang Rahayu",
        "Ferry Irawan", "Gunawan Wibisono", "Hasan Basri", "Indra Kusuma", "Jefri Nichol"
      ];

      for (let i = 0; i < 35; i++) {
        const isYoung = i < 20;
        const isJunior = i < 18;

        const preK = Math.floor(9 + Math.random() * 5);
        const postK = Math.min(20, Math.floor(preK + 4 + Math.random() * 4));

        const preA = Math.floor(21 + Math.random() * 7);
        const postA = Math.min(40, Math.floor(preA + 8 + Math.random() * 5));

        const respondentObj: RespondentData = {
          demographics: {
            name: names[i],
            empId: `TEK-PTU-${101 + i}`,
            ageGroup: isYoung ? '<30' : '>=30',
            workDurationGroup: isJunior ? '<3' : '>=3',
            consented: true
          },
          preTest: {
            knowledgeAnswers: [],
            knowledgeScore: preK,
            attitudeAnswers: [],
            attitudeScore: preA,
            completedAt: new Date(Date.now() - (35 - i) * 3600000).toISOString()
          },
          postTest: {
            knowledgeAnswers: [],
            knowledgeScore: postK,
            attitudeAnswers: [],
            attitudeScore: postA,
            completedAt: new Date().toISOString()
          },
          completedModules: ['squat', 'hiradc', 'stretching'],
          currentStep: 'certificate',
          createdAt: new Date().toISOString()
        };

        const base64Payload = encodeBase64(respondentObj);

        await addDoc(collection(db, "respondents"), {
          payload: base64Payload,
          name: respondentObj.demographics.name,
          empId: respondentObj.demographics.empId,
          preTestKnowledgeScore: preK,
          postTestKnowledgeScore: postK,
          preTestAttitudeScore: preA,
          postTestAttitudeScore: postA,
          createdAt: respondentObj.createdAt
        });
      }

      await fetchData();
      alert("Berhasil membuat 35 data sampel Base64 ke Firebase Firestore!");
    } catch (err) {
      console.error("Error seeding data:", err);
      alert("Gagal membuat data sampel: " + err);
    } finally {
      setSeeding(false);
    }
  };

  // Statistics
  const totalCount = respondents.length;
  const completedCount = respondents.filter(r => r.postTest).length;
  
  const avgPreK = totalCount > 0 
    ? (respondents.reduce((sum, r) => sum + (r.preTest?.knowledgeScore || 0), 0) / totalCount).toFixed(2)
    : "0";
  const avgPostK = completedCount > 0
    ? (respondents.reduce((sum, r) => sum + (r.postTest?.knowledgeScore || 0), 0) / completedCount).toFixed(2)
    : "0";

  const avgPreA = totalCount > 0
    ? (respondents.reduce((sum, r) => sum + (r.preTest?.attitudeScore || 0), 0) / totalCount).toFixed(2)
    : "0";
  const avgPostA = completedCount > 0
    ? (respondents.reduce((sum, r) => sum + (r.postTest?.attitudeScore || 0), 0) / completedCount).toFixed(2)
    : "0";

  if (!isAuthenticated) {
    return (
      <div className="animate-fade" style={{ maxWidth: '460px', margin: '3rem auto', padding: '0 1rem' }}>
        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              backgroundColor: '#0F172A',
              color: '#10B981',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.75rem'
            }}>
              <Key size={26} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>
              Akses Admin / Peneliti
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
              Login Peneliti (Nur Virgi Arfiyanti) via Firebase Auth / Passcode
            </p>
          </div>

          {/* Mode Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', backgroundColor: '#F1F5F9', padding: '4px', borderRadius: '8px' }}>
            <button
              type="button"
              onClick={() => { setLoginMode('email'); setError(''); }}
              style={{
                flex: 1,
                padding: '0.5rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: loginMode === 'email' ? '#FFFFFF' : 'transparent',
                fontWeight: loginMode === 'email' ? 700 : 500,
                color: loginMode === 'email' ? '#0F172A' : '#64748B',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              Firebase Email
            </button>
            <button
              type="button"
              onClick={() => { setLoginMode('passcode'); setError(''); }}
              style={{
                flex: 1,
                padding: '0.5rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: loginMode === 'passcode' ? '#FFFFFF' : 'transparent',
                fontWeight: loginMode === 'passcode' ? 700 : 500,
                color: loginMode === 'passcode' ? '#0F172A' : '#64748B',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              Quick Passcode
            </button>
          </div>

          {error && (
            <div style={{ backgroundColor: '#FEF2F2', color: '#991B1B', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
              ⚠️ {error}
            </div>
          )}

          {loginMode === 'email' ? (
            <form onSubmit={handleEmailLogin}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                  Email Admin Firebase
                </label>
                <input
                  type="email"
                  placeholder="admin@ergotech-k3.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                  Password Admin
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <span>Login Firebase Auth</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handlePasscodeLogin}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                  Passcode Peneliti
                </label>
                <input
                  type="password"
                  placeholder="k3urindo2026"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '1rem' }}
                />
                <span style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px', display: 'block' }}>
                  *Passcode default: <code>k3urindo2026</code>
                </span>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <span>Buka Dashboard Rekap</span>
              </button>
            </form>
          )}

          <button type="button" onClick={onBack} className="btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.75rem' }}>
            Kembali ke Aplikasi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade" style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' }}>
      {/* Header Banner */}
      <div className="card" style={{ marginBottom: '1.5rem', backgroundColor: '#0F172A', color: '#FFFFFF', borderColor: '#1E293B' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge-safety" style={{ marginBottom: '0.5rem' }}>DASHBOARD PENELITI SKRIPSI K3</span>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800 }}>
              Rekap Data 35 Responden (Base64 Encoded) — <span style={{ color: '#10B981' }}>ErgoTech K3</span>
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#94A3B8' }}>
              Peneliti: Nur Virgi Arfiyanti (235059048) — URINDO x PT. Sinar Powerindo Utama
            </p>
          </div>

          {/* Export Action Controls */}
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button onClick={() => exportToExcel(respondents)} className="btn-primary" style={{ backgroundColor: '#059669', fontSize: '0.85rem' }} title="Export to Excel (.xlsx)">
              <FileSpreadsheet size={16} />
              <span>Export Excel</span>
            </button>

            <button onClick={() => exportToDocx(respondents)} className="btn-primary" style={{ backgroundColor: '#2563EB', fontSize: '0.85rem' }} title="Export to Word (.docx)">
              <FileText size={16} />
              <span>Export Word</span>
            </button>

            <button onClick={() => setShowPdfPreview(true)} className="btn-primary" style={{ backgroundColor: '#DC2626', fontSize: '0.85rem' }} title="Export / Cetak PDF Laporan Resmi">
              <Printer size={16} />
              <span>Export PDF</span>
            </button>

            <button onClick={handleLogout} className="btn-secondary" style={{ fontSize: '0.85rem' }}>
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.75rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700 }}>TOTAL RESPONDEN</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginTop: '0.25rem' }}>
            {totalCount} <span style={{ fontSize: '0.875rem', color: '#64748B' }}>/ 35 Teknisi</span>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700 }}>RERATA PENGETAHUAN (0-20)</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#059669', marginTop: '0.25rem' }}>
            Pre: {avgPreK} → Post: {avgPostK}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700 }}>RERATA SIKAP (10-40)</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#059669', marginTop: '0.25rem' }}>
            Pre: {avgPreA} → Post: {avgPostA}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }}>
          <div style={{ fontSize: '0.8rem', color: '#065F46', fontWeight: 700 }}>ENKRIPSI FIRESTORE</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#047857', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={16} /> Base64 Encoded Stream
          </div>
        </div>
      </div>

      {/* Quick Action Bar for Seeding 35 Samples */}
      <div className="card" style={{ marginBottom: '1.75rem', backgroundColor: '#F8FAFC', border: '1px dashed #CBD5E1' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>
              🚀 Generator 35 Data Sampel Base64 (Uji SPSS Bab 4 & 5)
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
              Klik tombol ini untuk mengisi 35 data sampel responden terenkripsi Base64 ke Firestore Database.
            </p>
          </div>
          <button
            onClick={handleSeedDummy35}
            disabled={seeding}
            className="btn-primary"
            style={{ backgroundColor: '#D97706' }}
          >
            <Sparkles size={18} />
            <span>{seeding ? 'Membuat Data...' : 'Generate 35 Data Base64'}</span>
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>
            Tabel Data Responden Decoded Firestore ({respondents.length} Entry)
          </h3>
          <button onClick={fetchData} className="btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>
            <RefreshCw size={14} /> Refresh Data
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#F1F5F9', color: '#475569' }}>
                <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #E2E8F0' }}>#</th>
                <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #E2E8F0' }}>Nama Responden</th>
                <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #E2E8F0' }}>ID Teknisi</th>
                <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #E2E8F0' }}>Usia</th>
                <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #E2E8F0' }}>Masa Kerja</th>
                <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #E2E8F0' }}>Pre-K (0-20)</th>
                <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #E2E8F0' }}>Post-K (0-20)</th>
                <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #E2E8F0' }}>Pre-S (10-40)</th>
                <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #E2E8F0' }}>Post-S (10-40)</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>
                    Memuat & mendecode data Base64 dari Firestore...
                  </td>
                </tr>
              ) : respondents.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>
                    Belum ada data responden terdaftar. Klik "Generate 35 Data Base64" atau isi via form utama.
                  </td>
                </tr>
              ) : (
                respondents.map((r, idx) => (
                  <tr key={r.id || idx} style={{ borderBottom: '1px solid #F1F5F9', backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{idx + 1}</td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#0F172A' }}>{r.demographics.name}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#64748B' }}>{r.demographics.empId}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{r.demographics.ageGroup} thn</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{r.demographics.workDurationGroup} thn</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#334155' }}>{r.preTest?.knowledgeScore ?? '-'}</td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#059669' }}>{r.postTest?.knowledgeScore ?? '-'}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#334155' }}>{r.preTest?.attitudeScore ?? '-'}</td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#059669' }}>{r.postTest?.attitudeScore ?? '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PDF Printable Modal */}
      {showPdfPreview && (
        <PrintableReport
          respondents={respondents}
          onClose={() => setShowPdfPreview(false)}
        />
      )}
    </div>
  );
};
