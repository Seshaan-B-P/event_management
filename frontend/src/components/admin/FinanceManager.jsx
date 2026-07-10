import React, { useState, useEffect } from 'react';
import { IndianRupee, FileText, Download, Plus, Search, Filter, CheckCircle, AlertCircle, Clock, X } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';

const FinanceManager = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/contacts');
        const data = await res.json();
        if (data.success) {
          setContacts(data.data);
        }
      } catch (err) {
        toast.error('Failed to load financial data');
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'var(--admin-success)';
      case 'Partial':
      case 'Pending': return 'var(--admin-warning)';
      case 'Unpaid':
      case 'Overdue': return 'var(--admin-danger)';
      default: return 'var(--admin-text-muted)';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Paid': return <CheckCircle size={14} />;
      case 'Partial':
      case 'Pending': return <Clock size={14} />;
      case 'Unpaid':
      case 'Overdue': return <AlertCircle size={14} />;
      default: return null;
    }
  };

  // Calculate stats dynamically
  const totalRevenue = contacts.reduce((sum, c) => sum + (c.paidAmount || 0), 0);

  // Pending = total - paid for anyone not fully paid
  const pendingInvoices = contacts
    .filter(c => c.paymentStatus !== 'Paid')
    .reduce((sum, c) => sum + ((c.totalAmount || 0) - (c.paidAmount || 0)), 0);

  // Overdue = Unpaid/Partial for events that have already passed
  const overduePayments = contacts
    .filter(c => c.paymentStatus !== 'Paid' && c.eventDate && new Date(c.eventDate) < new Date())
    .reduce((sum, c) => sum + ((c.totalAmount || 0) - (c.paidAmount || 0)), 0);

  const stats = [
    { title: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: IndianRupee, color: 'var(--admin-primary)' },
    { title: 'Pending Payments', value: `₹${pendingInvoices.toLocaleString()}`, icon: Clock, color: 'var(--admin-warning)' },
    { title: 'Overdue Payments', value: `₹${overduePayments.toLocaleString()}`, icon: AlertCircle, color: 'var(--admin-danger)' }
  ];

  // Only show contacts with a totalAmount
  const invoiceContacts = contacts.filter(c => c.totalAmount > 0);

  const generateFinancePDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(212, 175, 55);
    doc.text('BPS Finance Report', 14, 20);

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);

    // Stats
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Financial Summary', 14, 40);

    const statsData = [
      ['Total Revenue', `Rs. ${totalRevenue.toLocaleString()}`],
      ['Pending Payments', `Rs. ${pendingInvoices.toLocaleString()}`],
      ['Overdue Payments', `Rs. ${overduePayments.toLocaleString()}`]
    ];

    autoTable(doc, {
      startY: 45,
      head: [['Metric', 'Amount']],
      body: statsData,
      theme: 'grid',
      headStyles: { fillColor: [30, 30, 30] }
    });

    // Transactions Table
    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 45;
    doc.text('Invoice Details', 14, finalY + 15);

    const tableData = invoiceContacts.map(c => [
      c.name,
      c.eventDate ? new Date(c.eventDate).toLocaleDateString() : 'N/A',
      `Rs. ${c.totalAmount || 0}`,
      `Rs. ${c.paidAmount || 0}`,
      c.paymentStatus || 'Unpaid'
    ]);

    autoTable(doc, {
      startY: finalY + 20,
      head: [['Client', 'Event Date', 'Total Amount', 'Paid Amount', 'Status']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [212, 175, 55], textColor: [0, 0, 0] }
    });

    doc.save('BPS_Finance_Report.pdf');
  };

  const generateClientInvoice = (contact) => {
    const doc = new jsPDF();
    const invoiceId = `INV-${contact._id.substring(contact._id.length - 6).toUpperCase()}`;
    const date = new Date().toLocaleDateString();

    // Top Banner
    doc.setFillColor(212, 175, 55); // Gold
    doc.rect(0, 0, 210, 40, 'F'); // A4 is 210mm wide

    // Company Header
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255); 
    doc.text('BPS EVENTS', 14, 26);
    
    // Invoice Title on right
    doc.setFontSize(24);
    doc.text('INVOICE', 196, 26, { align: 'right' });

    // Reset styles
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);

    // Company Details
    doc.setFontSize(10);
    doc.text('25,S.P.Colony, Vengamedu', 14, 50);
    doc.text('Karur, 639006, Tamil Nadu, India', 14, 55);
    doc.text('Phone: +91 8124931018', 14, 60);
    doc.text('Email: bpsevents@gmail.com', 14, 65);

    // Invoice Meta (Right side)
    doc.setFont('helvetica', 'bold');
    doc.text('Invoice Number:', 140, 50);
    doc.text('Date:', 140, 55);
    doc.text('Status:', 140, 60);
    
    doc.setFont('helvetica', 'normal');
    doc.text(invoiceId, 170, 50);
    doc.text(date, 170, 55);
    
    // Status color
    if (contact.paymentStatus === 'Paid') {
      doc.setTextColor(16, 185, 129); // Green
    } else if (contact.paymentStatus === 'Partial') {
      doc.setTextColor(245, 158, 11); // Orange
    } else {
      doc.setTextColor(239, 68, 68); // Red
    }
    doc.setFont('helvetica', 'bold');
    doc.text(contact.paymentStatus || 'Unpaid', 170, 60);

    doc.setTextColor(80, 80, 80); // Reset

    // Billed To Box
    doc.setDrawColor(230, 230, 230);
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(14, 75, 90, 45, 3, 3, 'FD'); // x, y, w, h, rx, ry, style
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    doc.text('Billed To:', 19, 85);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`${contact.firstName} ${contact.lastName}`, 19, 93);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Email: ${contact.email}`, 19, 100);
    doc.text(`Phone: ${contact.phone}`, 19, 107);
    doc.text(`Event Date: ${contact.eventDate || 'N/A'}`, 19, 114);

    // Line Items Table
    autoTable(doc, {
      startY: 130,
      head: [['Description', 'Amount']],
      body: [
        [`Event Services for ${contact.firstName} ${contact.lastName}`, `Rs. ${contact.totalAmount.toLocaleString()}`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [30, 30, 30], textColor: [212, 175, 55], fontStyle: 'bold' },
      bodyStyles: { textColor: [50, 50, 50], fontSize: 11 },
      columnStyles: { 1: { halign: 'right', fontStyle: 'bold' } },
      alternateRowStyles: { fillColor: [249, 249, 249] }
    });

    // Totals Box
    const finalY = doc.lastAutoTable.finalY;
    const balance = contact.totalAmount - (contact.paidAmount || 0);

    // Draw lines for totals
    doc.setDrawColor(200, 200, 200);
    doc.line(120, finalY + 10, 196, finalY + 10);
    
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.setFont('helvetica', 'normal');
    doc.text('Total Amount:', 125, finalY + 18);
    doc.text(`Rs. ${contact.totalAmount.toLocaleString()}`, 196, finalY + 18, { align: 'right' });

    doc.text('Amount Paid:', 125, finalY + 26);
    doc.text(`Rs. ${(contact.paidAmount || 0).toLocaleString()}`, 196, finalY + 26, { align: 'right' });

    doc.setDrawColor(200, 200, 200);
    doc.line(120, finalY + 32, 196, finalY + 32);

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Balance Due:', 125, finalY + 40);
    
    doc.setTextColor(212, 175, 55); // Gold
    doc.text(`Rs. ${balance.toLocaleString()}`, 196, finalY + 40, { align: 'right' });

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(1);
    doc.line(14, pageHeight - 30, 196, pageHeight - 30);
    
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Thank you for choosing BPS Events!', 105, pageHeight - 20, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.text('www.bpsevents.com', 105, pageHeight - 14, { align: 'center' });

    doc.save(`${invoiceId}.pdf`);
    toast.success('Invoice downloaded successfully');
  };

  return (
    <div style={{ padding: '24px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0' }}>Finance & Invoicing</h1>
          <p style={{ color: 'var(--admin-text-muted)', margin: 0 }}>Revenue and payment tracking synchronized with CRM Leads.</p>
        </div>
        <button
          onClick={generateFinancePDF}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--admin-primary)', backgroundColor: 'transparent', color: 'var(--admin-primary)', cursor: 'pointer', fontWeight: '600' }}
        >
          <Download size={18} />
          Export Report (PDF)
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {stats.map((stat, index) => (
          <div key={index} style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--admin-border)',
            borderRadius: '16px', padding: '24px', backdropFilter: 'blur(10px)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                backgroundColor: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color
              }}>
                <stat.icon size={20} />
              </div>
            </div>
            <h3 style={{ fontSize: '14px', color: 'var(--admin-text-muted)', margin: '0 0 8px 0', fontWeight: '500' }}>{stat.title}</h3>
            <p style={{ fontSize: '28px', fontWeight: '700', margin: 0 }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Invoices List */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--admin-border)',
        borderRadius: '16px', overflow: 'hidden'
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Recent Invoices</h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--admin-text-muted)' }} />
              <input
                type="text"
                placeholder="Search invoices..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  padding: '8px 12px 8px 36px', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid var(--admin-border)',
                  borderRadius: '8px', color: 'var(--admin-text-main)', fontSize: '14px', outline: 'none'
                }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid var(--admin-border)', borderRadius: '8px', padding: '0 12px' }}>
              <Filter size={16} style={{ color: 'var(--admin-text-main)', marginRight: '8px' }} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  background: 'transparent', border: 'none', color: 'var(--admin-text-main)',
                  padding: '8px 0', outline: 'none', cursor: 'pointer', fontSize: '14px'
                }}
              >
                <option value="All" style={{ background: '#1E1E1E' }}>All Statuses</option>
                <option value="Paid" style={{ background: '#1E1E1E' }}>Paid</option>
                <option value="Pending" style={{ background: '#1E1E1E' }}>Pending</option>
                <option value="Partial" style={{ background: '#1E1E1E' }}>Partial</option>
                <option value="Unpaid" style={{ background: '#1E1E1E' }}>Unpaid</option>
                <option value="Overdue" style={{ background: '#1E1E1E' }}>Overdue</option>
              </select>
            </div>          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(0,0,0,0.2)', textAlign: 'left' }}>
              <th style={{ padding: '16px 24px', color: 'var(--admin-text-muted)', fontWeight: '500', fontSize: '13px' }}>Invoice ID</th>
              <th style={{ padding: '16px 24px', color: 'var(--admin-text-muted)', fontWeight: '500', fontSize: '13px' }}>Client</th>
              <th style={{ padding: '16px 24px', color: 'var(--admin-text-muted)', fontWeight: '500', fontSize: '13px' }}>Date</th>
              <th style={{ padding: '16px 24px', color: 'var(--admin-text-muted)', fontWeight: '500', fontSize: '13px' }}>Amount</th>
              <th style={{ padding: '16px 24px', color: 'var(--admin-text-muted)', fontWeight: '500', fontSize: '13px' }}>Status</th>
              <th style={{ padding: '16px 24px', color: 'var(--admin-text-muted)', fontWeight: '500', fontSize: '13px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>Loading financial data...</td></tr>
            ) : invoiceContacts.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>No leads with amounts found.</td></tr>
            ) : invoiceContacts
              .filter(c => statusFilter === 'All' || c.paymentStatus === statusFilter)
              .filter(c => `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) || c._id.toLowerCase().includes(search.toLowerCase()))
              .map((contact) => (
                <tr key={contact._id} style={{ borderBottom: '1px solid var(--admin-border)' }}>
                  <td style={{ padding: '16px 24px', fontWeight: '500' }}>INV-{contact._id.substring(contact._id.length - 6).toUpperCase()}</td>
                  <td style={{ padding: '16px 24px' }}>{contact.firstName} {contact.lastName}</td>
                  <td style={{ padding: '16px 24px', color: 'var(--admin-text-muted)' }}>{contact.eventDate || new Date(contact.createdAt).toISOString().split('T')[0]}</td>
                  <td style={{ padding: '16px 24px', fontWeight: '600' }}>
                    ₹{contact.totalAmount?.toLocaleString()}
                    {contact.paidAmount > 0 && contact.paidAmount < contact.totalAmount && (
                      <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)', fontWeight: '400' }}>
                        Paid: ₹{contact.paidAmount.toLocaleString()}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px',
                      backgroundColor: `${getStatusColor(contact.paymentStatus)}15`, color: getStatusColor(contact.paymentStatus),
                      borderRadius: '20px', fontSize: '12px', fontWeight: '600'
                    }}>
                      {getStatusIcon(contact.paymentStatus)}
                      {contact.paymentStatus}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button
                      onClick={() => generateClientInvoice(contact)}
                      style={{
                        background: 'none', border: 'none', color: 'var(--admin-text-muted)', cursor: 'pointer',
                        padding: '4px'
                      }} title="Download Invoice">
                      <Download size={18} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default FinanceManager;
