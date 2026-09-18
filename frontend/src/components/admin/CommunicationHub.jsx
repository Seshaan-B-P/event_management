import { API_BASE_URL } from '../../config';
import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Truck, MessageCircle, Phone, Mail, Clock, Check, CheckCheck, Radio, Shield, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const CommunicationHub = () => {
  const [activeTab, setActiveTab] = useState('Staff');
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);

  const adminName = localStorage.getItem('bps_admin_username') || 'Admin';

  useEffect(() => {
    fetchContacts();
    setActiveContact(null);
    setMessages([]);
  }, [activeTab]);

  useEffect(() => {
    if (activeContact) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000); // Polling every 5s
      return () => clearInterval(interval);
    }
  }, [activeContact]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchContacts = async () => {
    setLoadingContacts(true);
    try {
      const endpoint = activeTab === 'Staff' ? '/api/staff' : '/api/vendors';
      const res = await fetch(`${API_BASE_URL}${endpoint}`);
      const data = await res.json();
      if (data.success) {
        setContacts(data.data);
      }
    } catch (err) {
      toast.error('Failed to load contacts');
    } finally {
      setLoadingContacts(false);
    }
  };

  const fetchMessages = async () => {
    if (!activeContact) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/messages/${activeTab}/${activeContact._id}`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeContact) return;

    const messageData = {
      senderName: adminName,
      receiverType: activeTab,
      receiverId: activeContact._id,
      content: newMessage.trim()
    };

    setNewMessage(''); // optimistic clear

    try {
      const res = await fetch(`${API_BASE_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, data.data]);
        scrollToBottom();
      }
    } catch (err) {
      toast.error('Failed to send message');
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ height: 'calc(100vh - 125px)', display: 'flex', flexDirection: 'column', padding: '16px 0' }} className="admin-animate-fade">
      {/* Header with Radio Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: '800', margin: 0, letterSpacing: '-0.5px' }}>
              Command Dispatch & Comms Hub
            </h1>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '700',
              padding: '4px 10px', borderRadius: '12px', backgroundColor: 'rgba(212, 175, 55, 0.1)',
              color: 'var(--admin-primary)', border: '1px solid rgba(212, 175, 55, 0.25)'
            }}>
              <Radio size={12} /> SECURE LINK
            </span>
          </div>
          <p style={{ color: 'var(--admin-text-muted)', margin: '4px 0 0 0', fontSize: '14px' }}>
            Direct real-time tactical communications with field crew and external vendor network.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
          <span className="neon-pulse-dot" />
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--admin-success)', letterSpacing: '0.5px' }}>
            CH-01 ENCRYPTED LIVE
          </span>
        </div>
      </div>

      <div style={{
        flex: 1, display: 'flex',
        backgroundColor: 'var(--admin-bg-panel)', border: '1px solid var(--admin-border)',
        borderRadius: '18px', overflow: 'hidden', boxShadow: '0 12px 36px rgba(0,0,0,0.35)'
      }}>
        {/* Left Pane: Directory */}
        <div style={{ width: '320px', borderRight: '1px solid var(--admin-border)', display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(0,0,0,0.2)' }}>
          {/* Tab Switcher */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--admin-border)', padding: '6px', gap: '6px', backgroundColor: 'rgba(255,255,255,0.02)' }}>
            <button
              onClick={() => setActiveTab('Staff')}
              className="tactile-press"
              style={{
                flex: 1, padding: '10px', borderRadius: '8px', border: 'none',
                backgroundColor: activeTab === 'Staff' ? 'var(--admin-primary)' : 'transparent',
                color: activeTab === 'Staff' ? '#000' : 'var(--admin-text-muted)',
                fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                fontSize: '13px', transition: 'all 0.2s ease'
              }}
            >
              <User size={15} /> Crew Staff
            </button>
            <button
              onClick={() => setActiveTab('Vendor')}
              className="tactile-press"
              style={{
                flex: 1, padding: '10px', borderRadius: '8px', border: 'none',
                backgroundColor: activeTab === 'Vendor' ? 'var(--admin-primary)' : 'transparent',
                color: activeTab === 'Vendor' ? '#000' : 'var(--admin-text-muted)',
                fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                fontSize: '13px', transition: 'all 0.2s ease'
              }}
            >
              <Truck size={15} /> Vendors
            </button>
          </div>

          {/* Directory List */}
          <div style={{ flex: 1, overflowY: 'auto' }} className="admin-scroll">
            {loadingContacts ? (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--admin-text-muted)', fontSize: '13px' }}>
                Scanning frequency contacts...
              </div>
            ) : contacts.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--admin-text-muted)', fontSize: '13px' }}>
                No active contacts found.
              </div>
            ) : (
              contacts.map(c => {
                const isSelected = activeContact?._id === c._id;
                return (
                  <div
                    key={c._id}
                    onClick={() => setActiveContact(c)}
                    className="tactile-press"
                    style={{
                      padding: '14px 16px',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      backgroundColor: isSelected ? 'rgba(212, 175, 55, 0.12)' : 'transparent',
                      cursor: 'pointer',
                      borderLeft: isSelected ? '4px solid var(--admin-primary)' : '4px solid transparent',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '10px',
                      backgroundColor: isSelected ? 'var(--admin-primary)' : 'rgba(255,255,255,0.05)',
                      color: isSelected ? '#000' : 'var(--admin-primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: '700', fontSize: '14px', border: '1px solid rgba(212,175,55,0.2)'
                    }}>
                      {(c.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: '700', color: 'var(--admin-text-main)', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.name}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)', marginTop: '2px' }}>
                        {c.role || c.category || 'Specialist'}
                      </div>
                    </div>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--admin-success)', opacity: isSelected ? 1 : 0.6 }} />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Comms Terminal */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(10, 10, 10, 0.5)' }}>
          {activeContact ? (
            <>
              {/* Comms Terminal Header */}
              <div style={{
                padding: '16px 24px', borderBottom: '1px solid var(--admin-border)',
                backgroundColor: 'var(--admin-bg-panel)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'rgba(212, 175, 55, 0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-primary)',
                    border: '1px solid rgba(212, 175, 55, 0.3)'
                  }}>
                    {activeTab === 'Staff' ? <User size={20} /> : <Truck size={20} />}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: 'var(--admin-text-main)' }}>
                      {activeContact.name}
                    </h3>
                    <div style={{ display: 'flex', gap: '14px', color: 'var(--admin-text-muted)', fontSize: '12px', marginTop: '2px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Phone size={11} style={{ color: 'var(--admin-primary)' }} />
                        {activeContact.contactNumber || activeContact.phone || 'Direct Line'}
                      </span>
                      {activeContact.email && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Mail size={11} style={{ color: 'var(--admin-primary)' }} />
                          {activeContact.email}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '11px', color: 'var(--admin-primary)', padding: '4px 10px', borderRadius: '8px', backgroundColor: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', fontWeight: '600' }}>
                  {activeTab.toUpperCase()} CHANNEL
                </div>
              </div>

              {/* Message Feed */}
              <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }} className="admin-scroll">
                {messages.length === 0 ? (
                  <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                    <MessageCircle size={44} style={{ opacity: 0.25, marginBottom: '12px', color: 'var(--admin-primary)' }} />
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>Terminal initialized. Ready for dispatch.</p>
                    <span style={{ fontSize: '12px', opacity: 0.7 }}>Messages are logged with audit timestamps.</span>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isMe = msg.senderName === adminName;
                    return (
                      <div
                        key={msg._id || idx}
                        style={{
                          alignSelf: isMe ? 'flex-end' : 'flex-start',
                          maxWidth: '68%',
                          backgroundColor: isMe ? 'var(--admin-primary)' : 'var(--admin-bg-panel)',
                          color: isMe ? '#000' : 'var(--admin-text-main)',
                          padding: '12px 18px',
                          borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                          border: isMe ? '1px solid rgba(212,175,55,0.4)' : '1px solid var(--admin-border)',
                          boxShadow: isMe ? '0 4px 20px rgba(212, 175, 55, 0.2)' : '0 4px 14px rgba(0,0,0,0.2)',
                          position: 'relative'
                        }}
                      >
                        {!isMe && (
                          <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--admin-primary)', marginBottom: '4px', letterSpacing: '0.4px' }}>
                            {msg.senderName}
                          </div>
                        )}
                        <div style={{ fontSize: '14px', lineHeight: '1.5', fontWeight: isMe ? '500' : '400' }}>
                          {msg.content}
                        </div>
                        <div style={{
                          fontSize: '10px', textAlign: 'right', marginTop: '6px',
                          opacity: 0.75, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px',
                          fontWeight: '600'
                        }}>
                          <Clock size={10} />
                          {formatTime(msg.createdAt)}
                          {isMe && (
                            msg.isRead
                              ? <CheckCheck size={13} color="#000" />
                              : <Check size={13} color="#000" />
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Bar */}
              <div style={{ padding: '16px 20px', borderTop: '1px solid var(--admin-border)', backgroundColor: 'var(--admin-bg-panel)' }}>
                <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={activeTab === 'Vendor' ? `Dispatch instruction to ${activeContact.name}...` : `Transmit order to ${activeContact.name}...`}
                    style={{
                      flex: 1, padding: '14px 18px', backgroundColor: 'rgba(0,0,0,0.3)',
                      border: '1px solid var(--admin-border)', borderRadius: '24px',
                      color: 'var(--admin-text-main)', outline: 'none', fontSize: '14px'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="tactile-press"
                    style={{
                      padding: '0 24px', height: '48px', backgroundColor: 'var(--admin-primary)', color: '#000',
                      border: 'none', borderRadius: '24px', cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                      fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px',
                      opacity: newMessage.trim() ? 1 : 0.5, boxShadow: '0 4px 14px rgba(212,175,55,0.25)'
                    }}
                  >
                    <Send size={16} /> Transmit
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--admin-text-muted)', padding: '40px' }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '20px', backgroundColor: 'rgba(212, 175, 55, 0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto',
                border: '1px solid rgba(212, 175, 55, 0.2)'
              }}>
                <Radio size={36} color="var(--admin-primary)" />
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--admin-text-main)', margin: '0 0 8px 0' }}>
                Encrypted Dispatch Channel
              </h2>
              <p style={{ margin: 0, fontSize: '14px', maxWidth: '360px', lineHeight: '1.5' }}>
                Select a Crew Member or Vendor Partner on the left directory to initialize direct communication.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunicationHub;
