import React, { useState } from 'react';
import { KNOWLEDGE_QUESTIONS, ATTITUDE_STATEMENTS } from '../data/questions';
import { QuizAnswer, AttitudeAnswer } from '../types';
import { HelpCircle, CheckCircle2, Award, ArrowRight, BookOpen } from 'lucide-react';

interface QuizModuleProps {
  type: 'pretest' | 'posttest';
  respondentName: string;
  onComplete: (knowledgeScore: number, knowledgeAnswers: QuizAnswer[], attitudeScore: number, attitudeAnswers: AttitudeAnswer[]) => void;
}

export const QuizModule: React.FC<QuizModuleProps> = ({ type, respondentName, onComplete }) => {
  const [activePart, setActivePart] = useState<'knowledge' | 'attitude'>('knowledge');
  
  // Knowledge state (20 questions)
  const [knowledgeIndex, setKnowledgeIndex] = useState(0);
  const [knowledgeAnswers, setKnowledgeAnswers] = useState<QuizAnswer[]>([]);
  const [selectedKnowledgeOption, setSelectedKnowledgeOption] = useState<number | null>(null);

  // Attitude state (10 statements)
  const [attitudeAnswers, setAttitudeAnswers] = useState<AttitudeAnswer[]>([]);

  // Current Knowledge Question
  const currentQ = KNOWLEDGE_QUESTIONS[knowledgeIndex];

  // Handle Knowledge Answer Selection
  const handleSelectKnowledge = (optionIdx: number) => {
    setSelectedKnowledgeOption(optionIdx);
  };

  const handleNextKnowledge = () => {
    if (selectedKnowledgeOption === null) return;

    const isCorrect = selectedKnowledgeOption === currentQ.correctAnswer;
    const newAnswers = [...knowledgeAnswers, {
      questionId: currentQ.id,
      selectedOption: selectedKnowledgeOption,
      isCorrect
    }];

    setKnowledgeAnswers(newAnswers);
    setSelectedKnowledgeOption(null);

    if (knowledgeIndex < KNOWLEDGE_QUESTIONS.length - 1) {
      setKnowledgeIndex(knowledgeIndex + 1);
    } else {
      // Transition to Part 2: Attitude Statements
      setActivePart('attitude');
    }
  };

  // Handle Attitude Rating
  const handleRateAttitude = (statementId: number, score: number) => {
    const existing = attitudeAnswers.filter(a => a.statementId !== statementId);
    setAttitudeAnswers([...existing, { statementId, score }]);
  };

  // Final Submit for the Test
  const handleSubmitAll = () => {
    // Knowledge total score (0 to 20)
    const totalKnowledgeScore = knowledgeAnswers.filter(a => a.isCorrect).length;

    // Attitude total score (10 to 40)
    const totalAttitudeScore = attitudeAnswers.reduce((sum, a) => sum + a.score, 0);

    onComplete(totalKnowledgeScore, knowledgeAnswers, totalAttitudeScore, attitudeAnswers);
  };

  return (
    <div className="animate-fade" style={{ maxWidth: '850px', margin: '2rem auto', padding: '0 1rem' }}>
      {/* Header Info */}
      <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '5px solid #059669' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="badge-safety" style={{ marginBottom: '0.4rem' }}>
              {type === 'pretest' ? 'TAHAP 2: EVALUASI AWAL (PRE-TEST)' : 'TAHAP 4: EVALUASI AKHIR (POST-TEST)'}
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A' }}>
              {type === 'pretest' ? 'Kuesioner Pre-Test K3 Ergonomi' : 'Kuesioner Post-Test Evaluasi Ergonomi'}
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#64748B' }}>
              Responden: <strong style={{ color: '#0F172A' }}>{respondentName}</strong> — 
              {activePart === 'knowledge' ? ' Bagian 1: 20 Soal Pengetahuan' : ' Bagian 2: 10 Statement Sikap'}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B' }}>Progres Evaluasi</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669' }}>
              {activePart === 'knowledge' 
                ? `${knowledgeIndex + 1} / 20 Soal` 
                : `${attitudeAnswers.length} / 10 Pernyataan`}
            </div>
          </div>
        </div>
      </div>

      {/* PART 1: KNOWLEDGE QUESTIONS (20 SOAL) */}
      {activePart === 'knowledge' && (
        <div className="card">
          {/* Question Counter Progress Bar */}
          <div style={{ width: '100%', height: '6px', backgroundColor: '#E2E8F0', borderRadius: '4px', marginBottom: '1.5rem', overflow: 'hidden' }}>
            <div style={{
              width: `${((knowledgeIndex + 1) / KNOWLEDGE_QUESTIONS.length) * 100}%`,
              height: '100%',
              backgroundColor: '#059669',
              transition: 'width 0.3s ease'
            }}></div>
          </div>

          {/* Question Text */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <span style={{
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                fontWeight: 800,
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
                flexShrink: 0
              }}>
                {knowledgeIndex + 1}
              </span>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.4 }}>
                {currentQ.text}
              </h3>
            </div>
          </div>

          {/* Options Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedKnowledgeOption === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectKnowledge(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    textAlign: 'left',
                    padding: '1rem 1.25rem',
                    borderRadius: '10px',
                    border: isSelected ? '2px solid #059669' : '1px solid #E2E8F0',
                    backgroundColor: isSelected ? '#ECFDF5' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: isSelected ? '6px solid #059669' : '2px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    flexShrink: 0
                  }}></span>
                  <span style={{ fontSize: '0.95rem', color: isSelected ? '#065F46' : '#334155', fontWeight: isSelected ? 600 : 400 }}>
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Next Action */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleNextKnowledge}
              disabled={selectedKnowledgeOption === null}
              className="btn-primary"
              style={{
                opacity: selectedKnowledgeOption === null ? 0.5 : 1,
                cursor: selectedKnowledgeOption === null ? 'not-allowed' : 'pointer'
              }}
            >
              <span>{knowledgeIndex === KNOWLEDGE_QUESTIONS.length - 1 ? 'Lanjut ke Kuesioner Sikap' : 'Soal Berikutnya'}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* PART 2: ATTITUDE STATEMENTS (10 PERNYATAAN LIKERT 1-4) */}
      {activePart === 'attitude' && (
        <div className="card">
          <div style={{
            backgroundColor: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            color: '#166534'
          }}>
            📋 <strong>Petunjuk Bagian 2 (Skala Likert Sikap Ergonomi):</strong><br />
            Pilihlah tingkat persetujuan Anda untuk setiap pernyataan di bawah ini:<br />
            <strong>1</strong> = Sangat Tidak Setuju (STS) | <strong>2</strong> = Tidak Setuju (TS) | <strong>3</strong> = Setuju (S) | <strong>4</strong> = Sangat Setuju (SS)
          </div>

          {/* Statements List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            {ATTITUDE_STATEMENTS.map((st, idx) => {
              const selectedVal = attitudeAnswers.find(a => a.statementId === st.id)?.score;

              return (
                <div key={st.id} style={{
                  padding: '1.25rem',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  backgroundColor: selectedVal ? '#F8FAFC' : '#FFFFFF'
                }}>
                  <p style={{ fontSize: '0.975rem', fontWeight: 600, color: '#0F172A', marginBottom: '1rem' }}>
                    {idx + 1}. {st.text}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                    {[
                      { val: 1, label: 'STS (1)' },
                      { val: 2, label: 'TS (2)' },
                      { val: 3, label: 'S (3)' },
                      { val: 4, label: 'SS (4)' }
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => handleRateAttitude(st.id, opt.val)}
                        style={{
                          padding: '0.65rem 0.5rem',
                          borderRadius: '6px',
                          border: selectedVal === opt.val ? '2px solid #059669' : '1px solid #CBD5E1',
                          backgroundColor: selectedVal === opt.val ? '#059669' : '#FFFFFF',
                          color: selectedVal === opt.val ? '#FFFFFF' : '#334155',
                          fontWeight: selectedVal === opt.val ? 700 : 500,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit Test Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleSubmitAll}
              disabled={attitudeAnswers.length < 10}
              className="btn-primary"
              style={{
                opacity: attitudeAnswers.length < 10 ? 0.5 : 1,
                cursor: attitudeAnswers.length < 10 ? 'not-allowed' : 'pointer',
                padding: '1rem 2rem',
                fontSize: '1.05rem'
              }}
            >
              <span>{type === 'pretest' ? 'Simpan Pre-Test & Buka Modul K3' : 'Selesaikan Post-Test & Lihat Hasil'}</span>
              <CheckCircle2 size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
