import React, { useState } from 'react';
import { QuizAnswer, AttitudeAnswer } from '../types';
import { PRETEST_STATEMENTS, POSTTEST_STATEMENTS, LIKERT_OPTIONS, getLikertScore } from '../data/questions';
import { ShieldCheck } from 'lucide-react';

interface QuizModuleProps {
  type: 'pretest' | 'posttest';
  respondentName: string;
  onComplete: (
    knowledgeScore: number,
    knowledgeAnswers: QuizAnswer[],
    attitudeScore: number,
    attitudeAnswers: AttitudeAnswer[]
  ) => void;
}

export const QuizModule: React.FC<QuizModuleProps> = ({ type, respondentName, onComplete }) => {
  // Select statements based on test type (Pre-Test vs Post-Test derived directly from modules)
  const statementsList = type === 'pretest' ? PRETEST_STATEMENTS : POSTTEST_STATEMENTS;

  // Store selected option index (0 = Sangat Setuju, 1 = Setuju, 2 = Tidak Setuju, 3 = Sangat Tidak Setuju)
  const [answersMap, setAnswersMap] = useState<Record<number, number>>({});

  const handleSelectOption = (id: number, optionIdx: number) => {
    setAnswersMap(prev => ({ ...prev, [id]: optionIdx }));
  };

  const isAllFilled = statementsList.every(st => answersMap[st.id] !== undefined);
  const filledCount = Object.keys(answersMap).length;

  const handleFinishTest = () => {
    const answersList: QuizAnswer[] = statementsList.map(st => {
      const optIdx = answersMap[st.id] ?? 0;
      const score = getLikertScore(st.type, optIdx);
      return {
        questionId: st.id,
        selectedAnswer: score,
        isCorrect: true
      };
    });

    const totalScore = statementsList.reduce((sum, st) => {
      const optIdx = answersMap[st.id] ?? 0;
      return sum + getLikertScore(st.type, optIdx);
    }, 0);

    const attitudeAnswersList: AttitudeAnswer[] = statementsList.map(st => ({
      questionId: st.id,
      selectedScore: getLikertScore(st.type, answersMap[st.id] ?? 0)
    }));

    onComplete(totalScore, answersList, totalScore, attitudeAnswersList);
  };

  return (
    <div className="animate-fade" style={{ maxWidth: '850px', margin: '1.25rem auto', padding: '0 0.85rem' }}>
      {/* Header Info Banner */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div className="badge-safety" style={{ marginBottom: '0.25rem' }}>
          TAHAP {type === 'pretest' ? 'PRE-TEST (10 PERNYATAAN EVALUASI AWAL)' : 'POST-TEST (10 PERNYATAAN EVALUASI MODUL K3)'}
        </div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
          Kuesioner Evaluasi Ergonomi K3 Data Center PT. Sinar Powerindo Utama
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '2px' }}>
          Responden: <strong style={{ color: '#0F172A' }}>{respondentName}</strong> | Sifat Kuesioner: Rahasia & Khusus Evaluasi Skripsi
        </p>
      </div>

      {/* Statements List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
        {statementsList.map((st) => {
          const selectedIdx = answersMap[st.id];

          return (
            <div key={st.id} className="card" style={{ padding: '1.1rem 1.25rem', borderLeft: selectedIdx !== undefined ? '4px solid #EA580C' : '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.5, marginBottom: '0.85rem' }}>
                {st.statement}
              </div>

              {/* 4 Likert Option Buttons */}
              <div className="likert-grid-4col" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                {LIKERT_OPTIONS.map((opt, optIdx) => {
                  const isSelected = selectedIdx === optIdx;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(st.id, optIdx)}
                      style={{
                        padding: '0.65rem 0.5rem',
                        fontSize: '0.8rem',
                        fontWeight: isSelected ? 700 : 500,
                        borderRadius: '6px',
                        border: isSelected ? '2px solid #EA580C' : '1.5px solid #CBD5E1',
                        backgroundColor: isSelected ? '#FFF7ED' : '#FFFFFF',
                        color: isSelected ? '#C2410C' : '#334155',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected ? '0 1px 3px rgba(234, 88, 12, 0.2)' : 'none'
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Bar / Sticky Submit */}
      <div style={{
        position: 'sticky',
        bottom: '1.25rem',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        padding: '0.85rem 1.25rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem',
        zIndex: 50
      }}>
        <div style={{ fontSize: '0.825rem', color: '#475569' }}>
          Progress: <strong style={{ color: filledCount === 10 ? '#059669' : '#EA580C' }}>{filledCount} dari 10 Pernyataan Terisi</strong>
        </div>

        <button
          type="button"
          onClick={handleFinishTest}
          disabled={!isAllFilled}
          className="btn-primary"
          style={{
            opacity: isAllFilled ? 1 : 0.5,
            cursor: isAllFilled ? 'pointer' : 'not-allowed',
            padding: '0.65rem 1.5rem',
            fontSize: '0.85rem'
          }}
        >
          <ShieldCheck size={18} />
          <span>{type === 'pretest' ? 'Simpan Pre-Test & Lanjut ke Modul Edukasi' : 'Simpan Post-Test & Terbitkan Sertifikat'}</span>
        </button>
      </div>
    </div>
  );
};
