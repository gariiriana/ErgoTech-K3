import React from 'react';
import { Key, CheckCircle } from 'lucide-react';

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
      backgroundColor: '#FFFFFF',
      color: '#0F172A',
      borderBottom: '2px solid #FED7AA',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 20px rgba(245, 158, 11, 0.08)'
    }}>
      {/* Top Gradient Orange Accent Line */}
      <div style={{
        height: '4px',
        background: 'linear-gradient(90deg, #F59E0B 0%, #EA580C 50%, #D97706 100%)'
      }}></div>

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
            border: '1px solid #FED7AA',
            boxShadow: '0 2px 8px rgba(245, 158, 11, 0.1)'
          }}>
            <img 
              src="/logo-powerindo.png" 
              alt="PT Sinar Powerindo Utama Logo" 
              style={{ height: '36px', objectFit: 'contain' }}
            />
          </div>
          <div style={{ borderLeft: '2px solid #FED7AA', paddingLeft: '1rem' }}>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px', margin: 0, color: '#0F172A' }}>
              ErgoTech <span style={{
                background: 'linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>K3</span>
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '1px', fontWeight: 500 }}>
              Manual Handling & Ergonomic Safety — PT. Sinar Powerindo Utama
            </p>
          </div>
        </div>

        {/* Right Status Controls & Admin Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {respondentName && (
            <div style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 600 }}>
              Halo, <span style={{ color: '#EA580C', fontWeight: 800 }}>{respondentName}</span>
            </div>
          )}

          {/* Admin Panel Access Button */}
          <button
            onClick={onOpenAdmin}
            style={{
              backgroundColor: '#FFF7ED',
              border: '1.5px solid #FDBA74',
              color: '#EA580C',
              padding: '0.45rem 0.95rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 6px rgba(234, 88, 12, 0.1)'
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#F59E0B', e.currentTarget.style.color = '#FFFFFF')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#FFF7ED', e.currentTarget.style.color = '#EA580C')}
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
          backgroundColor: '#FFF7ED',
          borderTop: '1px solid #FFEDD5',
          padding: '0.65rem 1.5rem'
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
                    fontSize: '0.825rem',
                    fontWeight: isCurrent ? 800 : isCompleted ? 700 : 500,
                    color: isCurrent ? '#EA580C' : isCompleted ? '#C2410C' : '#94A3B8',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {isCompleted ? (
                    <CheckCircle size={16} color="#EA580C" />
                  ) : (
                    <span style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: isCurrent ? 'linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)' : '#E2E8F0',
                      color: isCurrent ? '#FFFFFF' : '#64748B',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 800
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
