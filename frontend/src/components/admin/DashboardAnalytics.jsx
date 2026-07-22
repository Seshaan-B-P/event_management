import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Calendar, Star, Phone, Activity, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const DashboardAnalytics = () => {
  const [dbHealthy, setDbHealthy] = useState('Checking...');
  const [stats, setStats] = useState({
    totalInquiries: 0,
    completedEvents: 0,
    pendingLeads: 0,
    inProgressLeads: 0,
    avgRating: 0
  });
  const [chartData, setChartData] = useState([]);
  const [recentReports, setRecentReports] = useState([]);

  useEffect(() => {
    // Check health
    fetch('http://https://event-management-kvfo.onrender.com/api/health')
      .then(res => res.json())
      .then(data => setDbHealthy(data.mockMode === false ? 'Online (MongoDB)' : 'Mock Mode'))
      .catch(() => setDbHealthy('Offline'));

    // Fetch real data for analytics
    const fetchAnalyticsData = async () => {
      try {
        const [contactsRes, reviewsRes, reportsRes] = await Promise.all([
          fetch('http://https://event-management-kvfo.onrender.com/api/contacts'),
          fetch('http://https://event-management-kvfo.onrender.com/api/reviews'),
          fetch('http://https://event-management-kvfo.onrender.com/api/reports')
        ]);
        const contactsData = await contactsRes.json();
        const reviewsData = await reviewsRes.json();
        const reportsData = await reportsRes.json();

        let contacts = [];
        let reviews = [];

        if (contactsData.success) contacts = contactsData.data;
        if (reviewsData.success) reviews = reviewsData.data;
        if (reportsData.success) setRecentReports(reportsData.data.slice(0, 5)); // show latest 5

        // Calculate Stats
        const totalInquiries = contacts.length;
        const completedEvents = contacts.filter(c => c.status === 'Completed').length;
        const pendingLeads = contacts.filter(c => c.status === 'Pending').length;
        const inProgressLeads = contacts.filter(c => c.status === 'Contacted').length;

        let avgRating = 0;
        if (reviews.length > 0) {
          const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
          avgRating = (totalRating / reviews.length).toFixed(1);
        }

        setStats({
          totalInquiries,
          completedEvents,
          pendingLeads,
          inProgressLeads,
          avgRating
        });

        // Calculate Chart Data (Past 6 Months)
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const newChartData = [];
        const today = new Date();

        for (let i = 5; i >= 0; i--) {
          const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
          const month = d.getMonth();
          const year = d.getFullYear();

          const monthInquiries = contacts.filter(c => {
            if (!c.createdAt) return false;
            const cDate = new Date(c.createdAt);
            return cDate.getMonth() === month && cDate.getFullYear() === year;
          }).length;

          const monthEvents = contacts.filter(c => {
            if (c.status !== 'Completed') return false;
            const eDate = c.eventDate ? new Date(c.eventDate) : (c.createdAt ? new Date(c.createdAt) : null);
            if (!eDate) return false;
            return eDate.getMonth() === month && eDate.getFullYear() === year;
          }).length;

          newChartData.push({
            name: monthNames[month],
            inquiries: monthInquiries,
            events: monthEvents
          });
        }
        setChartData(newChartData);

      } catch (err) {
        console.error('Error fetching analytics data:', err);
      }
    };

    fetchAnalyticsData();
  }, []);

  const generateDashboardPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(212, 175, 55);
    doc.text('BPS Event Management', 14, 20);

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Dashboard Analytics Report - ${new Date().toLocaleDateString()}`, 14, 28);

    // Stats Summary
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Performance Summary', 14, 40);

    const statsData = [
      ['Total Leads', stats.totalInquiries.toString()],
      ['Completed Events', stats.completedEvents.toString()],
      ['Pending Review', stats.pendingLeads.toString()],
      ['In Progress', stats.inProgressLeads.toString()],
      ['Average Rating', stats.avgRating.toString()]
    ];

    autoTable(doc, {
      startY: 45,
      head: [['Metric', 'Value']],
      body: statsData,
      theme: 'grid',
      headStyles: { fillColor: [30, 30, 30] },
      styles: { fontSize: 10 }
    });

    // Chart Data
    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 45;
    doc.text('Recent Monthly Trends', 14, finalY + 15);

    const trendData = chartData.map(d => [d.name, d.inquiries.toString(), d.events.toString()]);
    autoTable(doc, {
      startY: finalY + 20,
      head: [['Month', 'New Inquiries', 'Completed Events']],
      body: trendData,
      theme: 'striped',
      headStyles: { fillColor: [212, 175, 55], textColor: [0, 0, 0] }
    });

    doc.save('BPS_Analytics_Report.pdf');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button
          onClick={generateDashboardPDF}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--admin-primary)', backgroundColor: 'transparent', color: 'var(--admin-primary)', cursor: 'pointer', fontWeight: '500', marginRight: '16px' }}
        >
          <Download size={16} />
          Export Report (PDF)
        </button>
        <div style={styles.healthBadgeContainer}>
          <div style={styles.healthDot(dbHealthy)}></div>
          <span style={styles.healthText(dbHealthy)}>
            System Status: {dbHealthy}
          </span>
        </div>
      </div>

      <div style={styles.statsGrid}>
        <StatCard title="Total Leads" value={stats.totalInquiries} icon={Users} color="#3b82f6" />
        <StatCard title="Completed Events" value={stats.completedEvents} icon={Calendar} color="var(--admin-primary)" />
        <StatCard title="Pending Review" value={stats.pendingLeads} icon={Activity} color="#f59e0b" />
        <StatCard title="In Progress" value={stats.inProgressLeads} icon={TrendingUp} color="#10b981" />
        <StatCard title="Average Rating" value={stats.avgRating} icon={Star} color="#d4af37" />
      </div>

      <div className="admin-glass-panel" style={styles.chartContainer}>
        <div style={styles.chartHeader}>
          <h3 style={styles.chartTitle}>Performance Overview</h3>
          <p style={styles.chartSubtitle}>Inquiries vs Completed Events (Past 6 Months)</p>
        </div>
        <div style={{ width: '100%', height: 380, marginTop: '20px' }}>
          <ResponsiveContainer>
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorInq" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorEvt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--admin-primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--admin-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--admin-text-muted)', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--admin-text-muted)', fontSize: 12 }} dx={-10} />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid var(--admin-border)',
                  backgroundColor: 'rgba(15, 15, 15, 0.9)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
                  color: '#fff'
                }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="inquiries" name="New Inquiries" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorInq)" />
              <Area type="monotone" dataKey="events" name="Completed Events" stroke="var(--admin-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorEvt)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="admin-glass-panel" style={styles.chartContainer}>
        <div style={styles.chartHeader}>
          <h3 style={styles.chartTitle}>Recent Worker Reports</h3>
          <p style={styles.chartSubtitle}>Latest shift updates and incident reports from the field</p>
        </div>
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {recentReports.length === 0 ? (
            <p style={{ color: 'var(--admin-text-muted)' }}>No reports found.</p>
          ) : (
            recentReports.map(report => (
              <div key={report._id} style={{ padding: '16px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--admin-border)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: '600', color: 'var(--admin-text-main)' }}>{report.staffName}</span>
                    <span style={{
                      padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: '600',
                      backgroundColor: report.reportType === 'Incident' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(212, 175, 55, 0.1)',
                      color: report.reportType === 'Incident' ? 'var(--admin-danger)' : 'var(--admin-primary)'
                    }}>
                      {report.reportType}
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                    {new Date(report.createdAt).toLocaleString()}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--admin-text-muted)', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                  {report.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="admin-glass-panel" style={styles.statCard}>
    <div style={{ ...styles.iconWrapper, backgroundColor: `${color}15`, color: color, boxShadow: `0 0 15px ${color}20` }}>
      <Icon size={24} />
    </div>
    <div style={styles.statInfo}>
      <p style={styles.statTitle}>{title}</p>
      <h3 style={styles.statValue}>{value}</h3>
    </div>
  </div>
);

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
    position: 'relative',
    minHeight: '100%'
  },
  header: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  healthBadgeContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '30px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--admin-border)',
    backdropFilter: 'blur(10px)'
  },
  healthDot: (status) => ({
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: status.includes('Online') ? 'var(--admin-success)' : 'var(--admin-danger)',
    boxShadow: `0 0 10px ${status.includes('Online') ? 'var(--admin-success)' : 'var(--admin-danger)'}`
  }),
  healthText: (status) => ({
    fontSize: '13px',
    fontWeight: '500',
    color: status.includes('Online') ? 'var(--admin-success)' : 'var(--admin-danger)',
  }),
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '24px',
  },
  statCard: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    borderTop: '2px solid rgba(255, 255, 255, 0.05)',
  },
  iconWrapper: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '4px'
  },
  statInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  statTitle: {
    margin: 0,
    fontSize: '14px',
    color: 'var(--admin-text-muted)',
    fontWeight: '500'
  },
  statValue: {
    margin: 0,
    fontSize: '32px',
    fontWeight: '700',
    color: 'var(--admin-text-main)',
    letterSpacing: '-0.5px'
  },
  chartContainer: {
    padding: '32px',
    marginTop: '10px'
  },
  chartHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  chartTitle: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '600',
    color: 'var(--admin-text-main)'
  },
  chartSubtitle: {
    margin: 0,
    fontSize: '14px',
    color: 'var(--admin-text-muted)'
  }
};

export default DashboardAnalytics;
