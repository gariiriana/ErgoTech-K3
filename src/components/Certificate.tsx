import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { RespondentData } from '../types';
import { Award, CheckCircle2, TrendingUp, ShieldCheck, Download, RefreshCw, Server, Loader2 } from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { POWERINDO_LOGO_BASE64, URINDO_LOGO_BASE64 } from '../utils/logoBase64';

interface CertificateProps {
  respondent: RespondentData;
  onRestart: () => void;
}

export const Certificate: React.FC<CertificateProps> = ({ respondent, onRestart }) => {
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    // Trigger confetti celebration
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const preK = respondent.preTest?.knowledgeScore || 0;
  const postK = respondent.postTest?.knowledgeScore || 0;
  const kDiff = postK - preK;

  const preA = respondent.preTest?.attitudeScore || 0;
  const postA = respondent.postTest?.attitudeScore || 0;
  const aDiff = postA - preA;

  // Direct PDF Download Handler (No Print Popup Dialog)
  const handleExportPDF = async () => {
    const element = document.getElementById('digital-certificate');
    if (!element) return;

    setDownloading(true);

    try {
      const cleanName = respondent.demographics.name.trim().replace(/\s+/g, '_');
      const opt = {
        margin:       [0.5, 0.4, 0.5, 0.4] as [number, number, number, number],
        filename:     `Sertifikat_Ergonomi_K3_${cleanName}.pdf`,
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, allowTaint: true, logging: false },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' as const }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("Error generating PDF:", err);
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="animate-fade" style={{ maxWidth: '850px', margin: '1rem auto', padding: '0 0.75rem' }}>
      {/* Celebration Header - Clean Light Emerald (No Dark Background) */}
      <div className="card" style={{
        textAlign: 'center',
        backgroundColor: '#ECFDF5',
        border: '1px solid #A7F3D0',
        color: '#065F46',
        marginBottom: '1rem',
        padding: '1.1rem 0.85rem'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          backgroundColor: '#059669',
          color: '#FFFFFF',
          marginBottom: '0.4rem'
        }}>
          <Award size={24} />
        </div>

        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#065F46', marginBottom: '0.2rem' }}>
          Selamat! Evaluasi K3 Ergonomi Anda Selesai! 🎉
        </h2>
        <p style={{ fontSize: '0.8rem', color: '#047857', maxWidth: '550px', margin: '0 auto', lineHeight: 1.4 }}>
          Terima kasih <strong>{respondent.demographics.name}</strong> telah menyelesaikan seluruh tahapan edukasi & evaluasi K3 di platform <strong>ErgoTech K3</strong>.
        </p>
      </div>

      {/* Score Improvement Comparison Card - Compact Grid */}
      <div className="card" style={{ marginBottom: '1rem', padding: '0.85rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
          <TrendingUp color="#059669" size={18} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
            Hasil Rekapitulasi Peningkatan Skor (Pre vs Post)
          </h3>
        </div>

        <div className="form-grid-2col" style={{ display: 'grid', gap: '0.65rem' }}>
          {/* Knowledge Score Card */}
          <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.75rem 0.85rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
              Pengetahuan Ergonomi (0 - 20)
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.65rem', marginTop: '0.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Pre: </span>
                <strong style={{ fontSize: '1.05rem', color: '#334155' }}>{preK}</strong>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#CBD5E1' }}>→</div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#059669' }}>Post: </span>
                <strong style={{ fontSize: '1.25rem', color: '#059669' }}>{postK}</strong>
              </div>
            </div>
            <div style={{ marginTop: '0.25rem', fontSize: '0.75rem', fontWeight: 700, color: kDiff >= 0 ? '#059669' : '#DC2626' }}>
              {kDiff >= 0 ? `▲ Peningkatan: +${kDiff} Poin` : `▼ Perubahan: ${kDiff} Poin`}
            </div>
          </div>

          {/* Attitude Score Card */}
          <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.75rem 0.85rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
              Sikap Ergonomi (10 - 40)
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.65rem', marginTop: '0.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Pre: </span>
                <strong style={{ fontSize: '1.05rem', color: '#334155' }}>{preA}</strong>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#CBD5E1' }}>→</div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#059669' }}>Post: </span>
                <strong style={{ fontSize: '1.25rem', color: '#059669' }}>{postA}</strong>
              </div>
            </div>
            <div style={{ marginTop: '0.25rem', fontSize: '0.75rem', fontWeight: 700, color: aDiff >= 0 ? '#059669' : '#DC2626' }}>
              {aDiff >= 0 ? `▲ Peningkatan: +${aDiff} Poin` : `▼ Perubahan: ${aDiff} Poin`}
            </div>
          </div>
        </div>
      </div>

      {/* Formal Digital Certificate Container */}
      <div id="digital-certificate" className="card" style={{
        border: '4px double #059669',
        backgroundColor: '#FFFFFF',
        padding: '1.75rem 1.25rem',
        textAlign: 'center',
        position: 'relative',
        marginBottom: '1.25rem'
      }}>
        {/* Certificate Dual Logo Header (Data URI Base64 Encoded for 100% Fail-proof PDF Export) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '0 0.5rem' }}>
          <img src={`data:image/png;base64,${POWERINDO_LOGO_BASE64}`} alt="PT Sinar Powerindo Utama" style={{ height: '46px', objectFit: 'contain' }} />
          <img src={`data:image/png;base64,${URINDO_LOGO_BASE64}`} alt="Universitas Respati Indonesia" style={{ height: '46px', objectFit: 'contain' }} />
        </div>

        <h4 style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '2px', color: '#059669', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
          SERTIFIKAT KOMPETENSI ERGONOMI K3
        </h4>
        <p style={{ fontSize: '0.725rem', color: '#64748B', marginBottom: '1.1rem' }}>
          No. Reg: SKR-URINDO/{respondent.demographics.empId}/2026
        </p>

        <p style={{ fontSize: '0.825rem', color: '#334155', marginBottom: '0.35rem' }}>
          Diberikan kepada Teknisi Manual Handling:
        </p>

        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', textDecoration: 'underline', marginBottom: '0.85rem' }}>
          {respondent.demographics.name}
        </h3>

        <p style={{ fontSize: '0.825rem', color: '#475569', maxWidth: '580px', margin: '0 auto 1.25rem auto', lineHeight: 1.5 }}>
          Telah berhasil menyelesaikan Program Edukasi & Evaluasi <strong>ErgoTech K3</strong> mengenai Teknik <i>Manual Handling Safe Lifting</i>, Pencegahan <i>Low Back Pain</i>, dan <i>SOP K3 Manual Handling</i> di PT. Sinar Powerindo Utama.
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid #E2E8F0', paddingTop: '1.1rem', fontSize: '0.75rem', color: '#64748B' }}>
          <div>
            <p style={{ margin: 0 }}>Tanggal Lulus:</p>
            <strong style={{ color: '#0F172A' }}>
              {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
            </strong>
          </div>

          <div>
            <p style={{ margin: 0 }}>Status Verifikasi:</p>
            <strong style={{ color: '#059669' }}>Lulus (Tuntas Post-Test)</strong>
          </div>

          <div>
            <p style={{ margin: 0 }}>Penyelenggara Riset:</p>
            <strong style={{ color: '#0F172A' }}>Skripsi K3 URINDO & PTU</strong>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={handleExportPDF}
          disabled={downloading}
          className="btn-primary"
          style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
        >
          {downloading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Memproses File PDF...</span>
            </>
          ) : (
            <>
              <Download size={18} />
              <span>Unduh Sertifikat PDF</span>
            </>
          )}
        </button>

        <button
          onClick={onRestart}
          className="btn-secondary"
          style={{ padding: '0.75rem 1.25rem', fontSize: '0.9rem' }}
        >
          <RefreshCw size={18} />
          <span>Kembali ke Halaman Awal</span>
        </button>
      </div>
    </div>
  );
};
