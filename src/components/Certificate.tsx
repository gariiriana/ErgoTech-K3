import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RespondentData } from '../types';
import { Award, CheckCircle2, TrendingUp, ShieldCheck, Download, RefreshCw, Server } from 'lucide-react';

interface CertificateProps {
  respondent: RespondentData;
  onRestart: () => void;
}

export const Certificate: React.FC<CertificateProps> = ({ respondent, onRestart }) => {
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

  return (
    <div className="animate-fade" style={{ maxWidth: '850px', margin: '2rem auto', padding: '0 1rem' }}>
      {/* Celebration Header */}
      <div className="card" style={{ textAlign: 'center', backgroundColor: '#0F172A', color: '#FFFFFF', marginBottom: '1.75rem', borderColor: '#1E293B' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: '#059669',
          color: '#FFFFFF',
          marginBottom: '1rem'
        }}>
          <Award size={36} />
        </div>

        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.4rem' }}>
          Selamat! Evaluasi K3 Ergonomi Anda Selesai! 🎉
        </h2>
        <p style={{ fontSize: '0.95rem', color: '#94A3B8', maxWidth: '600px', margin: '0 auto' }}>
          Terima kasih <strong>{respondent.demographics.name}</strong> telah menyelesaikan seluruh tahapan edukasi & evaluasi K3 di platform <strong>ErgoTech K3</strong>.
        </p>
      </div>

      {/* Score Improvement Comparison Card */}
      <div className="card" style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <TrendingUp color="#059669" size={24} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>
            Hasil Rekapitulasi Peningkatan Skor (Pre vs Post)
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
          {/* Knowledge Score Card */}
          <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '1.25rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
              Pengetahuan Ergonomi (0 - 20)
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginTop: '0.5rem' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: '#64748B' }}>Pre-Test: </span>
                <strong style={{ fontSize: '1.25rem', color: '#334155' }}>{preK}</strong>
              </div>
              <div style={{ fontSize: '1.25rem', color: '#CBD5E1' }}>→</div>
              <div>
                <span style={{ fontSize: '0.85rem', color: '#059669' }}>Post-Test: </span>
                <strong style={{ fontSize: '1.65rem', color: '#059669' }}>{postK}</strong>
              </div>
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: kDiff >= 0 ? '#059669' : '#DC2626' }}>
              {kDiff >= 0 ? `▲ Peningkatan Skor: +${kDiff} Poin` : `▼ Perubahan Skor: ${kDiff} Poin`}
            </div>
          </div>

          {/* Attitude Score Card */}
          <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '1.25rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
              Sikap Pencegahan MSDs (10 - 40)
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginTop: '0.5rem' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: '#64748B' }}>Pre-Test: </span>
                <strong style={{ fontSize: '1.25rem', color: '#334155' }}>{preA}</strong>
              </div>
              <div style={{ fontSize: '1.25rem', color: '#CBD5E1' }}>→</div>
              <div>
                <span style={{ fontSize: '0.85rem', color: '#059669' }}>Post-Test: </span>
                <strong style={{ fontSize: '1.65rem', color: '#059669' }}>{postA}</strong>
              </div>
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: aDiff >= 0 ? '#059669' : '#DC2626' }}>
              {aDiff >= 0 ? `▲ Perubahan Positif: +${aDiff} Poin` : `▼ Perubahan Sikap: ${aDiff} Poin`}
            </div>
          </div>
        </div>
      </div>

      {/* Formal Digital Certificate Container */}
      <div id="digital-certificate" className="card" style={{
        border: '4px double #059669',
        backgroundColor: '#FFFFFF',
        padding: '2.5rem',
        textAlign: 'center',
        position: 'relative',
        marginBottom: '2rem'
      }}>
        {/* Certificate Watermark Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <img src="/logo-powerindo.png" alt="PT Sinar Powerindo Utama" style={{ height: '48px' }} />
        </div>

        <h4 style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '2px', color: '#059669', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
          SERTIFIKAT KOMPETENSI ERGONOMI K3
        </h4>
        <p style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '1.5rem' }}>
          No. Reg: SKR-URINDO/{respondent.demographics.empId}/2026
        </p>

        <p style={{ fontSize: '0.9rem', color: '#334155', marginBottom: '0.5rem' }}>
          Diberikan kepada Teknisi Manual Handling:
        </p>

        <h3 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', textDecoration: 'underline', marginBottom: '1rem' }}>
          {respondent.demographics.name}
        </h3>

        <p style={{ fontSize: '0.9rem', color: '#475569', maxWidth: '600px', margin: '0 auto 1.5rem auto', lineHeight: 1.6 }}>
          Telah berhasil menyelesaikan Program Edukasi & Evaluasi <strong>ErgoTech K3</strong> mengenai Teknik <i>Manual Handling Safe Lifting</i>, Pencegahan <i>Low Back Pain</i>, dan <i>Micro-Break Stretching</i> di PT. Sinar Powerindo Utama.
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid #E2E8F0', paddingTop: '1.5rem', fontSize: '0.8rem', color: '#64748B' }}>
          <div>
            <div>Peneliti / Mahasiswa SKM</div>
            <strong style={{ display: 'block', marginTop: '1.5rem', color: '#0F172A' }}>Nur Virgi Arfiyanti</strong>
            <div>NIM: 235059048</div>
          </div>
          <div>
            <div>Lokasi Penelitian</div>
            <strong style={{ display: 'block', marginTop: '1.5rem', color: '#0F172A' }}>PT. Sinar Powerindo Utama</strong>
            <div>Server Room Unit</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <button onClick={onRestart} className="btn-secondary">
          <RefreshCw size={18} />
          <span>Isi Responden Baru</span>
        </button>
      </div>
    </div>
  );
};
