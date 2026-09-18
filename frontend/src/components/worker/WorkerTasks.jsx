import { API_BASE_URL } from '../../config';
import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, CheckCircle, Clock, AlertCircle, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import TiltCard3D from '../TiltCard3D';
import Worker3DProgressRing from './Worker3DProgressRing';

const WorkerTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const username = localStorage.getItem('bps_staff_username');

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/tasks`);
      const data = await res.json();
      if (data.success) {
        // Filter tasks assigned to this worker (exact username match or partial legacy match)
        const myTasks = data.data.filter(t =>
          t.assignee && (
            t.assignee.toLowerCase() === (username || '').toLowerCase() ||
            (username || '').toLowerCase().includes(t.assignee.toLowerCase())
          )
        );
        setTasks(myTasks);
      }
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 5000); // Poll for new assignments/updates
    return () => clearInterval(interval);
  }, [fetchTasks]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Task marked as ${newStatus}`);
        setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
      } else {
        toast.error('Failed to update task');
      }
    } catch (err) {
      toast.error('Server error while updating task');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Done': return 'var(--admin-success)';
      case 'In Progress': return 'var(--admin-warning)';
      default: return 'var(--admin-text-muted)';
    }
  };

  const workerRole = localStorage.getItem('bps_staff_role') || 'Field Specialist';
  const completedCount = tasks.filter(t => t.status === 'Done').length;

  return (
    <div className="admin-animate-fade" style={styles.container}>
      {/* 3D Holographic Shift & Progress Ring */}
      <div style={{ marginBottom: '24px' }}>
        <Worker3DProgressRing
          totalTasks={tasks.length}
          completedTasks={completedCount}
          workerName={username || 'Worker'}
          role={workerRole}
        />
      </div>

      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Assigned Duty Roster</h2>
          <p style={styles.subtitle}>Execute and update your event operations tasks in real-time</p>
        </div>
        <div style={styles.statsContainer}>
          <div style={styles.statBadge}>
            <span style={{ color: 'var(--admin-primary)', fontWeight: 'bold' }}>{tasks.length}</span> Total
          </div>
          <div style={styles.statBadge}>
            <span style={{ color: 'var(--admin-success)', fontWeight: 'bold' }}>{completedCount}</span> Done
          </div>
        </div>
      </div>

      <div style={styles.content}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <Loader2 size={32} className="admin-spin" style={{ color: 'var(--admin-primary)' }} />
          </div>
        ) : tasks.length === 0 ? (
          <div className="admin-glass-panel" style={styles.emptyState}>
            <CheckCircle size={48} style={{ opacity: 0.3, marginBottom: '16px', color: 'var(--admin-success)' }} />
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>You're all caught up!</h3>
            <p style={{ color: 'var(--admin-text-muted)', margin: 0 }}>There are no tasks assigned to you right now.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {tasks.map(task => {
              const isDone = task.status === 'Done';
              return (
                <TiltCard3D key={task._id} maxTilt={7} scale={1.02} glare={true} style={{ height: '100%' }}>
                  <div
                    className="stat-card-tilt"
                    style={{
                      ...styles.taskCard,
                      borderLeft: `4px solid ${getStatusColor(task.status)}`,
                      opacity: isDone ? 0.82 : 1,
                    }}
                  >
                    <div style={styles.taskHeader}>
                      <h3 style={{
                        ...styles.taskTitle,
                        textDecoration: isDone ? 'line-through' : 'none',
                        color: isDone ? 'var(--admin-text-muted)' : 'var(--admin-text-main)'
                      }}>
                        {task.title}
                      </h3>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: isDone ? 'rgba(16, 185, 129, 0.15)' :
                          task.status === 'In Progress' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255,255,255,0.05)',
                        color: getStatusColor(task.status),
                        border: `1px solid ${isDone ? 'rgba(16, 185, 129, 0.3)' :
                          task.status === 'In Progress' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(255,255,255,0.1)'}`
                      }}>
                        {task.status}
                      </span>
                    </div>

                    <p style={styles.taskDesc}>{task.description || 'No description provided.'}</p>

                    {task.contactId && (
                      <div style={styles.contactInfo}>
                        <AlertCircle size={14} /> Related to event for {task.contactId.name || 'Client'}
                      </div>
                    )}

                    <div style={styles.taskFooter}>
                      <div style={styles.timeInfo}>
                        <Clock size={14} /> {new Date(task.createdAt).toLocaleDateString()}
                      </div>

                      <div style={styles.actions}>
                        {/* Tactile 1-Click Complete Toggle */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(task._id, isDone ? 'Todo' : 'Done')}
                          className="tactile-press"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            backgroundColor: isDone ? 'rgba(16, 185, 129, 0.15)' : 'rgba(212, 175, 55, 0.12)',
                            color: isDone ? 'var(--admin-success)' : 'var(--admin-primary)',
                            border: `1px solid ${isDone ? 'rgba(16, 185, 129, 0.3)' : 'rgba(212, 175, 55, 0.3)'}`,
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}
                        >
                          <Check size={14} />
                          {isDone ? 'Completed' : 'Mark Done'}
                        </button>

                        <select
                          value={task.status}
                          onChange={(e) => handleStatusChange(task._id, e.target.value)}
                          style={styles.statusSelect}
                        >
                          <option value="Todo">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Done">Done</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </TiltCard3D>
              );
            })}
          </div>
        )}
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px'
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
  statsContainer: {
    display: 'flex',
    gap: '12px'
  },
  statBadge: {
    padding: '8px 16px',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    border: '1px solid rgba(212, 175, 55, 0.2)',
    borderRadius: '20px',
    fontSize: '13px',
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  },
  content: {
    flex: 1,
  },
  emptyState: {
    padding: '60px 40px',
    textAlign: 'center',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px'
  },
  taskCard: {
    padding: '24px',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    backgroundColor: 'var(--admin-bg-panel)',
    transition: 'transform 0.2s',
  },
  taskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px'
  },
  taskTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--admin-text-main)',
    lineHeight: '1.4'
  },
  statusBadge: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600',
    whiteSpace: 'nowrap'
  },
  taskDesc: {
    margin: 0,
    fontSize: '13px',
    color: 'var(--admin-text-muted)',
    lineHeight: '1.6',
    flex: 1
  },
  contactInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: 'var(--admin-primary)',
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
    padding: '8px 12px',
    borderRadius: '8px'
  },
  taskFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: '16px',
    borderTop: '1px solid rgba(255,255,255,0.05)'
  },
  timeInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: 'var(--admin-text-muted)'
  },
  statusSelect: {
    padding: '6px 12px',
    backgroundColor: '#1a1a1a',
    border: '1px solid var(--admin-border)',
    borderRadius: '6px',
    color: 'white',
    fontSize: '12px',
    cursor: 'pointer',
    outline: 'none'
  }
};

export default WorkerTasks;
