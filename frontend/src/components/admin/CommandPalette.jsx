import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  LayoutDashboard,
  IndianRupee,
  Users,
  ClipboardList,
  UserCheck,
  Package,
  Calendar,
  Layers,
  Sparkles,
  Truck,
  MessageSquare,
  Image as ImageIcon,
  Star,
  ArrowRight,
  Command,
  X
} from 'lucide-react';

const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const commands = [
    { name: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard, category: 'Analytics', shortcut: 'G D' },
    { name: 'Financial Matrix & Invoices', path: '/admin/finance', icon: IndianRupee, category: 'Finance', shortcut: 'G F' },
    { name: 'Client CRM & Bookings', path: '/admin/crm', icon: Users, category: 'Clients', shortcut: 'G C' },
    { name: 'Kanban Operations Board', path: '/admin/tasks', icon: ClipboardList, category: 'Operations', shortcut: 'G K' },
    { name: 'Staff & Team Roster', path: '/admin/staff', icon: UserCheck, category: 'HR', shortcut: 'G S' },
    { name: 'Inventory & Equipment Warehouse', path: '/admin/inventory', icon: Package, category: 'Logistics', shortcut: 'G I' },
    { name: 'Event Calendar & Dates', path: '/admin/calendar', icon: Calendar, category: 'Schedules', shortcut: 'G E' },
    { name: 'Services Catalog', path: '/admin/services', icon: Layers, category: 'Catalog', shortcut: 'G V' },
    { name: 'Event Packages & Bundles', path: '/admin/packages', icon: Sparkles, category: 'Catalog', shortcut: 'G P' },
    { name: 'Vendors & Stage Partners', path: '/admin/vendors', icon: Truck, category: 'Vendors', shortcut: 'G N' },
    { name: 'Communication & Team Hub', path: '/admin/chat', icon: MessageSquare, category: 'Comms', shortcut: 'G M' },
    { name: 'Gallery & Media Showcase', path: '/admin/gallery', icon: ImageIcon, category: 'Media', shortcut: 'G G' },
    { name: 'Client Reviews & Ratings', path: '/admin/reviews', icon: Star, category: 'Reputation', shortcut: 'G R' },
  ];

  const filtered = commands.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (filtered.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          navigate(filtered[selectedIndex].path);
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, navigate, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 5, 8, 0.78)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh'
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '640px',
          backgroundColor: 'rgba(20, 20, 26, 0.95)',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(212, 175, 55, 0.15)',
          borderRadius: '20px',
          overflow: 'hidden',
          animation: 'admin-slide-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
      >
        {/* Search Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            position: 'relative'
          }}
        >
          <Search size={20} style={{ color: 'var(--admin-primary)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or jump to page... (e.g. Finance, CRM, Staff)"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: '15px',
              fontFamily: 'inherit'
            }}
          />
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--admin-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '10px' }} className="admin-scroll">
          {filtered.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--admin-text-muted)', fontSize: '14px' }}>
              No commands found matching "{query}"
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    backgroundColor: isSelected ? 'rgba(212, 175, 55, 0.12)' : 'transparent',
                    border: `1px solid ${isSelected ? 'rgba(212, 175, 55, 0.3)' : 'transparent'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        backgroundColor: isSelected ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                        color: isSelected ? 'var(--admin-primary)' : 'var(--admin-text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: isSelected ? '#fff' : 'var(--admin-text-main)' }}>
                        {item.name}
                      </span>
                      <span style={{ marginLeft: '10px', fontSize: '11px', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isSelected && (
                      <span style={{ fontSize: '12px', color: 'var(--admin-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Jump <ArrowRight size={13} />
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div
          style={{
            padding: '10px 20px',
            backgroundColor: 'rgba(10, 10, 14, 0.6)',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: 'var(--admin-text-muted)'
          }}
        >
          <span>Use <strong>↑</strong> <strong>↓</strong> to navigate, <strong>Enter</strong> to select</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Command size={12} /> + K
          </span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
