import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const localizer = momentLocalizer(moment);

const CalendarManager = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('month');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://https://event-management-kvfo.onrender.com/api/contacts', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('bps_admin_token')}`
        }
      });
      const data = await res.json();

      if (data.success) {
        // Filter contacts that have an eventDate and format them for react-big-calendar
        const calendarEvents = data.data
          .filter(contact => contact.eventDate) // Only those with an event date
          .map(contact => {
            const date = new Date(contact.eventDate);
            return {
              id: contact._id,
              title: `${contact.firstName} ${contact.lastName} - ${contact.status}`,
              start: date,
              end: date, // Single day event by default
              allDay: true,
              resource: contact
            };
          });
        setEvents(calendarEvents);
      } else {
        toast.error('Failed to load events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Error connecting to server', {
        style: { background: 'var(--admin-bg-panel)', color: 'var(--admin-danger)', border: '1px solid var(--admin-danger)' }
      });
    } finally {
      setLoading(false);
    }
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = 'rgba(255, 255, 255, 0.1)';
    let borderLeft = '4px solid var(--admin-text-muted)';

    // Color code based on status
    if (event.resource.status === 'Completed') {
      backgroundColor = 'rgba(16, 185, 129, 0.15)';
      borderLeft = '4px solid var(--admin-success)';
    } else if (event.resource.status === 'Pending') {
      backgroundColor = 'rgba(212, 175, 55, 0.15)';
      borderLeft = '4px solid var(--admin-primary)';
    } else if (event.resource.status === 'Contacted') {
      backgroundColor = 'rgba(59, 130, 246, 0.15)';
      borderLeft = '4px solid #3b82f6';
    }

    const style = {
      backgroundColor,
      borderRadius: '4px',
      color: 'var(--admin-text-main)',
      border: 'none',
      borderLeft,
      display: 'block',
      padding: '4px 8px',
      fontSize: '12px',
      fontWeight: '600',
      backdropFilter: 'blur(4px)'
    };
    return { style };
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Loader2 className="animate-spin" size={32} color="var(--admin-primary)" />
        <p>Loading Calendar...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Event Calendar</h2>
        <p style={styles.subtitle}>View all upcoming events and booked leads</p>
      </div>

      <div className="admin-glass-panel" style={styles.calendarWrapper}>
        <style>
          {`
            .rbc-calendar {
              color: var(--admin-text-main);
              font-family: inherit;
            }
            .rbc-toolbar button {
              color: var(--admin-text-main);
              border: 1px solid rgba(255, 255, 255, 0.1);
              background: rgba(255, 255, 255, 0.02);
            }
            .rbc-toolbar button:active, .rbc-toolbar button.rbc-active {
              background: rgba(212, 175, 55, 0.1);
              border-color: rgba(212, 175, 55, 0.3);
              color: var(--admin-primary);
              box-shadow: none;
            }
            .rbc-toolbar button:hover {
              background: rgba(255, 255, 255, 0.05);
            }
            .rbc-month-view, .rbc-time-view, .rbc-agenda-view {
              border-color: rgba(255, 255, 255, 0.05);
            }
            .rbc-header {
              border-bottom: 1px solid rgba(255, 255, 255, 0.05);
              padding: 8px 0;
              font-weight: 600;
              color: var(--admin-text-muted);
            }
            .rbc-header + .rbc-header {
              border-left: 1px solid rgba(255, 255, 255, 0.05);
            }
            .rbc-month-row + .rbc-month-row {
              border-top: 1px solid rgba(255, 255, 255, 0.05);
            }
            .rbc-day-bg + .rbc-day-bg {
              border-left: 1px solid rgba(255, 255, 255, 0.05);
            }
            .rbc-off-range-bg {
              background: rgba(0, 0, 0, 0.2);
            }
            .rbc-today {
              background: rgba(212, 175, 55, 0.05);
            }
            .rbc-date-cell {
              padding: 4px 8px;
              font-weight: 500;
            }
            .rbc-event {
              padding: 0;
            }
            .rbc-agenda-view table.rbc-agenda-table {
              border: 1px solid rgba(255, 255, 255, 0.05);
            }
            .rbc-agenda-view table.rbc-agenda-table tbody > tr > td {
              border-top: 1px solid rgba(255, 255, 255, 0.05);
            }
            .rbc-agenda-view table.rbc-agenda-table tbody > tr > td + td {
              border-left: 1px solid rgba(255, 255, 255, 0.05);
            }
            .rbc-agenda-view table.rbc-agenda-table thead > tr > th {
              border-bottom: 1px solid rgba(255, 255, 255, 0.05);
              padding: 12px 8px;
            }
          `}
        </style>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '70vh' }}
          eventPropGetter={eventStyleGetter}
          views={['month', 'week', 'day', 'agenda']}
          date={currentDate}
          view={currentView}
          onNavigate={(newDate) => setCurrentDate(newDate)}
          onView={(newView) => setCurrentView(newView)}
          onSelectEvent={(event) => {
            toast(`Client: ${event.resource.firstName} ${event.resource.lastName}\nPhone: ${event.resource.phone}\nStatus: ${event.resource.status}`, {
              style: { background: 'var(--admin-bg-panel)', color: 'var(--admin-primary)', border: '1px solid rgba(212, 175, 55, 0.3)' }
            });
          }}
        />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  header: {
    marginBottom: '8px'
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--admin-text-main)',
    margin: '0 0 4px 0'
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--admin-text-muted)',
    margin: 0
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh',
    gap: '16px',
    color: 'var(--admin-text-muted)'
  },
  calendarWrapper: {
    padding: '24px',
  }
};

export default CalendarManager;
