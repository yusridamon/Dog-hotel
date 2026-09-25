import React, { useEffect, useState } from 'react';
import { Mail, MailOpen, Trash2, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { formatDate } from '../../utils/helpers';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchMessages = () => {
    setLoading(true);
    api.get('/admin/messages')
      .then(r => setMessages(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMessages(); }, []);

  const markRead = async (id) => {
    try {
      await api.patch(`/admin/messages/${id}/read`);
      setMessages(msgs => msgs.map(m => m.id === id ? { ...m, isRead: true } : m));
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api.delete(`/admin/messages/${id}`);
      setMessages(msgs => msgs.filter(m => m.id !== id));
      if (selected?.id === id) setSelected(null);
      toast.success('Message deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleSelect = (msg) => {
    setSelected(msg);
    if (!msg.isRead) markRead(msg.id);
  };

  const filtered = messages.filter(m => filter === 'unread' ? !m.isRead : true);
  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Messages</h1>
        <p style={{ color: 'var(--gray-500)', fontSize: 14 }}>
          {unreadCount > 0 ? <span style={{ color: 'var(--green-700)', fontWeight: 600 }}>{unreadCount} unread</span> : 'All messages read'} · {messages.length} total
        </p>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[['all', 'All'], ['unread', 'Unread']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)} style={{
            padding: '6px 16px', borderRadius: 'var(--radius-full)', fontSize: 13, fontWeight: 500, cursor: 'pointer',
            border: filter === val ? '2px solid var(--green-700)' : '2px solid var(--gray-200)',
            background: filter === val ? 'var(--green-50)' : '#fff',
            color: filter === val ? 'var(--green-800)' : 'var(--gray-600)',
          }}>
            {label} {val === 'unread' && unreadCount > 0 && `(${unreadCount})`}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, alignItems: 'start' }}>
        {/* Message list */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--gray-400)' }}>Loading…</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--gray-400)', fontSize: 14 }}>No messages</div>
          ) : (
            filtered.map((msg, i) => (
              <div key={msg.id}
                onClick={() => handleSelect(msg)}
                style={{
                  padding: '16px 18px', cursor: 'pointer',
                  borderBottom: i < filtered.length - 1 ? '1px solid var(--gray-100)' : 'none',
                  background: selected?.id === msg.id ? 'var(--green-50)' : !msg.isRead ? '#fffbf0' : '#fff',
                  borderLeft: !msg.isRead ? '3px solid #f59e0b' : '3px solid transparent',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { if (selected?.id !== msg.id) e.currentTarget.style.background = 'var(--gray-50)'; }}
                onMouseLeave={e => { if (selected?.id !== msg.id) e.currentTarget.style.background = !msg.isRead ? '#fffbf0' : '#fff'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                      {msg.isRead
                        ? <MailOpen size={14} style={{ color: 'var(--gray-400)', flexShrink: 0 }} />
                        : <Mail size={14} style={{ color: '#f59e0b', flexShrink: 0 }} />
                      }
                      <span style={{ fontSize: 14, fontWeight: msg.isRead ? 500 : 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {msg.name}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--gray-600)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>
                      {msg.subject}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{formatDate(msg.createdAt)}</div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); deleteMessage(msg.id); }}
                    style={{ padding: 5, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-300)', flexShrink: 0, borderRadius: 'var(--radius-sm)' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--gray-300)'}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message detail */}
        {selected ? (
          <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--gray-200)', background: 'var(--gray-50)' }}>
              <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{selected.subject}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 13, color: 'var(--gray-600)' }}>
                <span>👤 <strong>{selected.name}</strong></span>
                <span>✉️ {selected.email}</span>
                {selected.phone && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={12} /> {selected.phone}</span>}
                <span style={{ color: 'var(--gray-400)' }}>{formatDate(selected.createdAt)}</span>
              </div>
            </div>
            <div style={{ padding: '24px 20px' }}>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--gray-700)', whiteSpace: 'pre-wrap' }}>{selected.message}</p>
            </div>
            <div style={{ padding: '14px 20px', borderTop: '1px solid var(--gray-100)' }}>
              <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px',
                  background: 'var(--green-700)', color: '#fff', borderRadius: 'var(--radius-full)',
                  fontWeight: 600, fontSize: 14, textDecoration: 'none',
                }}>
                <Mail size={15} /> Reply via Email
              </a>
            </div>
          </div>
        ) : (
          <div style={{ background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', padding: '48px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📬</div>
            <p style={{ color: 'var(--gray-400)', fontSize: 14 }}>Select a message to read it</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
