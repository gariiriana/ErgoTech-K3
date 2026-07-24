import React from 'react';
import { RespondentData } from '../types';
import { Printer, Download, ShieldCheck, Award, BarChart3 } from 'lucide-react';
import { getLikertCategory } from '../utils/exportHelpers';

interface PrintableReportProps {
  respondents: RespondentData[];
  onClose?: () => void;
}

export const PrintableReport: React.FC<PrintableReportProps> = ({ respondents }) => {
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

  const preBaikCount = respondents.filter(r => (r.preTest?.attitudeScore || 0) >= 26).length;
  const postBaikCount = respondents.filter(r => (r.postTest?.attitudeScore || 0) >= 26).length;

  const preBaikPct = totalCount > 0 ? ((preBaikCount / totalCount) * 100).toFixed(0) : '0';
  const postBaikPct = totalCount > 0 ? ((postBaikCount / totalCount) * 100).toFixed(0) : '0';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="animate-fade" style={{ width: '100%', maxWidth: '1100px', margin: '2rem auto 0 auto' }}>
      {/* Inline Page Action Header Bar (No Pop-Up Overlay) */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
        backgroundColor: '#FFF7ED',
        border: '1.5px solid #FDBA74',
        padding: '0.85rem 1.25rem',
        borderRadius: '10px',
        color: '#0F172A',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '0.9rem' }}>
          <Printer size={18} color="#EA580C" />
          <span>Prinjau Laporan Cetak PDF (Format Resmi Skripsi K3 URINDO)</span>
        </div>

        <button
          onClick={handlePrint}
          className="btn-primary"
          style={{ padding: '0.55rem 1.1rem', fontSize: '0.825rem' }}
        >
          <Printer size={16} />
          <span>Cetak / Export PDF Laporan</span>
        </button>
      </div>

      {/* Printable Sheet Container (Clean Page Component) */}
      <div id="printable-area" className="card" style={{
        backgroundColor: '#FFFFFF',
        width: '100%',
        padding: '2rem 1.5rem',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        color: '#0F172A',
        fontSize: '0.825rem',
        lineHeight: 1.5,
        boxSizing: 'border-box'
      }}>
        {/* Responsive Dual Logo Corporate & University Header */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '3px double #EA580C',
          paddingBottom: '0.85rem',
          marginBottom: '1.25rem',
          gap: '0.75rem'
        }}>
          {/* Left Logo: PT Sinar Powerindo Utama */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/logo-powerindo.png" alt="PT Sinar Powerindo Utama" style={{ height: '48px', objectFit: 'contain' }} />
          </div>

          {/* Title Header */}
          <div style={{ textAlign: 'center', flex: 1, minWidth: '220px' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#0F172A', margin: 0 }}>
              PT. SINAR POWERINDO UTAMA
            </h2>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#EA580C', margin: '2px 0 0 0' }}>
              FAKULTAS ILMU KESEHATAN — UNIVERSITAS RESPATI INDONESIA
            </h3>
            <p style={{ fontSize: '0.725rem', color: '#64748B', marginTop: '2px', margin: 0 }}>
              Unit Server Room Data Center — Riset Skripsi K3 (Nur Virgi Arfiyanti / 235059048)
            </p>
          </div>

          {/* Right Logo: Universitas Respati Indonesia (URINDO) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img src="/logo-urindo-official.png" alt="Universitas Respati Indonesia" style={{ height: '48px', objectFit: 'contain' }} />
            <div style={{
              textAlign: 'right',
              fontSize: '0.675rem',
              fontWeight: 800,
              color: '#EA580C',
              lineHeight: 1.2
            }}>
              FIKES URINDO<br />SARJANA K3<br />2026
            </div>
          </div>
        </div>

        {/* Executive Summary Statement */}
        <div style={{ marginBottom: '1.25rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A', borderLeft: '4px solid #EA580C', paddingLeft: '0.5rem', marginBottom: '0.65rem' }}>
            LAPORAN REKAPITULASI HASIL INTERVENSI EDUKASI ERGONOMI (SKALA LIKERT)
          </h4>

          {/* Responsive KPI Grid */}
          <div className="kpi-grid-4col" style={{ display: 'grid', gap: '0.65rem', backgroundColor: '#FFF7ED', padding: '0.85rem', borderRadius: '8px', border: '1px solid #FED7AA', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.675rem', color: '#64748B', fontWeight: 700 }}>JUMLAH RESPONDEN</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>{totalCount} Teknisi</div>
            </div>
            <div>
              <div style={{ fontSize: '0.675rem', color: '#64748B', fontWeight: 700 }}>RERATA PRE-LIKERT</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#334155' }}>{avgPreA} / 40 Poin</div>
            </div>
            <div>
              <div style={{ fontSize: '0.675rem', color: '#64748B', fontWeight: 700 }}>RERATA POST-LIKERT</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#059669' }}>{avgPostA} / 40 Poin</div>
            </div>
            <div>
              <div style={{ fontSize: '0.675rem', color: '#64748B', fontWeight: 700 }}>PERSENTASE BAIK (≥26)</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#059669' }}>{postBaikPct}% Responden</div>
            </div>
          </div>

          {/* Visual Bar Chart Section for PDF Export */}
          <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.85rem 1rem' }}>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <BarChart3 size={15} color="#EA580C" />
              <span>GRAFIK BATANG HASIL INTERVENSI SKALA LIKERT ERGONOMI K3</span>
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'flex-end' }}>
              {/* Bar 1: Rata-rata Skor */}
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#475569', marginBottom: '0.4rem', textAlign: 'center' }}>
                  a. Rata-rata Skor Likert (Max 40 Poin)
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '110px', padding: '0 0.5rem', borderBottom: '2px solid #CBD5E1' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '45px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', marginBottom: '2px' }}>{avgPreA}</span>
                    <div style={{ width: '100%', height: `${(Number(avgPreA) / 40) * 90}px`, backgroundColor: '#64748B', borderRadius: '4px 4px 0 0' }}></div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748B', marginTop: '4px' }}>Pre-Test</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '45px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', marginBottom: '2px' }}>{avgPostA}</span>
                    <div style={{ width: '100%', height: `${(Number(avgPostA) / 40) * 90}px`, backgroundColor: '#059669', borderRadius: '4px 4px 0 0' }}></div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#059669', marginTop: '4px' }}>Post-Test</span>
                  </div>
                </div>
              </div>

              {/* Bar 2: Persentase Baik */}
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#475569', marginBottom: '0.4rem', textAlign: 'center' }}>
                  b. Persentase Responden Kategori Baik (≥26 Poin)
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '110px', padding: '0 0.5rem', borderBottom: '2px solid #CBD5E1' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '45px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', marginBottom: '2px' }}>{preBaikPct}%</span>
                    <div style={{ width: '100%', height: `${Math.max(8, (Number(preBaikPct) / 100) * 90)}px`, backgroundColor: '#94A3B8', borderRadius: '4px 4px 0 0' }}></div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748B', marginTop: '4px' }}>Pre Baik</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '45px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', marginBottom: '2px' }}>{postBaikPct}%</span>
                    <div style={{ width: '100%', height: `${Math.max(8, (Number(postBaikPct) / 100) * 90)}px`, backgroundColor: '#059669', borderRadius: '4px 4px 0 0' }}></div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#059669', marginTop: '4px' }}>Post Baik</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table with Responsive Horizontal Scroll */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.4rem' }}>
            Tabel Rekapitulasi Data Responden Decoded Firestore Database ({respondents.length} Entry)
          </h4>

          <div style={{ overflowX: 'auto', width: '100%', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.725rem', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ backgroundColor: '#FFF7ED', color: '#C2410C', borderTop: '2px solid #EA580C', borderBottom: '2px solid #EA580C' }}>
                  <th style={{ padding: '0.45rem', width: '30px' }}>#</th>
                  <th style={{ padding: '0.45rem' }}>Nama Responden</th>
                  <th style={{ padding: '0.45rem' }}>Gender</th>
                  <th style={{ padding: '0.45rem' }}>ID Teknisi</th>
                  <th style={{ padding: '0.45rem' }}>Usia</th>
                  <th style={{ padding: '0.45rem' }}>Masa Kerja</th>
                  <th style={{ padding: '0.45rem' }}>Pre-Likert (10-40)</th>
                  <th style={{ padding: '0.45rem' }}>Post-Likert (10-40)</th>
                  <th style={{ padding: '0.45rem' }}>Kategori SPSS</th>
                </tr>
              </thead>
              <tbody>
                {respondents.map((r, idx) => {
                  const preA = r.preTest?.attitudeScore ?? 0;
                  const postA = r.postTest?.attitudeScore ?? 0;

                  return (
                    <tr key={r.id || idx} style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC' }}>
                      <td style={{ padding: '0.4rem 0.45rem', fontWeight: 600 }}>{idx + 1}</td>
                      <td style={{ padding: '0.4rem 0.45rem', fontWeight: 700, whiteSpace: 'nowrap' }}>{r.demographics.name}</td>
                      <td style={{ padding: '0.4rem 0.45rem' }}>{r.demographics.gender || 'Laki-laki'}</td>
                      <td style={{ padding: '0.4rem 0.45rem', color: '#64748B' }}>{r.demographics.empId}</td>
                      <td style={{ padding: '0.4rem 0.45rem' }}>{r.demographics.age ? `${r.demographics.age} thn` : r.demographics.ageGroup}</td>
                      <td style={{ padding: '0.4rem 0.45rem' }}>{r.demographics.workDuration ? `${r.demographics.workDuration} thn` : r.demographics.workDurationGroup}</td>
                      <td style={{ padding: '0.4rem 0.45rem' }}>{r.preTest ? `${preA}/40` : '-'}</td>
                      <td style={{ padding: '0.4rem 0.45rem', fontWeight: 700, color: '#059669' }}>{r.postTest ? `${postA}/40` : '-'}</td>
                      <td style={{ padding: '0.4rem 0.45rem', fontWeight: 700, color: getLikertCategory(postA) === 'Baik' ? '#059669' : '#D97706' }}>
                        {getLikertCategory(postA)} (Skor {postA})
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Responsive Formal Signature Approval Footer */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          marginTop: '2rem',
          paddingTop: '1rem',
          borderTop: '1px solid #E2E8F0',
          fontSize: '0.75rem'
        }}>
          <div>
            <p>Mengetahui,</p>
            <p style={{ fontWeight: 800, marginTop: '2px' }}>PT. Sinar Powerindo Utama</p>
            <div style={{ height: '40px' }}></div>
            <p style={{ fontWeight: 700, textDecoration: 'underline' }}>Supervisor Data Center Server Room</p>
            <p style={{ color: '#64748B', fontSize: '0.7rem' }}>NIP / ID: PTU-SPV-2026</p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <p>Jakarta, {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p style={{ fontWeight: 800, marginTop: '2px' }}>Peneliti Skripsi K3 URINDO</p>
            <div style={{ height: '40px' }}></div>
            <p style={{ fontWeight: 700, textDecoration: 'underline' }}>Nur Virgi Arfiyanti</p>
            <p style={{ color: '#64748B', fontSize: '0.7rem' }}>NIM: 235059048</p>
          </div>
        </div>
      </div>
    </div>
  );
};
