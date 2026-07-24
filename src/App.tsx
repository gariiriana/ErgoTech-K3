import React, { useState } from 'react';
import { db } from './firebase/config';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
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

  // Handle Demographics Registration
  const handleDemographicsSubmit = async (demographics: RespondentDemographics) => {
    const newRespondent: RespondentData = {
      demographics,
      completedModules: [],
      currentStep: 'pretest',
      createdAt: new Date().toISOString()
    };

    setRespondent(newRespondent);
    setCurrentStep('pretest');

    // Save Base64 Encoded Record to Firestore Database
    try {
      const base64Payload = encodeBase64(newRespondent);
      const docRef = await addDoc(collection(db, "respondents"), {
        payload: base64Payload,
        name: demographics.name, // Index plain text for easy lookup
        empId: demographics.empId,
        createdAt: newRespondent.createdAt
      });
      setRespondent(prev => prev ? { ...prev, id: docRef.id } : null);
    } catch (err) {
      console.error("Firebase save error (Base64 Demographics):", err);
    }
  };

  // Handle Pre-Test Complete
  const handlePreTestComplete = async (
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

    // Update Base64 Payload in Firestore Database
    if (respondent.id) {
      try {
        const base64Payload = encodeBase64(updated);
        const docRef = doc(db, "respondents", respondent.id);
        await updateDoc(docRef, {
          payload: base64Payload,
          preTestKnowledgeScore: knowledgeScore,
          preTestAttitudeScore: attitudeScore,
          currentStep: 'modules',
          updatedAt: new Date().toISOString()
        });
      } catch (err) {
        console.error("Firebase update error (Base64 Pre-Test):", err);
      }
    }
  };

  // Handle Educational Modules Done
  const handleModulesDone = () => {
    if (!respondent) return;

    setRespondent(prev => prev ? {
      ...prev,
      completedModules: ['squat', 'hiradc', 'stretching'],
      currentStep: 'posttest'
    } : null);

    setCurrentStep('posttest');
  };

  // Handle Post-Test Complete
  const handlePostTestComplete = async (
    knowledgeScore: number,
    knowledgeAnswers: QuizAnswer[],
    attitudeScore: number,
    attitudeAnswers: AttitudeAnswer[]
  ) => {
    if (!respondent) return;

    const updated: RespondentData = {
      ...respondent,
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

    // Update Base64 Payload in Firestore Database
    if (respondent.id) {
      try {
        const base64Payload = encodeBase64(updated);
        const docRef = doc(db, "respondents", respondent.id);
        await updateDoc(docRef, {
          payload: base64Payload,
          postTestKnowledgeScore: knowledgeScore,
          postTestAttitudeScore: attitudeScore,
          completedModules: ['squat', 'hiradc', 'stretching'],
          currentStep: 'certificate',
          updatedAt: new Date().toISOString()
        });
      } catch (err) {
        console.error("Firebase update error (Base64 Post-Test):", err);
      }
    }
  };

  // Restart for New Respondent
  const handleRestart = () => {
    setRespondent(null);
    setCurrentStep('demographics');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header Navbar */}
      <Navbar
        currentStep={currentStep}
        onOpenAdmin={() => setCurrentStep('admin')}
        respondentName={respondent?.demographics.name}
      />

      {/* Main Content Body */}
      <main style={{ flex: 1, paddingBottom: '3rem' }}>
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
            onRestart={handleRestart}
          />
        )}

        {currentStep === 'admin' && (
          <AdminDashboard onBack={() => setCurrentStep(respondent ? respondent.currentStep : 'demographics')} />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#0F172A',
        color: '#64748B',
        padding: '1.5rem',
        textAlign: 'center',
        fontSize: '0.85rem',
        borderTop: '1px solid #1E293B'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div><strong>ErgoTech K3</strong> — Platform Promosi Kesehatan & Ergonomi Manual Handling</div>
          <div style={{ marginTop: '4px', color: '#94A3B8' }}>
            Skripsi Nur Virgi Arfiyanti (NIM: 235059048) — Program Studi Sarjana Kesehatan Masyarakat URINDO x PT. Sinar Powerindo Utama
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
