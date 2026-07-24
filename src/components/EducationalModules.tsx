import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, ShieldAlert, Activity, ArrowRight, Zap, Info, Server } from 'lucide-react';

interface EducationalModulesProps {
  onCompleteModules: () => void;
}

export const EducationalModules: React.FC<EducationalModulesProps> = ({ onCompleteModules }) => {
  const [activeTab, setActiveTab] = useState<'squat' | 'hiradc' | 'stretching'>('squat');
  const [completedTabs, setCompletedTabs] = useState<string[]>([]);

  // Stretching Timer State
  const [currentExercise, setCurrentExercise] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const exercises = [
    { title: "Peregangan Leher (Neck Stretch)", desc: "Tengadahkan leher ke atas perlahan dan miringkan ke kanan-kiri untuk merelaksasi otot trapezius.", icon: "🧘‍♂️" },
    { title: "Peregangan Bahu & Dada (Shoulder Roll)", desc: "Putar bahu ke belakang secara melingkar untuk membendung ketegangan otot bahu.", icon: "💪" },
    { title: "Peregangan Punggung Bawah (Lumbar Extension)", desc: "Letakkan tangan di pinggang dan dorong pinggul sedikit ke depan sambil membusungkan dada.", icon: "🧍‍♂️" },
    { title: "Peregangan Pergelangan Tangan (Wrist Flexion)", desc: "Luruskan lengan ke depan, tarik jemari ke belakang untuk merelaksasi otot flexor pergelangan.", icon: "✋" }
  ];

  // Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
      if (currentExercise < exercises.length - 1) {
        setCurrentExercise(prev => prev + 1);
        setTimerSeconds(30);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, currentExercise]);

  const handleTabChange = (tab: 'squat' | 'hiradc' | 'stretching') => {
    setActiveTab(tab);
    if (!completedTabs.includes(tab)) {
      setCompletedTabs([...completedTabs, tab]);
    }
  };

  const markModuleDone = (tab: string) => {
    if (!completedTabs.includes(tab)) {
      setCompletedTabs([...completedTabs, tab]);
    }
  };

  const allCompleted = completedTabs.includes('squat') && completedTabs.includes('hiradc') && completedTabs.includes('stretching');

  return (
    <div className="animate-fade" style={{ maxWidth: '950px', margin: '2rem auto', padding: '0 1rem' }}>
      {/* Top Banner */}
      <div className="card" style={{ marginBottom: '1.5rem', backgroundColor: '#0F172A', color: '#FFFFFF', borderColor: '#1E293B' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <span className="badge-safety">TAHAP 3: MODUL EDUKASI K3 INTERAKTIF</span>
        </div>
        <h2 style={{ fontSize: '1.55rem', fontWeight: 800 }}>
          Panduan Manual Handling & Ergonomi <span style={{ color: '#10B981' }}>ErgoTech K3</span>
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#94A3B8', marginTop: '0.25rem' }}>
          Pelajari 3 modul interaktif di bawah ini untuk memahami teknik pengangkatan aman, HIRADC K3, dan peregangan otot sebelum masuk ke tahap Post-Test.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => handleTabChange('squat')}
          style={{
            flex: 1,
            padding: '1rem 1.25rem',
            borderRadius: '10px',
            border: activeTab === 'squat' ? '2px solid #059669' : '1px solid #CBD5E1',
            backgroundColor: activeTab === 'squat' ? '#059669' : '#FFFFFF',
            color: activeTab === 'squat' ? '#FFFFFF' : '#334155',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            boxShadow: activeTab === 'squat' ? '0 4px 12px rgba(5, 150, 105, 0.25)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <Zap size={18} />
          <span>1. Squat vs Stoop Style</span>
          {completedTabs.includes('squat') && <CheckCircle size={16} color={activeTab === 'squat' ? '#FFFFFF' : '#10B981'} />}
        </button>

        <button
          onClick={() => handleTabChange('hiradc')}
          style={{
            flex: 1,
            padding: '1rem 1.25rem',
            borderRadius: '10px',
            border: activeTab === 'hiradc' ? '2px solid #059669' : '1px solid #CBD5E1',
            backgroundColor: activeTab === 'hiradc' ? '#059669' : '#FFFFFF',
            color: activeTab === 'hiradc' ? '#FFFFFF' : '#334155',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            boxShadow: activeTab === 'hiradc' ? '0 4px 12px rgba(5, 150, 105, 0.25)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <ShieldAlert size={18} />
          <span>2. Matriks HIRADC Data Center</span>
          {completedTabs.includes('hiradc') && <CheckCircle size={16} color={activeTab === 'hiradc' ? '#FFFFFF' : '#10B981'} />}
        </button>

        <button
          onClick={() => handleTabChange('stretching')}
          style={{
            flex: 1,
            padding: '1rem 1.25rem',
            borderRadius: '10px',
            border: activeTab === 'stretching' ? '2px solid #059669' : '1px solid #CBD5E1',
            backgroundColor: activeTab === 'stretching' ? '#059669' : '#FFFFFF',
            color: activeTab === 'stretching' ? '#FFFFFF' : '#334155',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            boxShadow: activeTab === 'stretching' ? '0 4px 12px rgba(5, 150, 105, 0.25)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <Activity size={18} />
          <span>3. Interactive Stretching Assistant</span>
          {completedTabs.includes('stretching') && <CheckCircle size={16} color={activeTab === 'stretching' ? '#FFFFFF' : '#10B981'} />}
        </button>
      </div>

      {/* TAB 1: SQUAT STYLE VS STOOP STYLE */}
      {activeTab === 'squat' && (
        <div className="card animate-fade">
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
            Simulasi Postur Angkat: Squat Style (SAFE) vs Stoop Style (UNSAFE)
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '1.5rem' }}>
            Teknisi manual handling di PT. Sinar Powerindo Utama sering mengangkat <i>server cabinet</i> (15-30 kg). Membingkukkan tulang belakang (Stoop Style) memicu gaya tekan 300+ kg pada lumbar disk L5/S1.
          </p>

          {/* Side-by-Side Visual Interactive Comparison Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.75rem' }}>
            {/* SAFE: Squat Style */}
            <div style={{
              border: '2px solid #10B981',
              backgroundColor: '#ECFDF5',
              borderRadius: '12px',
              padding: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ backgroundColor: '#059669', color: '#FFFFFF', fontWeight: 800, padding: '0.35rem 0.75rem', borderRadius: '50px', fontSize: '0.8rem' }}>
                  ✓ AMAN (SAFE LIFTING)
                </span>
                <span style={{ fontWeight: 700, color: '#047857' }}>Squat Style</span>
              </div>

              {/* Graphic Representation */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '1.5rem', textAlign: 'center', marginBottom: '1rem', border: '1px solid #A7F3D0' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🏋️‍♂️</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#065F46' }}>
                  Tulang Belakang Lurus + Tekuk Lutut
                </div>
              </div>

              <ul style={{ fontSize: '0.875rem', color: '#065F46', lineHeight: 1.6, paddingLeft: '1.25rem' }}>
                <li>Lutut ditekuk membentuk sudut 90 derajat.</li>
                <li>Tulang belakang tetap dalam aksis tegak/lurus.</li>
                <li>Beban ditahan oleh otot paha & kaki yang kuat.</li>
                <li>Beban dipegang sedekat mungkin ke perut/dada.</li>
              </ul>
            </div>

            {/* UNSAFE: Stoop Style */}
            <div style={{
              border: '2px solid #EF4444',
              backgroundColor: '#FEF2F2',
              borderRadius: '12px',
              padding: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ backgroundColor: '#DC2626', color: '#FFFFFF', fontWeight: 800, padding: '0.35rem 0.75rem', borderRadius: '50px', fontSize: '0.8rem' }}>
                  ✕ BAHAYA (UNSAFE LIFTING)
                </span>
                <span style={{ fontWeight: 700, color: '#B91C1C' }}>Stoop Style</span>
              </div>

              {/* Graphic Representation */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '1.5rem', textAlign: 'center', marginBottom: '1rem', border: '1px solid #FCA5A5' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🙇‍♂️</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#991B1B' }}>
                  Punggung Membungkukkan & Memutar Body
                </div>
              </div>

              <ul style={{ fontSize: '0.875rem', color: '#991B1B', lineHeight: 1.6, paddingLeft: '1.25rem' }}>
                <li>Punggung membungkuk ekstrem saat menjangkau beban.</li>
                <li>Kaki lurus statis sehingga beban bertumpu di pinggang.</li>
                <li>Memicu kecederaan diskus intervertebralis (HNP).</li>
                <li>Penyebab utama Low Back Pain (LBP) kronis.</li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => { markModuleDone('squat'); setActiveTab('hiradc'); }}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <span>Pahami Modul Ini & Lanjut ke Matriks HIRADC K3</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* TAB 2: HIRADC MATRIX DATA CENTER */}
      {activeTab === 'hiradc' && (
        <div className="card animate-fade">
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
            Identifikasi Bahaya & Matriks HIRADC Manual Handling Data Center
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '1.5rem' }}>
            Berikut adalah dokumen HIRADC (ISO 45001:2018) pengendalian risiko K3 manual handling di area operasional <i>server room</i> PT. Sinar Powerindo Utama.
          </p>

          <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#0F172A', color: '#FFFFFF' }}>
                  <th style={{ padding: '0.85rem 1rem', border: '1px solid #334155' }}>Aktivitas Kerja</th>
                  <th style={{ padding: '0.85rem 1rem', border: '1px solid #334155' }}>Potensi Bahaya</th>
                  <th style={{ padding: '0.85rem 1rem', border: '1px solid #334155' }}>Risiko Awal</th>
                  <th style={{ padding: '0.85rem 1rem', border: '1px solid #334155' }}>Langkah Kontrol Baru</th>
                  <th style={{ padding: '0.85rem 1rem', border: '1px solid #334155' }}>Risiko Sisa</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ backgroundColor: '#FFFFFF' }}>
                  <td style={{ padding: '0.85rem 1rem', border: '1px solid #E2E8F0', fontWeight: 600 }}>Cabinet Mounting Server (15-30 kg)</td>
                  <td style={{ padding: '0.85rem 1rem', border: '1px solid #E2E8F0' }}>Postur membungkuk & menjangkau jauh saat pasang unit.</td>
                  <td style={{ padding: '0.85rem 1rem', border: '1px solid #E2E8F0' }}>
                    <span style={{ backgroundColor: '#FEE2E2', color: '#991B1B', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>HIGH</span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', border: '1px solid #E2E8F0' }}>Edukasi ergonomi via website (squat style) & peregangan.</td>
                  <td style={{ padding: '0.85rem 1rem', border: '1px solid #E2E8F0' }}>
                    <span style={{ backgroundColor: '#D1FAE5', color: '#065F46', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>LOW</span>
                  </td>
                </tr>
                <tr style={{ backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '0.85rem 1rem', border: '1px solid #E2E8F0', fontWeight: 600 }}>Pemindahan Baterai UPS Cadangan</td>
                  <td style={{ padding: '0.85rem 1rem', border: '1px solid #E2E8F0' }}>Beban fisik berlebih (overexertion) manual handling.</td>
                  <td style={{ padding: '0.85rem 1rem', border: '1px solid #E2E8F0' }}>
                    <span style={{ backgroundColor: '#FEE2E2', color: '#991B1B', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>HIGH</span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', border: '1px solid #E2E8F0' }}>Penggunaan lift mekanik server & pengangkatan berpasangan (Team Lifting).</td>
                  <td style={{ padding: '0.85rem 1rem', border: '1px solid #E2E8F0' }}>
                    <span style={{ backgroundColor: '#FEF3C7', color: '#92400E', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>MEDIUM</span>
                  </td>
                </tr>
                <tr style={{ backgroundColor: '#FFFFFF' }}>
                  <td style={{ padding: '0.85rem 1rem', border: '1px solid #E2E8F0', fontWeight: 600 }}>Penarikan Kabel Optik Floor</td>
                  <td style={{ padding: '0.85rem 1rem', border: '1px solid #E2E8F0' }}>Postur jongkok statis & janggal durasi lama.</td>
                  <td style={{ padding: '0.85rem 1rem', border: '1px solid #E2E8F0' }}>
                    <span style={{ backgroundColor: '#FEF3C7', color: '#92400E', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>MEDIUM</span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', border: '1px solid #E2E8F0' }}>Sosialisasi rotasi kerja & video peregangan berkala 3-5 menit.</td>
                  <td style={{ padding: '0.85rem 1rem', border: '1px solid #E2E8F0' }}>
                    <span style={{ backgroundColor: '#D1FAE5', color: '#065F46', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>LOW</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <button
            onClick={() => { markModuleDone('hiradc'); setActiveTab('stretching'); }}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <span>Pahami HIRADC & Lanjut ke Asisten Peregangan Otot</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* TAB 3: INTERACTIVE STRETCHING ASSISTANT */}
      {activeTab === 'stretching' && (
        <div className="card animate-fade">
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
            Asisten Peregangan Otot Interaktif (Micro-Break 3-5 Menit)
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '1.5rem' }}>
            Lakukan peregangan singkat 30 detik untuk tiap gerakan di bawah ini untuk melancarkan sirkulasi darah dan mencegah kelelahan otot statis saat bekerja di <i>server room</i>.
          </p>

          {/* Current Exercise Display Box */}
          <div style={{
            backgroundColor: '#F8FAFC',
            border: '2px solid #059669',
            borderRadius: '12px',
            padding: '1.75rem',
            textAlign: 'center',
            marginBottom: '1.5rem'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>
              {exercises[currentExercise].icon}
            </div>

            <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
              {exercises[currentExercise].title}
            </h4>

            <p style={{ fontSize: '0.9rem', color: '#475569', maxWidth: '600px', margin: '0 auto 1.5rem auto' }}>
              {exercises[currentExercise].desc}
            </p>

            {/* Timer Counter */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              backgroundColor: '#0F172A',
              color: '#10B981',
              fontSize: '2.25rem',
              fontWeight: 800,
              border: '4px solid #10B981',
              marginBottom: '1.5rem',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
            }}>
              {timerSeconds}s
            </div>

            {/* Timer Controls */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="btn-primary"
                style={{ backgroundColor: isTimerRunning ? '#D97706' : '#059669' }}
              >
                {isTimerRunning ? <Pause size={18} /> : <Play size={18} />}
                <span>{isTimerRunning ? 'Jeda' : 'Mulai Stretching'}</span>
              </button>

              <button
                onClick={() => { setTimerSeconds(30); setIsTimerRunning(false); }}
                className="btn-secondary"
              >
                <RotateCcw size={18} />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Exercise Steps Selector */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.75rem' }}>
            {exercises.map((ex, idx) => (
              <button
                key={idx}
                onClick={() => { setCurrentExercise(idx); setTimerSeconds(30); setIsTimerRunning(false); }}
                style={{
                  padding: '0.85rem 0.5rem',
                  borderRadius: '8px',
                  border: currentExercise === idx ? '2px solid #059669' : '1px solid #E2E8F0',
                  backgroundColor: currentExercise === idx ? '#ECFDF5' : '#FFFFFF',
                  color: currentExercise === idx ? '#065F46' : '#334155',
                  fontWeight: currentExercise === idx ? 700 : 500,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <div>{ex.icon} Gerakan {idx + 1}</div>
              </button>
            ))}
          </div>

          <button
            onClick={() => { markModuleDone('stretching'); onCompleteModules(); }}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1.05rem' }}
          >
            <span>Selesaikan Modul & Lanjut ke Post-Test (Evaluasi Akhir)</span>
            <ArrowRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};
