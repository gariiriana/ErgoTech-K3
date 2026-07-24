import React, { useState, useRef, useEffect } from 'react';
import { Key, CheckCircle, UserCheck, LogOut, ShieldCheck, ChevronDown } from 'lucide-react';

interface NavbarProps {
  currentStep: string;
  onOpenAdmin: () => void;
  respondentName?: string;
  isAdminAuthenticated?: boolean;
  onAdminLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStep,
  onOpenAdmin,
  respondentName,
  isAdminAuthenticated = false,
  onAdminLogout
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header style={{
      backgroundColor: '#FFFFFF',
      color: '#0F172A',
      borderBottom: '1px solid #E2E8F0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      {/* Top Accent Line */}
      <div style={{
        height: '3px',
        backgroundColor: '#EA580C'
      }}></div>

      {/* Top Corporate Branding Bar (Single Row, Never Wraps) */}
      <div className="navbar-container" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0.75rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.5rem'
      }}>
        {/* Left Branding: Clean Transparent Company Logo + URINDO Logo + ErgoTech K3 Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
            <img 
              src="/logo-powerindo.png" 
              alt="PT Sinar Powerindo Utama Logo" 
              className="navbar-logo-img"
              style={{ height: '34px', objectFit: 'contain' }}
            />
            <img 
              src="/logo-urindo-official.png" 
              alt="Universitas Respati Indonesia Logo" 
              style={{ height: '32px', objectFit: 'contain' }}
            />
          </div>
          <div className="navbar-branding-divider" style={{ borderLeft: '1px solid #E2E8F0', paddingLeft: '0.6rem' }}>
            <h1 className="navbar-title" style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0F172A', lineHeight: 1.1, whiteSpace: 'nowrap' }}>
              ErgoTech <span style={{ color: '#EA580C' }}>K3</span>
            </h1>
            <p className="navbar-subtitle" style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '1px', fontWeight: 500 }}>
              Manual Handling & Ergonomic Safety — PT. Sinar Powerindo Utama
            </p>
          </div>
        </div>

        {/* Right Controls & Profile Avatar Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
          {respondentName && (
            <div className="respondent-greeting" style={{ fontSize: '0.825rem', color: '#334155', fontWeight: 600 }}>
              Halo, <span style={{ color: '#EA580C', fontWeight: 800 }}>{respondentName}</span>
            </div>
          )}

          {/* Admin Profile Dropdown (If Logged In) or Login Trigger (If Logged Out) */}
          {isAdminAuthenticated ? (
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '20px',
                  padding: '0.25rem 0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                title="Menu Admin Nur Virgi"
              >
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: '#EA580C',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  flexShrink: 0
                }}>
                  NV
                </div>
                <div className="profile-text-full" style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.1 }}>
                    Nur Virgi
                  </div>
                </div>
                <ChevronDown size={14} color="#64748B" style={{ transform: showDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
              </button>

              {/* Profile Dropdown Menu */}
              {showDropdown && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  right: 0,
                  width: '210px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
                  padding: '0.65rem',
                  zIndex: 200,
                  animation: 'fadeIn 0.15s ease-out'
                }}>
                  <div style={{ paddingBottom: '0.5rem', marginBottom: '0.5rem', borderBottom: '1px solid #F1F5F9' }}>
                    <div style={{ fontSize: '0.825rem', fontWeight: 800, color: '#0F172A' }}>
                      Nur Virgi Arfiyanti
                    </div>
                    <div style={{ fontSize: '0.725rem', color: '#64748B' }}>
                      Peneliti Skripsi K3 URINDO
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      onOpenAdmin();
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.5rem 0.6rem',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: currentStep === 'admin' ? '#F8FAFC' : 'transparent',
                      color: currentStep === 'admin' ? '#EA580C' : '#334155',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      marginBottom: '0.25rem'
                    }}
                  >
                    <ShieldCheck size={15} />
                    <span>Dashboard Rekap</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      if (onAdminLogout) onAdminLogout();
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.5rem 0.6rem',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: '#FEF2F2',
                      color: '#DC2626',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <LogOut size={15} />
                    <span>Logout Admin</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAdmin}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                color: '#EA580C',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.775rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.15s ease'
              }}
              title="Akses Dashboard Peneliti / Admin"
            >
              <Key size={13} />
              <span>Peneliti</span>
            </button>
          )}
        </div>
      </div>

      {/* Steps Navigation Progress Line */}
      {currentStep !== 'admin' && (
        <div style={{
          backgroundColor: '#F8FAFC',
          borderTop: '1px solid #E2E8F0',
          padding: '0.45rem 1rem'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Desktop Step List */}
            <div className="steps-desktop">
              {steps.map((step, idx) => {
                const isCompleted = idx < currentIndex;
                const isCurrent = idx === currentIndex;

                return (
                  <div
                    key={step.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.8rem',
                      fontWeight: isCurrent ? 800 : isCompleted ? 700 : 500,
                      color: isCurrent ? '#EA580C' : isCompleted ? '#334155' : '#94A3B8',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {isCompleted ? (
                      <CheckCircle size={15} color="#EA580C" />
                    ) : (
                      <span style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: isCurrent ? '#EA580C' : '#E2E8F0',
                        color: isCurrent ? '#FFFFFF' : '#64748B',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
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

            {/* Mobile Zero-Scroll Step Bar */}
            <div className="steps-mobile">
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>
                <span style={{ color: '#EA580C' }}>Tahap {currentIndex >= 0 ? currentIndex + 1 : 1}/5:</span> {steps[currentIndex >= 0 ? currentIndex : 0]?.label.replace(/^[0-9]+\.\s*/, '')}
              </div>

              {/* Compact 5 Step Dots */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                {steps.map((s, idx) => {
                  const isCompleted = idx < currentIndex;
                  const isCurrent = idx === currentIndex;
                  return (
                    <span
                      key={s.id}
                      style={{
                        width: isCurrent ? '16px' : '7px',
                        height: '7px',
                        borderRadius: '4px',
                        backgroundColor: isCurrent ? '#EA580C' : isCompleted ? '#F59E0B' : '#CBD5E1',
                        transition: 'all 0.15s ease'
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
