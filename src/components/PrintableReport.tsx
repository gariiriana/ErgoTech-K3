import React from 'react';
import { RespondentData } from '../types';
import { Printer, X, Download, ShieldCheck, Server } from 'lucide-react';

interface PrintableReportProps {
  respondents: RespondentData[];
  onClose: () => void;
}

export const PrintableReport: React.FC<PrintableReportProps> = ({ respondents, onClose }) => {
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(4px)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      overflowY: 'auto',
      padding: '2rem 1rem'
    }}>
      {/* Printable Sheet Container */}
      <div style={{
        backgroundColor: '#FFFFFF',
        maxWidth: '900px',
        width: '100%',
        borderRadius: '12px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        padding: '2.5rem',
        position: 'relative'
      }} className="printable-document">

        {/* Action Controls (Hidden when printing) */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          borderBottom: '1px solid #E2E8F0',
          paddingBottom: '1rem'
        }} className="no-print">
          <div style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 600 }}>
            📄 Preview Laporan Resmi PDF & Cetak
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={handlePrint} className="btn-primary">
              <Printer size={18} />
              <span>Cetak ke PDF / Print</span>
            </button>
            <button onClick={onClose} className="btn-secondary">
              <X size={18} />
              <span>Tutup</span>
            </button>
          </div>
        </div>

        {/* TOP ACCENT BAR */}
        <div style={{
          height: '6px',
          background: 'linear-gradient(90deg, #0F172A 0%, #059669 50%, #D97706 100%)',
          borderRadius: '4px',
          marginBottom: '1.5rem'
        }}></div>

        {/* REPORT HEADER WITH BOTH LOGOS */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          borderBottom: '2px solid #0F172A',
          paddingBottom: '1.25rem'
        }}>
          {/* LOGO 1: PT. SINAR POWERINDO UTAMA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img 
              src="/logo-powerindo.png" 
              alt="PT Sinar Powerindo Utama" 
              style={{ height: '52px', objectFit: 'contain' }} 
            />
          </div>

          {/* REPORT CENTER TITLE */}
          <div style={{ textAlign: 'center', flex: 1, padding: '0 1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
              LAPORAN HASIL EVALUASI INTERVENSI K3 ERGONOMI
            </h2>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#059669', marginTop: '2px' }}>
              Platform Edukasi Ergonomi & Manual Handling Data Center (ErgoTech K3)
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
              PT. Sinar Powerindo Utama x Program Studi Sarjana Kesehatan Masyarakat URINDO
            </div>
          </div>

          {/* LOGO 2: UNIVERSITAS RESPATI INDONESIA (URINDO) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img 
              src="/logo-urindo.png" 
              alt="Universitas Respati Indonesia" 
              style={{ height: '52px', objectFit: 'contain' }} 
            />
          </div>
        </div>

        {/* METADATA SUMMARY */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          backgroundColor: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1.75rem',
          fontSize: '0.85rem'
        }}>
          <div>
            <span style={{ color: '#64748B' }}>Peneliti / Mahasiswa:</span>
            <strong style={{ display: 'block', color: '#0F172A' }}>Nur Virgi Arfiyanti (235059048)</strong>
          </div>
          <div>
            <span style={{ color: '#64748B' }}>Lokasi / Unit Kerja:</span>
            <strong style={{ display: 'block', color: '#0F172A' }}>Server Room PT. Sinar Powerindo Utama</strong>
          </div>
          <div>
            <span style={{ color: '#64748B' }}>Tanggal Laporan:</span>
            <strong style={{ display: 'block', color: '#0F172A' }}>
              {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
            </strong>
          </div>
        </div>

        {/* SUMMARY KPI CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.75rem' }}>
          <div style={{ border: '1px solid #CBD5E1', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>TOTAL SAMPEL RESPONDEN</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>{totalCount} Teknisi</div>
          </div>

          <div style={{ border: '1px solid #CBD5E1', borderRadius: '8px', padding: '1rem', textAlign: 'center', backgroundColor: '#ECFDF5' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065F46' }}>PENGETAHUAN ERGONOMI (0-20)</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
              Pre: {avgPreK} → Post: {avgPostK}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 700 }}>
              ▲ Peningkatan: +{(parseFloat(avgPostK) - parseFloat(avgPreK)).toFixed(2)} Poin
            </div>
          </div>

          <div style={{ border: '1px solid #CBD5E1', borderRadius: '8px', padding: '1rem', textAlign: 'center', backgroundColor: '#ECFDF5' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065F46' }}>SIKAP PENCEGAHAN MSDS (10-40)</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
              Pre: {avgPreA} → Post: {avgPostA}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 700 }}>
              ▲ Perubahan Positif: +{(parseFloat(avgPostA) - parseFloat(avgPreA)).toFixed(2)} Poin
            </div>
          </div>
        </div>

        {/* RESPONDENT DATA TABLE */}
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem' }}>
          Tabel Distribusi Data Skor Responden (Pengukuran Pre-Test & Post-Test)
        </h3>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', marginBottom: '2rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#0F172A', color: '#FFFFFF' }}>
              <th style={{ padding: '0.6rem 0.5rem', border: '1px solid #334155' }}>No</th>
              <th style={{ padding: '0.6rem 0.75rem', border: '1px solid #334155', textAlign: 'left' }}>Nama Responden</th>
              <th style={{ padding: '0.6rem 0.5rem', border: '1px solid #334155' }}>ID Teknisi</th>
              <th style={{ padding: '0.6rem 0.5rem', border: '1px solid #334155' }}>Usia</th>
              <th style={{ padding: '0.6rem 0.5rem', border: '1px solid #334155' }}>Masa Kerja</th>
              <th style={{ padding: '0.6rem 0.5rem', border: '1px solid #334155' }}>Pre-K</th>
              <th style={{ padding: '0.6rem 0.5rem', border: '1px solid #334155' }}>Post-K</th>
              <th style={{ padding: '0.6rem 0.5rem', border: '1px solid #334155' }}>Pre-S</th>
              <th style={{ padding: '0.6rem 0.5rem', border: '1px solid #334155' }}>Post-S</th>
            </tr>
          </thead>
          <tbody>
            {respondents.map((r, idx) => (
              <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC' }}>
                <td style={{ padding: '0.5rem', border: '1px solid #E2E8F0', textAlign: 'center' }}>{idx + 1}</td>
                <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #E2E8F0', fontWeight: 600, color: '#0F172A' }}>{r.demographics.name}</td>
                <td style={{ padding: '0.5rem', border: '1px solid #E2E8F0', textAlign: 'center' }}>{r.demographics.empId}</td>
                <td style={{ padding: '0.5rem', border: '1px solid #E2E8F0', textAlign: 'center' }}>{r.demographics.ageGroup} thn</td>
                <td style={{ padding: '0.5rem', border: '1px solid #E2E8F0', textAlign: 'center' }}>{r.demographics.workDurationGroup} thn</td>
                <td style={{ padding: '0.5rem', border: '1px solid #E2E8F0', textAlign: 'center' }}>{r.preTest?.knowledgeScore ?? '-'}</td>
                <td style={{ padding: '0.5rem', border: '1px solid #E2E8F0', textAlign: 'center', fontWeight: 700, color: '#059669' }}>{r.postTest?.knowledgeScore ?? '-'}</td>
                <td style={{ padding: '0.5rem', border: '1px solid #E2E8F0', textAlign: 'center' }}>{r.preTest?.attitudeScore ?? '-'}</td>
                <td style={{ padding: '0.5rem', border: '1px solid #E2E8F0', textAlign: 'center', fontWeight: 700, color: '#059669' }}>{r.postTest?.attitudeScore ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* SIGNATURE SECTION */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '3rem', fontSize: '0.85rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div>Mengetahui,</div>
            <div style={{ fontWeight: 700, color: '#0F172A' }}>Pembimbing Skripsi K3 URINDO</div>
            <div style={{ height: '60px' }}></div>
            <div>(___________________________)</div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div>Jakarta, {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div style={{ fontWeight: 700, color: '#0F172A' }}>Peneliti / Mahasiswa</div>
            <div style={{ height: '60px' }}></div>
            <div style={{ fontWeight: 700, textDecoration: 'underline' }}>Nur Virgi Arfiyanti</div>
            <div>NIM: 235059048</div>
          </div>
        </div>

      </div>

      {/* Media Print Specific CSS */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-document, .printable-document * {
            visibility: visible;
          }
          .printable-document {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0 !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
