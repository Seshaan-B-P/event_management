import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, Clock, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const WorkerChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const username = localStorage.getItem('bps_staff_username') || 'Worker';
  const staffId = localStorage.getItem('bps_staff_id');

  useEffect(() => {
    if (staffId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000); // Polling every 5s
      return () => clearInterval(interval);
    } else {
      setLoading(false);
      toast.error('Staff ID not found. Please log in again.');
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
      const res = await fetch(`http://https://event-management-kvfo.onrender.com/api/messages/Staff/${staffId}`);
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
      const res = await fetch('http://https://event-management-kvfo.onrender.com/api/messages', {
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
    <div className="admin-animate-fade" style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Team Chat</h2>
          <p style={styles.subtitle}>Communicate with the admin team and managers.</p>
        </div>
      </div>

      <div className="admin-glass-panel" style={styles.chatContainer}>
        {/* Chat Header inside card */}
        <div style={styles.chatHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={styles.adminAvatar}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px' }}>Admin / Management Hub</h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--admin-success)' }}>Active</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="admin-scroll" style={styles.messageList}>
          {loading ? (
            <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--admin-text-muted)' }}>Loading messages...</div>
          ) : messages.length === 0 ? (
            <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
              <MessageCircle size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
              <p>No messages yet. Send a message to the admin team!</p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isMe = msg.senderName === username;
              return (
                <div key={msg._id || idx} style={{
                  alignSelf: isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '75%',
                  backgroundColor: isMe ? 'var(--admin-primary)' : 'rgba(255, 255, 255, 0.05)',
                  color: isMe ? '#000' : 'var(--admin-text-main)',
                  padding: '12px 16px',
                  borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                  {!isMe && <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--admin-primary)', marginBottom: '6px' }}>{msg.senderName}</div>}
                  <div style={{ fontSize: '14px', lineHeight: '1.5' }}>{msg.content}</div>
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
        <div style={styles.inputArea}>
          <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message to the team..."
              style={styles.input}
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              style={{
                ...styles.sendBtn,
                opacity: newMessage.trim() ? 1 : 0.5,
                cursor: newMessage.trim() ? 'pointer' : 'not-allowed'
              }}
            >
              <Send size={18} />
              <span className="hide-mobile">Send</span>
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
  },
  header: {
    marginBottom: '24px'
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    margin: '0 0 8px 0',
    color: 'var(--admin-text-main)'
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--admin-text-muted)',
    margin: 0
  },
  chatContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '16px',
    overflow: 'hidden',
    backgroundColor: 'var(--admin-bg-panel)',
    border: '1px solid var(--admin-border)'
  },
  chatHeader: {
    padding: '20px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    backgroundColor: 'rgba(0,0,0,0.2)'
  },
  adminAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    color: 'var(--admin-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  messageList: {
    flex: 1,
    padding: '24px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    backgroundColor: 'rgba(10, 10, 10, 0.3)'
  },
  inputArea: {
    padding: '20px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    backgroundColor: 'rgba(0,0,0,0.2)'
  },
  input: {
    flex: 1,
    padding: '14px 20px',
    backgroundColor: 'rgba(255,255,255,0.03)',
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
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease'
  }
};

export default WorkerChat;
