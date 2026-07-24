import React, { useState } from 'react';
import { CheckCircle2, ShieldAlert, Activity, ArrowRight, Zap, Check, AlertTriangle, Video, HeartPulse, Sparkles, FileCheck, ShieldCheck, Truck, AlertCircle } from 'lucide-react';

interface EducationalModulesProps {
  onCompleteModules: () => void;
}

export const EducationalModules: React.FC<EducationalModulesProps> = ({ onCompleteModules }) => {
  const [activeTab, setActiveTab] = useState<'squat' | 'hiradc' | 'sop'>('squat');
  const [completedTabs, setCompletedTabs] = useState<string[]>([]);

  const hiradcItems = [
    {
      activity: "Cabinet Mounting Server (15-30 kg)",
      hazard: "Postur membungkuk & menjangkau jauh saat pasang unit.",
      initialRisk: "HIGH",
      control: "Edukasi ergonomi via website (squat style) & peregangan.",
      residualRisk: "LOW"
    },
    {
      activity: "Pemindahan Baterai UPS Cadangan",
      hazard: "Beban fisik berlebih (overexertion) manual handling.",
      initialRisk: "HIGH",
      control: "Penggunaan lift mekanik server & team lifting.",
      residualRisk: "MEDIUM"
    },
    {
      activity: "Penarikan Kabel Optik Floor",
      hazard: "Postur jongkok statis & janggal durasi lama.",
      initialRisk: "MEDIUM",
      control: "Sosialisasi rotasi kerja & peregangan berkala 3-5m.",
      residualRisk: "LOW"
    }
  ];

  const handleTabChange = (tab: 'squat' | 'hiradc' | 'sop') => {
    setActiveTab(tab);
    if (!completedTabs.includes(tab)) {
      setCompletedTabs([...completedTabs, tab]);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const markModuleDone = (tab: string) => {
    if (!completedTabs.includes(tab)) {
      setCompletedTabs([...completedTabs, tab]);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="animate-fade" style={{ maxWidth: '900px', margin: '1.25rem auto', padding: '0 0.85rem' }}>
      {/* Header Banner */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div className="badge-safety" style={{ marginBottom: '0.25rem' }}>TAHAP 3: MODUL EDUKASI K3 INTERAKTIF</div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>
          Panduan Manual Handling & Ergonomi <span style={{ color: '#EA580C' }}>ErgoTech K3</span>
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '2px' }}>
          Pelajari 3 modul ergonomi di bawah ini sebelum melanjutkan ke tahap Post-Test.
        </p>
      </div>

      {/* Segmented Tab Bar - Guaranteed Single Line Text */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        backgroundColor: '#F1F5F9',
        borderRadius: '8px',
        padding: '3px',
        marginBottom: '1.25rem',
        border: '1px solid #E2E8F0'
      }}>
        <button
          type="button"
          onClick={() => handleTabChange('squat')}
          style={{
            backgroundColor: activeTab === 'squat' ? '#FFFFFF' : 'transparent',
            color: activeTab === 'squat' ? '#EA580C' : '#64748B',
            fontWeight: activeTab === 'squat' ? 700 : 500,
            fontSize: '0.775rem',
            padding: '0.55rem 0.15rem',
            borderRadius: '6px',
            border: 'none',
            boxShadow: activeTab === 'squat' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.25rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            transition: 'all 0.15s ease'
          }}
        >
          <Zap size={14} color={activeTab === 'squat' ? '#EA580C' : '#94A3B8'} style={{ flexShrink: 0 }} />
          <span style={{ whiteSpace: 'nowrap' }}>1. Squat</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('hiradc')}
          style={{
            backgroundColor: activeTab === 'hiradc' ? '#FFFFFF' : 'transparent',
            color: activeTab === 'hiradc' ? '#EA580C' : '#64748B',
            fontWeight: activeTab === 'hiradc' ? 700 : 500,
            fontSize: '0.775rem',
            padding: '0.55rem 0.15rem',
            borderRadius: '6px',
            border: 'none',
            boxShadow: activeTab === 'hiradc' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.25rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            transition: 'all 0.15s ease'
          }}
        >
          <ShieldAlert size={14} color={activeTab === 'hiradc' ? '#EA580C' : '#94A3B8'} style={{ flexShrink: 0 }} />
          <span style={{ whiteSpace: 'nowrap' }}>2. HIRADC</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('sop')}
          style={{
            backgroundColor: activeTab === 'sop' ? '#FFFFFF' : 'transparent',
            color: activeTab === 'sop' ? '#EA580C' : '#64748B',
            fontWeight: activeTab === 'sop' ? 700 : 500,
            fontSize: '0.775rem',
            padding: '0.55rem 0.15rem',
            borderRadius: '6px',
            border: 'none',
            boxShadow: activeTab === 'sop' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.25rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            transition: 'all 0.15s ease'
          }}
        >
          <FileCheck size={14} color={activeTab === 'sop' ? '#EA580C' : '#94A3B8'} style={{ flexShrink: 0 }} />
          <span style={{ whiteSpace: 'nowrap' }}>3. SOP K3</span>
        </button>
      </div>

      {/* TAB 1: SQUAT STYLE VS STOOP STYLE */}
      {activeTab === 'squat' && (
        <div className="card animate-fade">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem' }}>
            Simulasi Postur WorkSafeBC: Lifting in the Workplace (Squat Style vs Stoop Style)
          </h3>
          <p style={{ fontSize: '0.825rem', color: '#64748B', marginBottom: '1rem', lineHeight: 1.5 }}>
            Prinsip Ergonomi WorkSafeBC: Mengurangi risiko cedera otot tulang belakang (Low Back Pain / HNP) saat pengangkatan <i>manual handling server cabinet</i> (15–30 kg) di tempat kerja.
          </p>

          {/* WorkSafeBC Video Player Embed (zss9jRW4oWw) */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: '#EA580C', marginBottom: '0.4rem' }}>
              <Video size={16} />
              <span>Video Edukasi WorkSafeBC: Lifting in the Workplace (Reducing Lifting Risks)</span>
            </div>

            <div style={{
              position: 'relative',
              paddingBottom: '56.25%',
              height: 0,
              overflow: 'hidden',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#0F172A'
            }}>
              <iframe
                src="https://www.youtube.com/embed/zss9jRW4oWw?rel=0"
                title="Lifting in the Workplace | WorkSafeBC"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
              />
            </div>
          </div>

          {/* Kesimpulan Video & Pesan Nasihat K3 Teknisi */}
          <div className="comparison-grid-2col">
            {/* Box 1: Kesimpulan Video WorkSafeBC */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderTop: '3px solid #059669',
              borderRadius: '8px',
              padding: '1.1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#059669', fontWeight: 800, fontSize: '0.9rem' }}>
                <CheckCircle2 size={18} />
                <span>Kesimpulan Utama Video WorkSafeBC</span>
              </div>

              <div style={{ fontSize: '0.825rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
                  <Check size={16} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Prioritaskan Area Power Zone:</strong> Selalu angkat beban di zona antara paha tengah dan dada agar beban aksial pada spinal disk tetap minim.</span>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
                  <Check size={16} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Kekuatan Otot Kaki (Squat Style):</strong> Jaga punggung tetap lurus, tekuk lutut 90°, dan gunakan dorongan otot paha agar pinggang tidak menanggung 300+ kg tekanan.</span>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
                  <Check size={16} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Rencanakan Pengangkatan (Plan the Lift):</strong> Periksa berat beban, pastikan jalur bebas hambatan, dan hindari gerakan memutar badan (twisting).</span>
                </div>
              </div>
            </div>

            {/* Box 2: Pesan Nasihat & Imbauan Keselamatan Teknisi */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderTop: '3px solid #EA580C',
              borderRadius: '8px',
              padding: '1.1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#EA580C', fontWeight: 800, fontSize: '0.9rem' }}>
                <HeartPulse size={18} />
                <span>Pesan Nasihat & Imbauan K3 Teknisi</span>
              </div>

              <div style={{ fontSize: '0.825rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
                  <Sparkles size={16} color="#EA580C" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>"Tulang Belakang Anda Tidak Memiliki Suku Cadang":</strong> Cedera saraf kejepit (HNP) dan Low Back Pain bersifat permanen. Jaga kesehatan punggung Anda demi masa depan keluarga.</span>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
                  <Sparkles size={16} color="#EA580C" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Jangan Ragu Minta Bantuan (Team Lifting):</strong> Jangan mengorbankan diri hanya karena ingin cepat selesai. Gunakan trolley hidrolik jika beban server &gt;25 kg.</span>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
                  <Sparkles size={16} color="#EA580C" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Patuhi SOP & Sempatkan Micro-Break:</strong> Luangkan waktu 3-5 menit untuk peregangan otot di sela jam kerja demi menjaga produktivitas jangka panjang.</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => { markModuleDone('squat'); setActiveTab('hiradc'); }}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
          >
            <span>Pahami Modul Ini & Lanjut ke Matriks HIRADC K3</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* TAB 2: HIRADC MATRIX DATA CENTER */}
      {activeTab === 'hiradc' && (
        <div className="card animate-fade">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem' }}>
            Matriks Pengendalian Risiko HIRADC (ISO 45001:2018)
          </h3>
          <p style={{ fontSize: '0.825rem', color: '#64748B', marginBottom: '1.25rem' }}>
            Dokumen keselamatan kerja manual handling area Server Room PT. Sinar Powerindo Utama:
          </p>

          {/* Desktop Table View */}
          <div className="steps-desktop" style={{ flexDirection: 'column', marginBottom: '1.25rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', color: '#334155', borderBottom: '2px solid #E2E8F0' }}>
                  <th style={{ padding: '0.65rem 0.75rem' }}>Aktivitas Kerja</th>
                  <th style={{ padding: '0.65rem 0.75rem' }}>Potensi Bahaya</th>
                  <th style={{ padding: '0.65rem 0.75rem' }}>Risiko Awal</th>
                  <th style={{ padding: '0.65rem 0.75rem' }}>Langkah Pengendalian</th>
                  <th style={{ padding: '0.65rem 0.75rem' }}>Risiko Sisa</th>
                </tr>
              </thead>
              <tbody>
                {hiradcItems.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600 }}>{item.activity}</td>
                    <td style={{ padding: '0.65rem 0.75rem', color: '#475569' }}>{item.hazard}</td>
                    <td style={{ padding: '0.65rem 0.75rem' }}>
                      <span style={{ backgroundColor: item.initialRisk === 'HIGH' ? '#FEE2E2' : '#FEF3C7', color: item.initialRisk === 'HIGH' ? '#991B1B' : '#92400E', fontWeight: 700, padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem' }}>
                        {item.initialRisk}
                      </span>
                    </td>
                    <td style={{ padding: '0.65rem 0.75rem', color: '#475569' }}>{item.control}</td>
                    <td style={{ padding: '0.65rem 0.75rem' }}>
                      <span style={{ backgroundColor: item.residualRisk === 'LOW' ? '#D1FAE5' : '#FEF3C7', color: item.residualRisk === 'LOW' ? '#065F46' : '#92400E', fontWeight: 700, padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem' }}>
                        {item.residualRisk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Zero-Scroll Compact Card List */}
          <div className="steps-mobile" style={{ flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {hiradcItems.map((item, idx) => (
              <div key={idx} style={{
                width: '100%',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '0.85rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0F172A' }}>{item.activity}</div>
                  <div style={{ display: 'flex', gap: '0.3rem', fontSize: '0.65rem' }}>
                    <span style={{ backgroundColor: item.initialRisk === 'HIGH' ? '#FEE2E2' : '#FEF3C7', color: item.initialRisk === 'HIGH' ? '#991B1B' : '#92400E', fontWeight: 700, padding: '0.15rem 0.35rem', borderRadius: '4px' }}>
                      Awal: {item.initialRisk}
                    </span>
                    <span style={{ backgroundColor: item.residualRisk === 'LOW' ? '#D1FAE5' : '#FEF3C7', color: item.residualRisk === 'LOW' ? '#065F46' : '#92400E', fontWeight: 700, padding: '0.15rem 0.35rem', borderRadius: '4px' }}>
                      Sisa: {item.residualRisk}
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: '0.775rem', color: '#475569', lineHeight: 1.4, marginBottom: '0.3rem' }}>
                  <strong>Bahaya:</strong> {item.hazard}
                </div>
                <div style={{ fontSize: '0.775rem', color: '#059669', lineHeight: 1.4, fontWeight: 600 }}>
                  <strong>Pengendalian:</strong> {item.control}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => { markModuleDone('hiradc'); setActiveTab('sop'); }}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <span>Pahami HIRADC & Lanjut ke Standar SOP K3</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* TAB 3: STANDAR OPERASIONAL PROSEDUR (SOP K3 MANUAL HANDLING) */}
      {activeTab === 'sop' && (
        <div className="card animate-fade">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem' }}>
            Standar Operasional Prosedur (SOP K3 Manual Handling)
          </h3>
          <p style={{ fontSize: '0.825rem', color: '#64748B', marginBottom: '1.25rem' }}>
            Prosedur standar pengangkatan aman server cabinet & perangkat IT Data Center PT. Sinar Powerindo Utama:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            {/* Rule 1: Weight Threshold & Team Lifting */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderLeft: '4px solid #EA580C',
              borderRadius: '8px',
              padding: '1.1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#EA580C', fontWeight: 800, fontSize: '0.9rem' }}>
                <Truck size={18} />
                <span>1. Ambang Batas Beban & Pengangkatan Berkelompok (Team Lifting)</span>
              </div>
              <ul style={{ fontSize: '0.825rem', color: '#334155', paddingLeft: '1.2rem', lineHeight: 1.6 }}>
                <li>Beban individu maksimal &le; 25 kg. Jangan memaksakan mengangkat perangkat berat sendirian.</li>
                <li>Beban di atas &gt; 25 kg (seperti <i>UPS battery pack / server 4U</i>) <strong>WAJIB diangkat oleh 2 teknisi (Team Lifting)</strong> atau menggunakan meja angkat hidrolik (<i>Server Lift Trolley</i>).</li>
              </ul>
            </div>

            {/* Rule 2: APD & Equipment Checklist */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderLeft: '4px solid #059669',
              borderRadius: '8px',
              padding: '1.1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#059669', fontWeight: 800, fontSize: '0.9rem' }}>
                <ShieldCheck size={18} />
                <span>2. Peralatan & Alat Pelindung Diri (APD) Wajib</span>
              </div>
              <ul style={{ fontSize: '0.825rem', color: '#334155', paddingLeft: '1.2rem', lineHeight: 1.6 }}>
                <li><strong>Sepatu Safety (Anti-Selip):</strong> Mencegah bahaya tergelincir di atas lantai keramik/<i>raised floor</i> Data Center.</li>
                <li><strong>Sarung Tangan Bintik Karet (*Grip Gloves*):</strong> Memastikan cengkeraman mantap dan mencegah lecet saat memegang sasis logam server.</li>
              </ul>
            </div>

            {/* Rule 3: Ergonomic First Aid */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderLeft: '4px solid #2563EB',
              borderRadius: '8px',
              padding: '1.1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#2563EB', fontWeight: 800, fontSize: '0.9rem' }}>
                <AlertCircle size={18} />
                <span>3. Tanggap Darurat Nyeri Otot & Insiden Ergonomi</span>
              </div>
              <ul style={{ fontSize: '0.825rem', color: '#334155', paddingLeft: '1.2rem', lineHeight: 1.6 }}>
                <li>Hentikan pekerjaan secara instan jika timbul ketegangan otot mendadak atau sensasi kram di pinggang.</li>
                <li>Istirahat 5-10 menit di area sejuk dan laporkan kendala ke Supervisor K3 PT. Sinar Powerindo Utama.</li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => {
              markModuleDone('sop');
              onCompleteModules();
            }}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', backgroundColor: '#059669' }}
          >
            <span>Selesaikan Seluruh Modul & Lanjut ke Post-Test</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
