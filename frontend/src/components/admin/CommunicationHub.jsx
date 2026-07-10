import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Truck, MessageCircle, Phone, Mail, Clock } from 'lucide-react';
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
      const res = await fetch(`http://localhost:5000${endpoint}`);
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
      const res = await fetch(`http://localhost:5000/api/messages/${activeTab}/${activeContact._id}`);
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
      const res = await fetch('http://localhost:5000/api/messages', {
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
    <div style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', padding: '24px 0' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <MessageCircle size={32} color="var(--admin-primary)" />
          Communication Hub
        </h1>
        <p style={{ color: 'var(--admin-text-muted)', margin: 0 }}>Internal chat and vendor communication logs.</p>
      </div>

      <div style={{ 
        flex: 1, display: 'flex', 
        backgroundColor: 'var(--admin-bg-panel)', border: '1px solid var(--admin-border)',
        borderRadius: '16px', overflow: 'hidden'
      }}>
        {/* Left Pane: Contacts */}
        <div style={{ width: '320px', borderRight: '1px solid var(--admin-border)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--admin-border)' }}>
            <button 
              onClick={() => setActiveTab('Staff')}
              style={{ flex: 1, padding: '16px', background: 'none', border: 'none', borderBottom: activeTab === 'Staff' ? '2px solid var(--admin-primary)' : '2px solid transparent', color: activeTab === 'Staff' ? 'var(--admin-primary)' : 'var(--admin-text-muted)', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <User size={18} /> Staff
            </button>
            <button 
              onClick={() => setActiveTab('Vendor')}
              style={{ flex: 1, padding: '16px', background: 'none', border: 'none', borderBottom: activeTab === 'Vendor' ? '2px solid var(--admin-primary)' : '2px solid transparent', color: activeTab === 'Vendor' ? 'var(--admin-primary)' : 'var(--admin-text-muted)', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Truck size={18} /> Vendors
            </button>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto' }} className="admin-scroll">
            {loadingContacts ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>Loading...</div>
            ) : contacts.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>No contacts found.</div>
            ) : (
              contacts.map(c => (
                <div 
                  key={c._id}
                  onClick={() => setActiveContact(c)}
                  style={{
                    padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)',
                    backgroundColor: activeContact?._id === c._id ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                    cursor: 'pointer', transition: 'background 0.2s',
                    borderLeft: activeContact?._id === c._id ? '4px solid var(--admin-primary)' : '4px solid transparent'
                  }}
                >
                  <div style={{ fontWeight: '600', color: 'var(--admin-text-main)', marginBottom: '4px' }}>{c.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>{c.role || c.category}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Pane: Chat */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(0,0,0,0.2)' }}>
          {activeContact ? (
            <>
              {/* Chat Header */}
              <div style={{ padding: '20px', borderBottom: '1px solid var(--admin-border)', backgroundColor: 'var(--admin-bg-panel)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>{activeContact.name}</h3>
                  <div style={{ display: 'flex', gap: '16px', color: 'var(--admin-text-muted)', fontSize: '13px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={12}/> {activeContact.contactNumber || activeContact.phone}</span>
                    {activeContact.email && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={12}/> {activeContact.email}</span>}
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }} className="admin-scroll">
                {messages.length === 0 ? (
                  <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                    <MessageCircle size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isMe = msg.senderName === adminName;
                    return (
                      <div key={msg._id || idx} style={{
                        alignSelf: isMe ? 'flex-end' : 'flex-start',
                        maxWidth: '70%',
                        backgroundColor: isMe ? 'var(--admin-primary)' : 'var(--admin-bg-panel)',
                        color: isMe ? '#000' : 'var(--admin-text-main)',
                        padding: '12px 16px',
                        borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        border: isMe ? 'none' : '1px solid var(--admin-border)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}>
                        {!isMe && <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--admin-primary)', marginBottom: '4px' }}>{msg.senderName}</div>}
                        <div style={{ fontSize: '14px', lineHeight: '1.4' }}>{msg.content}</div>
                        <div style={{ fontSize: '10px', textAlign: 'right', marginTop: '6px', opacity: 0.7, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                          <Clock size={10} />
                          {formatTime(msg.createdAt)}
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div style={{ padding: '20px', borderTop: '1px solid var(--admin-border)', backgroundColor: 'var(--admin-bg-panel)' }}>
                <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '12px' }}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={activeTab === 'Vendor' ? `Log communication with ${activeContact.name}...` : `Message ${activeContact.name}...`}
                    style={{
                      flex: 1, padding: '12px 16px', backgroundColor: 'rgba(0,0,0,0.2)',
                      border: '1px solid var(--admin-border)', borderRadius: '24px',
                      color: 'var(--admin-text-main)', outline: 'none'
                    }}
                  />
                  <button 
                    type="submit"
                    disabled={!newMessage.trim()}
                    style={{
                      padding: '0 24px', backgroundColor: 'var(--admin-primary)', color: '#000',
                      border: 'none', borderRadius: '24px', cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                      fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px',
                      opacity: newMessage.trim() ? 1 : 0.5
                    }}
                  >
                    <Send size={18} /> {activeTab === 'Vendor' ? 'Log' : 'Send'}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
              <MessageCircle size={64} style={{ opacity: 0.1, marginBottom: '24px' }} />
              <h2>Welcome to Communication Hub</h2>
              <p>Select a Staff member or Vendor to start messaging.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunicationHub;
