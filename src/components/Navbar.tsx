import React from 'react';
import { Shield, Key, CheckCircle, Database } from 'lucide-react';

interface NavbarProps {
  currentStep: string;
  onOpenAdmin: () => void;
  respondentName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentStep, onOpenAdmin, respondentName }) => {
  const steps = [
    { id: 'demographics', label: '1. Identitas' },
    { id: 'pretest', label: '2. Pre-Test' },
    { id: 'modules', label: '3. Modul K3' },
    { id: 'posttest', label: '4. Post-Test' },
    { id: 'certificate', label: '5. Hasil & Sertifikat' }
  ];

  const getStepIndex = (stepId: string) => {
    return steps.findIndex(s => s.id === stepId);
  };

  const currentIndex = getStepIndex(currentStep);

  return (
    <header style={{
      backgroundColor: '#0F172A',
      color: '#FFFFFF',
      borderBottom: '1px solid #1E293B',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
    }}>
      {/* Top Corporate Branding Bar */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Left Branding: Company Logo + ErgoTech K3 Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '0.35rem 0.65rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}>
            <img 
              src="/logo-powerindo.png" 
              alt="PT Sinar Powerindo Utama Logo" 
              style={{ height: '36px', objectFit: 'contain' }}
            />
          </div>
          <div style={{ borderLeft: '1px solid #334155', paddingLeft: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={20} color="#10B981" />
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.5px', margin: 0 }}>
                ErgoTech <span style={{ color: '#10B981' }}>K3</span>
              </h1>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '1px' }}>
              Manual Handling & Ergonomic Safety — PT. Sinar Powerindo Utama
            </p>
          </div>
        </div>

        {/* Right Status Controls & Admin Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Firebase Status Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: '#1E293B',
            padding: '0.35rem 0.75rem',
            borderRadius: '50px',
            fontSize: '0.75rem',
            color: '#CBD5E1',
            border: '1px solid #334155'
          }}>
            <Database size={13} color="#10B981" />
            <span>Firebase Sync</span>
            <span style={{
              width: '6px',
              height: '6px',
              backgroundColor: '#10B981',
              borderRadius: '50%',
              display: 'inline-block'
            }}></span>
          </div>

          {respondentName && (
            <div style={{ fontSize: '0.85rem', color: '#E2E8F0', fontWeight: 500 }}>
              Halo, <span style={{ color: '#10B981', fontWeight: 700 }}>{respondentName}</span>
            </div>
          )}

          {/* Admin Panel Access Button */}
          <button
            onClick={onOpenAdmin}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #334155',
              color: '#94A3B8',
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#FFFFFF', e.currentTarget.style.borderColor = '#64748B')}
            onMouseOut={(e) => (e.currentTarget.style.color = '#94A3B8', e.currentTarget.style.borderColor = '#334155')}
            title="Akses Dashboard Peneliti / Admin"
          >
            <Key size={14} />
            <span>Peneliti</span>
          </button>
        </div>
      </div>

      {/* Steps Navigation Progress Line */}
      {currentStep !== 'admin' && (
        <div style={{
          backgroundColor: '#020617',
          borderTop: '1px solid #1E293B',
          padding: '0.6rem 1.5rem'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            overflowX: 'auto',
            gap: '1rem'
          }}>
            {steps.map((step, idx) => {
              const isCompleted = idx < currentIndex;
              const isCurrent = idx === currentIndex;

              return (
                <div
                  key={step.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.8rem',
                    fontWeight: isCurrent ? 700 : isCompleted ? 600 : 400,
                    color: isCurrent ? '#10B981' : isCompleted ? '#CBD5E1' : '#475569',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {isCompleted ? (
                    <CheckCircle size={15} color="#10B981" />
                  ) : (
                    <span style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: isCurrent ? '#10B981' : '#1E293B',
                      color: isCurrent ? '#FFFFFF' : '#64748B',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      fontWeight: 700
                    }}>
                      {idx + 1}
                    </span>
                  )}
                  <span>{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
