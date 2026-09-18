import { API_BASE_URL } from '../../config';
import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, Clock, ShieldCheck, Radio, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const WorkerChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const username = localStorage.getItem('bps_staff_username') || 'Field Specialist';
  const staffId = localStorage.getItem('bps_staff_id');

  useEffect(() => {
    if (staffId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000); // Polling every 5s
      return () => clearInterval(interval);
    } else {
      setLoading(false);
      toast.error('Staff credentials expired. Please log in again.');
    }
  }, [staffId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/messages/Staff/${staffId}`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch messages', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !staffId) return;

    const messageData = {
      senderName: username,
      receiverType: 'Staff',
      receiverId: staffId,
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
      toast.error('Failed to send transmission');
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="admin-animate-fade" style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={styles.title}>Field Dispatch & Tactical Radio</h2>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '700',
              padding: '4px 10px', borderRadius: '12px', backgroundColor: 'rgba(212, 175, 55, 0.1)',
              color: 'var(--admin-primary)', border: '1px solid rgba(212, 175, 55, 0.25)'
            }}>
              <Radio size={12} /> SECURE FREQUENCY
            </span>
          </div>
          <p style={styles.subtitle}>Direct two-way encrypted telemetry channel with central management headquarters.</p>
        </div>
      </div>

      <div className="admin-glass-panel" style={styles.chatContainer}>
        {/* Terminal Header */}
        <div style={styles.chatHeader}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={styles.adminAvatar}>
                <ShieldCheck size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: 'var(--admin-text-main)' }}>
                  Central Command & Supervision
                </h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                  Active Operator: <strong style={{ color: 'var(--admin-primary)' }}>{username}</strong>
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '20px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
              <span className="neon-pulse-dot" />
              <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--admin-success)', letterSpacing: '0.4px' }}>
                AUDIO & DATA LINK STABLE
              </span>
            </div>
          </div>
        </div>

        {/* Message Stream */}
        <div className="admin-scroll" style={styles.messageList}>
          {loading ? (
            <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--admin-text-muted)', fontSize: '13px' }}>
              Synchronizing transmission logs...
            </div>
          ) : messages.length === 0 ? (
            <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--admin-text-muted)', padding: '32px' }}>
              <MessageCircle size={48} style={{ opacity: 0.25, marginBottom: '16px', color: 'var(--admin-primary)' }} />
              <p style={{ margin: 0, fontSize: '15px', fontWeight: '600' }}>Frequency initialized. No prior transmissions.</p>
              <span style={{ fontSize: '12px', opacity: 0.7 }}>Report on-site status or ask management questions below.</span>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isMe = msg.senderName === username;
              return (
                <div key={msg._id || idx} style={{
                  alignSelf: isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '75%',
                  backgroundColor: isMe ? 'var(--admin-primary)' : 'var(--admin-bg-panel)',
                  color: isMe ? '#000' : 'var(--admin-text-main)',
                  padding: '12px 18px',
                  borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  border: isMe ? '1px solid rgba(212,175,55,0.4)' : '1px solid var(--admin-border)',
                  boxShadow: isMe ? '0 4px 16px rgba(212, 175, 55, 0.2)' : '0 4px 12px rgba(0,0,0,0.25)',
                  position: 'relative'
                }}>
                  {!isMe && (
                    <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--admin-primary)', marginBottom: '4px', letterSpacing: '0.4px' }}>
                      {msg.senderName} (Management)
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
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div style={styles.inputArea}>
          <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Transmit update or inquiry to Central HQ..."
              style={styles.input}
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="tactile-press"
              style={{
                ...styles.sendBtn,
                opacity: newMessage.trim() ? 1 : 0.5,
                cursor: newMessage.trim() ? 'pointer' : 'not-allowed'
              }}
            >
              <Send size={16} />
              <span>Transmit</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '8px 0'
  },
  header: {
    marginBottom: '8px'
  },
  title: {
    fontSize: '26px',
    fontWeight: '800',
    margin: 0,
    color: 'var(--admin-text-main)',
    letterSpacing: '-0.5px'
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--admin-text-muted)',
    margin: '4px 0 0 0'
  },
  chatContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '18px',
    overflow: 'hidden',
    backgroundColor: 'var(--admin-bg-panel)',
    border: '1px solid var(--admin-border)',
    boxShadow: '0 12px 36px rgba(0,0,0,0.35)',
    minHeight: '480px'
  },
  chatHeader: {
    padding: '16px 20px',
    borderBottom: '1px solid var(--admin-border)',
    backgroundColor: 'rgba(0,0,0,0.25)'
  },
  adminAvatar: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    color: 'var(--admin-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(212, 175, 55, 0.3)'
  },
  messageList: {
    flex: 1,
    padding: '24px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    backgroundColor: 'rgba(10, 10, 10, 0.4)'
  },
  inputArea: {
    padding: '16px 20px',
    borderTop: '1px solid var(--admin-border)',
    backgroundColor: 'rgba(0,0,0,0.25)'
  },
  input: {
    flex: 1,
    padding: '14px 18px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    border: '1px solid var(--admin-border)',
    borderRadius: '24px',
    color: 'var(--admin-text-main)',
    outline: 'none',
    fontSize: '14px'
  },
  sendBtn: {
    padding: '0 24px',
    height: '48px',
    backgroundColor: 'var(--admin-primary)',
    color: '#000',
    border: 'none',
    borderRadius: '24px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    boxShadow: '0 4px 16px rgba(212,175,55,0.25)'
  }
};

export default WorkerChat;

