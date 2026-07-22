import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck, Wrench, ArrowLeft } from 'lucide-react';
import AdminAuth from './admin/AdminAuth';
import WorkerAuth from './worker/WorkerAuth';

const UnifiedLogin = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('type') === 'worker' ? 'worker' : 'admin';
  const [activeTab, setActiveTab] = useState(initialTab);
  const navigate = useNavigate();

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: 'var(--admin-bg-base, #0f172a)' }}>
      {/* Top Bar for tab selection & back navigation */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 40px',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.2)'
        }}
      >
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: 'var(--gold, #d4af37)',
            fontSize: '0.95rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'opacity 0.2s'
          }}
        >
          <ArrowLeft size={18} /> Back to Website
        </button>

        {/* Unified Tab Switcher */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '4px',
            borderRadius: '12px',
            border: '1px solid rgba(212, 175, 55, 0.3)'
          }}
        >
          <button
            onClick={() => setActiveTab('admin')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backgroundColor: activeTab === 'admin' ? 'var(--gold, #d4af37)' : 'transparent',
              color: activeTab === 'admin' ? '#000000' : '#ffffff'
            }}
          >
            <ShieldCheck size={16} /> Admin Portal
          </button>
          <button
            onClick={() => setActiveTab('worker')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backgroundColor: activeTab === 'worker' ? 'var(--gold, #d4af37)' : 'transparent',
              color: activeTab === 'worker' ? '#000000' : '#ffffff'
            }}
          >
            <Wrench size={16} /> Worker Portal
          </button>
        </div>
      </div>

      {/* Render selected login form */}
      <div style={{ paddingTop: '70px' }}>
        {activeTab === 'admin' ? (
          <AdminAuth onLogin={() => navigate('/admin')} />
        ) : (
          <WorkerAuth onLogin={() => navigate('/worker')} />
        )}
      </div>
    </div>
  );
};

export default UnifiedLogin;
