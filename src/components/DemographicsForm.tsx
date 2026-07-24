import React, { useState } from 'react';
import { RespondentDemographics } from '../types';
import { ShieldCheck, UserCheck, ChevronRight, FileText, Server } from 'lucide-react';

interface DemographicsFormProps {
  onSubmit: (demographics: RespondentDemographics) => void;
}

export const DemographicsForm: React.FC<DemographicsFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [empId, setEmpId] = useState('');
  const [ageGroup, setAgeGroup] = useState<'<30' | '>=30'>('<30');
  const [workDurationGroup, setWorkDurationGroup] = useState<'<3' | '>=3'>('<3');
  const [consented, setConsented] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Mohon isi nama lengkap / ID teknisi Anda.');
      return;
    }
    if (!consented) {
      setError('Anda harus menyetujui Lembar Informed Consent etika penelitian.');
      return;
    }
    setError('');
    onSubmit({
      name: name.trim(),
      empId: empId.trim() || 'TEK-' + Math.floor(1000 + Math.random() * 9000),
      ageGroup,
      workDurationGroup,
      consented
    });
  };

  return (
    <div className="animate-fade" style={{ maxWidth: '780px', margin: '2rem auto', padding: '0 1rem' }}>
      {/* Intro Hero Box */}
      <div className="card" style={{
        marginBottom: '1.75rem',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF7ED 100%)',
        border: '1.5px solid #FDBA74'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <span className="badge-safety">
            <Server size={14} /> K3 Data Center PT. Sinar Powerindo Utama
          </span>
          <span className="badge-amber">Riset Skripsi URINDO</span>
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', lineHeight: 1.3, color: '#0F172A' }}>
          Selamat Datang di Platform <span style={{
            background: 'linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>ErgoTech K3</span>
        </h2>
        <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.6 }}>
          Platform interaktif promosi K3 & edukasi manual handling pengangkatan <i>server cabinet</i> (15-30 kg) untuk pencegahan bahaya <i>Musculoskeletal Disorders</i> (MSDs).
        </p>
      </div>

      {/* Main Registration & Informed Consent Card */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #FED7AA', paddingBottom: '1rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <UserCheck size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
              Identitas Responden & Persetujuan Penelitian
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
              Silakan lengkapi data diri Anda secara jujur untuk keperluan analisis statistik.
            </p>
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#FEF2F2',
            borderLeft: '4px solid #EF4444',
            color: '#991B1B',
            padding: '0.85rem 1rem',
            borderRadius: '6px',
            marginBottom: '1.25rem',
            fontSize: '0.875rem'
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Form Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
            {/* Nama Lengkap */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                Nama Lengkap / Inisial Teknisi <span style={{ color: '#EA580C' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Nur Virgi / Teknisi 01"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1.5px solid #FDBA74',
                  fontSize: '0.95rem',
                  outline: 'none',
                  backgroundColor: '#FFFFFF'
                }}
              />
            </div>

            {/* ID Teknisi */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                ID / NIM Teknisi (Opsional)
              </label>
              <input
                type="text"
                placeholder="Contoh: TEK-2026"
                value={empId}
                onChange={(e) => setEmpId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.95rem',
                  outline: 'none',
                  backgroundColor: '#FFFFFF'
                }}
              />
            </div>

            {/* Kategori Usia */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                Kategori Usia <span style={{ color: '#EA580C' }}>*</span>
              </label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value as '<30' | '>=30')}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1.5px solid #FDBA74',
                  fontSize: '0.95rem',
                  outline: 'none',
                  backgroundColor: '#FFFFFF'
                }}
              >
                <option value="<30">&lt; 30 Tahun (Usia Muda / Produktif)</option>
                <option value=">=30">&ge; 30 Tahun</option>
              </select>
            </div>

            {/* Masa Kerja */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                Masa Kerja Operasional Server Room <span style={{ color: '#EA580C' }}>*</span>
              </label>
              <select
                value={workDurationGroup}
                onChange={(e) => setWorkDurationGroup(e.target.value as '<3' | '>=3')}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1.5px solid #FDBA74',
                  fontSize: '0.95rem',
                  outline: 'none',
                  backgroundColor: '#FFFFFF'
                }}
              >
                <option value="<3">&lt; 3 Tahun</option>
                <option value=">=3">&ge; 3 Tahun (Senior / Berpengalaman)</option>
              </select>
            </div>
          </div>

          {/* Informed Consent Box */}
          <div style={{
            backgroundColor: '#FFF7ED',
            border: '1.5px solid #FDBA74',
            borderRadius: '10px',
            padding: '1.25rem',
            marginBottom: '1.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#0F172A', fontWeight: 800, fontSize: '0.95rem' }}>
              <FileText size={18} color="#EA580C" />
              <span>Lembar Informed Consent (Etika Penelitian LPPM URINDO)</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '0.85rem' }}>
              "Saya menyatakan bersedia berpartisipasi secara sukarela dalam penelitian evaluasi edukasi ergonomi berbasis website ini. Data jawaban saya bersifat anonim dan hanya digunakan untuk keperluan riset ilmiah K3 Universitas Respati Indonesia."
            </p>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={consented}
                onChange={(e) => setConsented(e.target.checked)}
                style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: '#EA580C' }}
              />
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>
                Saya memahami & menyetujui Lembar Persetujuan Responden (Informed Consent).
              </span>
            </label>
          </div>

          {/* Submit Action Button */}
          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}>
            <span>Lanjut ke Tahap Pre-Test (Evaluasi Awal)</span>
            <ChevronRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};
