import React, { useState } from 'react';
import { RespondentDemographics } from '../types';
import { ChevronRight, FileText } from 'lucide-react';

interface DemographicsFormProps {
  onSubmit: (demographics: RespondentDemographics) => void;
}

export const DemographicsForm: React.FC<DemographicsFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [gender, setGender] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [age, setAge] = useState<number | ''>(25);
  const [workDuration, setWorkDuration] = useState<number | ''>(2);
  const [consented, setConsented] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Mohon isi nama lengkap atau inisial Anda.');
      return;
    }
    if (age === '' || Number(age) <= 0 || Number(age) > 80) {
      setError('Mohon isi usia yang valid (misal: 25).');
      return;
    }
    if (workDuration === '' || Number(workDuration) < 0) {
      setError('Mohon isi masa kerja yang valid dalam tahun (misal: 2).');
      return;
    }
    if (!consented) {
      setError('Anda harus menyetujui Lembar Informed Consent etika penelitian.');
      return;
    }
    setError('');

    const numericAge = Number(age);
    const numericWork = Number(workDuration);

    const ageGroup: '<30' | '>=30' = numericAge < 30 ? '<30' : '>=30';
    const workDurationGroup: '<3' | '>=3' = numericWork < 3 ? '<3' : '>=3';

    onSubmit({
      name: name.trim(),
      empId: position.trim() || 'Teknisi Data Center Server Room',
      gender,
      age: numericAge,
      ageGroup,
      workDuration: numericWork,
      workDurationGroup,
      consented
    });
  };

  return (
    <div className="animate-fade" style={{ maxWidth: '680px', margin: '2rem auto', padding: '0 1rem' }}>
      {/* Clean Single Corporate Card */}
      <div className="card">
        {/* Header Header */}
        <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #FED7AA', paddingBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#EA580C', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.25rem' }}>
            PT. SINAR POWERINDO UTAMA — DATA CENTER SERVER ROOM
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.3, marginBottom: '0.5rem' }}>
            Formulir Edukasi & Evaluasi Ergonomi K3
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6 }}>
            Dalam rangka pencegahan risiko cedera otot pinggang (<i>Musculoskeletal Disorders</i>) saat pengangkatan <i>server cabinet</i>, mohon lengkapi data identitas diri dan ikuti kuesioner evaluasi singkat ini (estimasi waktu 3-5 menit).
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
            fontSize: '0.85rem'
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Responsive Form Grid */}
          <div className="form-grid-2col">
            {/* Nama Lengkap */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Nama Lengkap / Inisial Teknisi <span style={{ color: '#EA580C' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Nur Virgi / Teknisi 01"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: '6px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.9rem',
                  outline: 'none',
                  backgroundColor: '#FFFFFF'
                }}
              />
            </div>

            {/* Jabatan / Posisi Kerja */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Jabatan / Posisi Kerja (Opsional)
              </label>
              <input
                type="text"
                placeholder="Contoh: Teknisi Data Center / Maintenance"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: '6px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.9rem',
                  outline: 'none',
                  backgroundColor: '#FFFFFF'
                }}
              />
            </div>

            {/* Jenis Kelamin (Gender) */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Jenis Kelamin <span style={{ color: '#EA580C' }}>*</span>
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'Laki-laki' | 'Perempuan')}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: '6px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.9rem',
                  outline: 'none',
                  backgroundColor: '#FFFFFF'
                }}
              >
                <option value="Laki-laki">Laki-laki (Pria)</option>
                <option value="Perempuan">Perempuan (Wanita)</option>
              </select>
            </div>

            {/* Manual Usia (Numeric Input) */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Usia (Tahun) <span style={{ color: '#EA580C' }}>*</span>
              </label>
              <input
                type="number"
                min="17"
                max="75"
                placeholder="Contoh: 25"
                value={age}
                onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: '6px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.9rem',
                  outline: 'none',
                  backgroundColor: '#FFFFFF'
                }}
              />
            </div>

            {/* Manual Masa Kerja (Numeric Input) */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Masa Kerja (Tahun) <span style={{ color: '#EA580C' }}>*</span>
              </label>
              <input
                type="number"
                min="0"
                max="50"
                placeholder="Contoh: 2"
                value={workDuration}
                onChange={(e) => setWorkDuration(e.target.value === '' ? '' : Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: '6px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.9rem',
                  outline: 'none',
                  backgroundColor: '#FFFFFF'
                }}
              />
            </div>
          </div>

          {/* Informed Consent Accordion */}
          <div style={{
            backgroundColor: '#FFF7ED',
            border: '1px solid #FED7AA',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <FileText size={18} color="#EA580C" />
              <strong style={{ fontSize: '0.875rem', color: '#0F172A' }}>Lembar Persetujuan Responden (Informed Consent)</strong>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              Saya bersedia secara sukarela menjadi responden riset Skripsi K3 Program Studi Sarjana Kesehatan Masyarakat URINDO yang dilakukan oleh Peneliti Nur Virgi Arfiyanti (235059048). Data yang saya berikan dijamin kerahasiaannya dan hanya dipergunakan untuk kepentingan ilmiah.
            </p>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={consented}
                onChange={(e) => setConsented(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#EA580C', cursor: 'pointer' }}
              />
              <span>Saya Setuju dan Bersedia Menjadi Responden Riset K3</span>
            </label>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
          >
            <span>Simpan Identitas & Lanjut ke Pre-Test (10 Soal)</span>
            <ChevronRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
