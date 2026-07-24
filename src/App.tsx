import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { LogOut, AlertTriangle, X } from 'lucide-react';
import { RespondentDemographics, RespondentData, QuizAnswer, AttitudeAnswer } from './types';
import { encodeBase64 } from './utils/base64Helper';
import { Navbar } from './components/Navbar';
import { DemographicsForm } from './components/DemographicsForm';
import { QuizModule } from './components/QuizModule';
import { EducationalModules } from './components/EducationalModules';
import { Certificate } from './components/Certificate';
import { AdminDashboard } from './components/AdminDashboard';

export const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'demographics' | 'pretest' | 'modules' | 'posttest' | 'certificate' | 'admin'>('demographics');
  const [respondent, setRespondent] = useState<RespondentData | null>(null);

  // Admin Auth & Logout Modal State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Auto Scroll to Top on Step Transition
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAdminAuthenticated(true);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAdminLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
    setIsAdminAuthenticated(false);
    setShowLogoutConfirm(false);
  };

  const triggerLogoutConfirm = () => {
    setShowLogoutConfirm(true);
  };

  // 1. Handle Demographics Registration (In-Memory Only, No Firestore Save)
  const handleDemographicsSubmit = (demographics: RespondentDemographics) => {
    const newRespondent: RespondentData = {
      demographics,
      completedModules: [],
      currentStep: 'pretest',
      createdAt: new Date().toISOString()
    };

    setRespondent(newRespondent);
    setCurrentStep('pretest');
  };

  // 2. Handle Pre-Test Complete (In-Memory Only, No Firestore Save)
  const handlePreTestComplete = (
    knowledgeScore: number,
    knowledgeAnswers: QuizAnswer[],
    attitudeScore: number,
    attitudeAnswers: AttitudeAnswer[]
  ) => {
    if (!respondent) return;

    const updated: RespondentData = {
      ...respondent,
      preTest: {
        knowledgeAnswers,
        knowledgeScore,
        attitudeAnswers,
        attitudeScore,
        completedAt: new Date().toISOString()
      },
      currentStep: 'modules'
    };

    setRespondent(updated);
    setCurrentStep('modules');
  };

  // 3. Handle Educational Modules Done (In-Memory Only, No Firestore Save)
  const handleModulesDone = () => {
    if (!respondent) return;

    setRespondent(prev => prev ? {
      ...prev,
      completedModules: ['squat', 'hiradc', 'stretching'],
      currentStep: 'posttest'
    } : null);

    setCurrentStep('posttest');
  };

  // 4. Handle Post-Test Complete (FINAL STAGE: Save Complete Data to Firestore)
  const handlePostTestComplete = async (
    knowledgeScore: number,
    knowledgeAnswers: QuizAnswer[],
    attitudeScore: number,
    attitudeAnswers: AttitudeAnswer[]
  ) => {
    if (!respondent) return;

    const updated: RespondentData = {
      ...respondent,
      completedModules: ['squat', 'hiradc', 'stretching'],
      postTest: {
        knowledgeAnswers,
        knowledgeScore,
        attitudeAnswers,
        attitudeScore,
        completedAt: new Date().toISOString()
      },
      currentStep: 'certificate'
    };

    setRespondent(updated);
    setCurrentStep('certificate');

    // ONLY Write to Firestore Database when Respondent Reaches Final Phase (Post-Test Complete)
    try {
      const base64Payload = encodeBase64(updated);
      const docRef = await addDoc(collection(db, "respondents"), {
        payload: base64Payload,
        name: updated.demographics.name,
        empId: updated.demographics.empId,
        gender: updated.demographics.gender,
        ageGroup: updated.demographics.ageGroup,
        workDurationGroup: updated.demographics.workDurationGroup,
        preTestKnowledgeScore: updated.preTest?.knowledgeScore || 0,
        preTestAttitudeScore: updated.preTest?.attitudeScore || 0,
        postTestKnowledgeScore: knowledgeScore,
        postTestAttitudeScore: attitudeScore,
        currentStep: 'certificate',
        completedAt: updated.postTest?.completedAt || new Date().toISOString(),
        createdAt: updated.createdAt
      });
      setRespondent(prev => prev ? { ...prev, id: docRef.id } : null);
    } catch (err) {
      console.error("Firebase save error (Complete Respondent Data):", err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      <Navbar
        currentStep={currentStep}
        onOpenAdmin={() => setCurrentStep('admin')}
        respondentName={respondent?.demographics.name}
        isAdminAuthenticated={isAdminAuthenticated}
        onAdminLogout={triggerLogoutConfirm}
      />

      <main style={{ flex: 1, paddingBottom: '2.5rem' }}>
        {currentStep === 'demographics' && (
          <DemographicsForm onSubmit={handleDemographicsSubmit} />
        )}

        {currentStep === 'pretest' && respondent && (
          <QuizModule
            type="pretest"
            respondentName={respondent.demographics.name}
            onComplete={handlePreTestComplete}
          />
        )}

        {currentStep === 'modules' && (
          <EducationalModules onCompleteModules={handleModulesDone} />
        )}

        {currentStep === 'posttest' && respondent && (
          <QuizModule
            type="posttest"
            respondentName={respondent.demographics.name}
            onComplete={handlePostTestComplete}
          />
        )}

        {currentStep === 'certificate' && respondent && (
          <Certificate
            respondent={respondent}
            onRestart={() => {
              setRespondent(null);
              setCurrentStep('demographics');
            }}
          />
        )}

        {currentStep === 'admin' && (
          <AdminDashboard
            onBack={() => setCurrentStep('demographics')}
            isAuthenticated={isAdminAuthenticated}
            onLoginSuccess={() => setIsAdminAuthenticated(true)}
            onLogout={triggerLogoutConfirm}
          />
        )}
      </main>

      {/* ADMIN LOGOUT CONFIRMATION MODAL */}
      {showLogoutConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            maxWidth: '440px',
            width: '100%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #E2E8F0',
            overflow: 'hidden',
            animation: 'scaleUp 0.2s ease-out'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 1.5rem',
              backgroundColor: '#FEF2F2',
              borderBottom: '1px solid #FEE2E2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#FEE2E2',
                  color: '#DC2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <AlertTriangle size={22} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#991B1B' }}>
                    Konfirmasi Logout Admin
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#B91C1C' }}>Sesi Administrator ErgoTech K3</span>
                </div>
              </div>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#991B1B',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem', fontSize: '0.9rem', color: '#334155', lineHeight: 1.5 }}>
              <p style={{ margin: '0 0 0.75rem 0', fontWeight: 600, color: '#1E293B' }}>
                Apakah Anda yakin ingin keluar dari akun Admin?
              </p>
              <p style={{ margin: 0, fontSize: '0.825rem', color: '#64748B' }}>
                Sesi administrator Anda akan diakhiri. Anda perlu memasukkan PIN Keamanan Admin kembali untuk menguji atau mengelola data responden.
              </p>
            </div>

            {/* Modal Footer Actions */}
            <div style={{
              padding: '1rem 1.5rem 1.25rem',
              backgroundColor: '#F8FAFC',
              borderTop: '1px solid #F1F5F9',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem'
            }}>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  padding: '0.6rem 1.1rem',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                Batal
              </button>
              <button
                onClick={handleAdminLogout}
                style={{
                  padding: '0.6rem 1.2rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <LogOut size={16} />
                <span>Ya, Keluar Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Corporate Footer */}

      {/* Corporate Footer */}
      <footer style={{
        backgroundColor: '#0F172A',
        color: '#94A3B8',
        padding: '1.25rem 1rem',
        textAlign: 'center',
        fontSize: '0.75rem',
        borderTop: '1px solid #1E293B',
        marginTop: 'auto'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.35rem', alignItems: 'center' }}>
          <div style={{ color: '#F8FAFC', fontWeight: 700, fontSize: '0.85rem' }}>
            ErgoTech K3 — PT. Sinar Powerindo Utama
          </div>
          <div>
            Riset Skripsi Program Studi Sarjana Kesehatan Masyarakat URINDO • Peneliti: <strong>Nur Virgi Arfiyanti</strong> (NIM: 235059048)
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
            © {new Date().getFullYear()} ErgoTech K3. Hak Cipta Dilindungi Undang-Undang.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
