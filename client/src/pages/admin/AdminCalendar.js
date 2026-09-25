import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../utils/api';
import { StatusBadge } from '../../utils/helpers';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const statusDotColors = {
  PENDING: '#f59e0b',
  CONFIRMED: '#10b981',
  REJECTED: '#ef4444',
  CANCELLED: '#9ca3af',
  COMPLETED: '#3b82f6',
};

const AdminCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  useEffect(() => {
    setLoading(true);
    api.get(`/admin/calendar?year=${year}&month=${month}`)
      .then(r => setEvents(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [year, month]);

  const prevMonth = () => setDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  // Build calendar grid
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const getEventsForDay = (day) => {
    if (!day) return [];
    const cellDate = new Date(year, month - 1, day);
    return events.filter(ev => {
      const start = new Date(ev.start);
      const end = new Date(ev.end);
      start.setHours(0,0,0,0); end.setHours(0,0,0,0); cellDate.setHours(0,0,0,0);
      return cellDate >= start && cellDate < end;
    });
  };

  const today = new Date();
  const isToday = (day) => day && today.getFullYear() === year && today.getMonth() + 1 === month && today.getDate() === day;

  const selectedEvents = selected ? getEventsForDay(selected) : [];

  return (
    <div>
      <style>{`
        @media (max-width: 640px) {
          .cal-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Calendar</h1>
        <p style={{ color: 'var(--gray-500)', fontSize: 14 }}>View all bookings by date</p>
      </div>

      <div className="cal-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 340px)', gap: 24, alignItems: 'start' }}>
        {/* Calendar */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--gray-200)' }}>
            <button onClick={prevMonth} style={{ padding: 8, border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <ChevronLeft size={16} />
            </button>
            <h2 style={{ fontSize: 17, fontWeight: 700 }}>{MONTHS[month - 1]} {year}</h2>
            <button onClick={nextMonth} style={{ padding: 8, border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Days header */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--gray-100)' }}>
            {DAYS.map(d => (
              <div key={d} style={{ padding: '8px 0', textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{d}</div>
            ))}
          </div>

          {/* Cells */}
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--gray-400)' }}>Loading calendar…</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
              {cells.map((day, i) => {
                const dayEvents = getEventsForDay(day);
                const isSelected = selected === day;
                const isTdy = isToday(day);
                return (
                  <div key={i}
                    onClick={() => day && setSelected(isSelected ? null : day)}
                    style={{
                      minHeight: 72, padding: '6px 8px',
                      borderRight: (i + 1) % 7 !== 0 ? '1px solid var(--gray-100)' : 'none',
                      borderBottom: '1px solid var(--gray-100)',
                      background: isSelected ? 'var(--green-50)' : day ? '#fff' : 'var(--gray-50)',
                      cursor: day ? 'pointer' : 'default',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { if (day && !isSelected) e.currentTarget.style.background = 'var(--gray-50)'; }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = day ? '#fff' : 'var(--gray-50)'; }}
                  >
                    {day && (
                      <>
                        <div style={{
                          width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 13, fontWeight: isTdy ? 700 : 500,
                          background: isTdy ? 'var(--green-800)' : isSelected ? 'var(--green-200)' : 'transparent',
                          color: isTdy ? '#fff' : isSelected ? 'var(--green-900)' : 'var(--gray-700)',
                          marginBottom: 4,
                        }}>{day}</div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          {dayEvents.slice(0, 2).map(ev => (
                            <div key={ev.id} style={{
                              fontSize: 10, padding: '1px 5px', borderRadius: 3,
                              background: statusDotColors[ev.status] + '22',
                              color: statusDotColors[ev.status],
                              fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                              borderLeft: `2px solid ${statusDotColors[ev.status]}`,
                            }}>
                              {ev.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div style={{ fontSize: 10, color: 'var(--gray-400)', fontWeight: 600 }}>+{dayEvents.length - 2} more</div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Legend */}
          <div style={{ padding: '12px 20px', borderTop: '1px solid var(--gray-100)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {Object.entries(statusDotColors).map(([status, color]) => (
              <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                <span style={{ color: 'var(--gray-500)', fontWeight: 500 }}>{status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar - selected day events */}
        <div>
          {selected ? (
            <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--gray-200)', fontWeight: 700, fontSize: 15 }}>
                {MONTHS[month - 1]} {selected}, {year}
              </div>
              {selectedEvents.length === 0 ? (
                <div style={{ padding: 32, textAlign: 'center', color: 'var(--gray-400)', fontSize: 14 }}>No bookings this day</div>
              ) : (
                <div style={{ padding: '16px' }}>
                  {selectedEvents.map(ev => (
                    <div key={ev.id} style={{
                      border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', padding: '14px 16px',
                      marginBottom: 10, borderLeft: `4px solid ${statusDotColors[ev.status]}`,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{ev.title}</div>
                        <StatusBadge status={ev.status} />
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--gray-500)', marginBottom: 6 }}>🐾 {ev.dogs}</div>
                      <div style={{ fontSize: 11, color: 'var(--gray-400)', fontFamily: 'monospace', marginBottom: 8 }}>{ev.referenceNumber}</div>
                      <Link to={`/admin/bookings/${ev.id}`} style={{ fontSize: 12, color: 'var(--green-700)', fontWeight: 600, textDecoration: 'none' }}>
                        View booking →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', padding: '32px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>📅</div>
              <p style={{ color: 'var(--gray-500)', fontSize: 14 }}>Click a day on the calendar to see bookings</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCalendar;
