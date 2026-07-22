import { API_BASE_URL } from '../../config';
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar as CalendarIcon, User } from 'lucide-react';
import toast from 'react-hot-toast';

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', contactId: '', assignee: '' });

  const API_URL = `${API_BASE_URL}/api/tasks`;
  const CONTACTS_API = `${API_BASE_URL}/api/contacts`;
  const STAFF_API = `${API_BASE_URL}/api/staff`;

  useEffect(() => {
    fetchTasks();
    fetchContacts();
    fetchStaff();

    // Poll for background task updates (e.g. completed by worker)
    const interval = setInterval(fetchTasks, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data.success) setTasks(data.data);
    } catch (err) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async () => {
    try {
      const res = await fetch(CONTACTS_API);
      const data = await res.json();
      if (data.success) {
        // Only get contacts with upcoming events
        setContacts(data.data.filter(c => c.status !== 'Completed'));
      }
    } catch (err) {
      console.error('Failed to fetch contacts');
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await fetch(STAFF_API);
      const data = await res.json();
      if (data.success) {
        setStaffList(data.data.filter(s => s.status === 'Active'));
      }
    } catch (err) {
      console.error('Failed to fetch staff');
    }
  };

  const onDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const onDragOver = (e) => {
    e.preventDefault(); // allow drop
  };

  const onDrop = async (e, newStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks.find(t => t._id === taskId);
    if (!task || task.status === newStatus) return;

    // Optimistic UI update
    setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));

    try {
      const res = await fetch(`${API_URL}/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (!data.success) {
        toast.error('Failed to update status');
        fetchTasks(); // Revert
      }
    } catch (err) {
      toast.error('Server error');
      fetchTasks(); // Revert
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Task added');
        setTasks([data.data, ...tasks]);
        setIsAdding(false);
        setNewTask({ title: '', description: '', contactId: '', assignee: '' });
      } else {
        toast.error('Failed to add task');
      }
    } catch (err) {
      toast.error('Server error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Task deleted');
        setTasks(tasks.filter(t => t._id !== id));
      } else {
        toast.error('Failed to delete');
      }
    } catch (err) {
      toast.error('Server error');
    }
  };

  const getContactName = (contactOrId) => {
    if (!contactOrId) return null;
    if (typeof contactOrId === 'object') return `${contactOrId.firstName || ''} ${contactOrId.lastName || ''}`.trim();
    const contact = contacts.find(c => c._id === contactOrId);
    return contact ? `${contact.firstName || ''} ${contact.lastName || ''}`.trim() : null;
  };

  const getStaffNameByUsername = (username) => {
    if (!username) return null;
    const staff = staffList.find(s => s.username === username);
    return staff ? staff.name : username;
  };

  const columns = ['Todo', 'In Progress', 'Done'];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Event Task Board</h2>
          <p style={styles.subtitle}>Drag and drop tasks to manage your workflow</p>
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className="admin-btn admin-btn-primary">
          <Plus size={18} /> Add Task
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddTask} className="admin-glass-panel" style={styles.addForm}>
          <div style={styles.formGrid}>
            <input
              required
              className="admin-input"
              placeholder="Task Title *"
              value={newTask.title}
              onChange={e => setNewTask({ ...newTask, title: e.target.value })}
            />
            <select
              className="admin-input"
              value={newTask.contactId}
              onChange={e => setNewTask({ ...newTask, contactId: e.target.value })}
            >
              <option value="">-- Link to an Event (Optional) --</option>
              {contacts.map(c => (
                <option key={c._id} value={c._id}>{c.firstName} {c.lastName}</option>
              ))}
            </select>
            <select
              className="admin-input"
              value={newTask.assignee}
              onChange={e => setNewTask({ ...newTask, assignee: e.target.value })}
            >
              <option value="">-- Assign to Staff (Optional) --</option>
              {staffList.map(s => (
                <option key={s._id} value={s.username}>{s.name} ({s.role})</option>
              ))}
            </select>
            <input
              className="admin-input"
              placeholder="Description"
              value={newTask.description}
              onChange={e => setNewTask({ ...newTask, description: e.target.value })}
            />
          </div>
          <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
            <button type="submit" className="admin-btn admin-btn-primary">Save Task</button>
            <button type="button" onClick={() => setIsAdding(false)} className="admin-btn admin-btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <div style={styles.loadingContainer}>
          <p>Loading tasks...</p>
        </div>
      ) : (
        <div className="admin-scroll" style={styles.board}>
          {columns.map(colStatus => (
            <div
              key={colStatus}
              className="admin-glass-panel"
              style={styles.column}
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, colStatus)}
            >
              <div style={styles.columnHeader}>
                <h3 style={styles.columnTitle}>{colStatus}</h3>
                <span style={styles.taskCount}>{tasks.filter(t => t.status === colStatus).length}</span>
              </div>

              <div className="admin-scroll" style={styles.taskList}>
                {tasks.filter(t => t.status === colStatus).map(task => (
                  <div
                    key={task._id}
                    style={styles.taskCard}
                    draggable
                    onDragStart={(e) => onDragStart(e, task._id)}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--admin-primary)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--admin-border)'}
                  >
                    <div style={styles.taskHeader}>
                      <h4 style={styles.taskTitle}>{task.title}</h4>
                      <button
                        onClick={() => handleDelete(task._id)}
                        style={styles.deleteBtn}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--admin-danger)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--admin-text-muted)'}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    {task.description && <p style={styles.taskDesc}>{task.description}</p>}

                    <div style={styles.taskFooter}>
                      {getContactName(task.contactId) ? (
                        <span style={styles.tag} title="Linked Event">
                          <CalendarIcon size={12} /> {getContactName(task.contactId)}
                        </span>
                      ) : (
                        <span style={{ ...styles.tag, visibility: 'hidden' }}>No Event</span>
                      )}

                      {task.assignee && (
                        <span style={styles.tag} title="Assignee">
                          <User size={12} /> {getStaffNameByUsername(task.assignee)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    height: '100%'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
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
  addForm: {
    padding: '20px',
    marginBottom: '24px'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px'
  },
  board: {
    display: 'flex',
    gap: '24px',
    flex: 1,
    minHeight: '400px',
    overflowX: 'auto',
    paddingBottom: '16px'
  },
  column: {
    flex: 1,
    minWidth: '320px',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '70vh'
  },
  columnHeader: {
    padding: '16px 20px',
    borderBottom: '1px solid var(--admin-border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  columnTitle: {
    margin: 0,
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--admin-text-main)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  taskCount: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    color: 'var(--admin-primary)',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    border: '1px solid rgba(212, 175, 55, 0.2)'
  },
  taskList: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    flex: 1,
    overflowY: 'auto'
  },
  taskCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid var(--admin-border)',
    cursor: 'grab',
    transition: 'all 0.2s ease'
  },
  taskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px'
  },
  taskTitle: {
    margin: 0,
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--admin-text-main)'
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--admin-text-muted)',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s'
  },
  taskDesc: {
    fontSize: '13px',
    color: 'var(--admin-text-muted)',
    margin: '0 0 16px 0',
    lineHeight: '1.5'
  },
  taskFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '8px'
  },
  tag: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: 'var(--admin-text-muted)',
    padding: '4px 8px',
    borderRadius: '6px',
    border: '1px solid var(--admin-border)',
    fontWeight: '500'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '400px',
    gap: '16px',
    color: 'var(--admin-text-muted)'
  }
};

export default KanbanBoard;
