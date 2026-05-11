import { useState, useEffect } from 'react';
import { rentPaymentsApi, tenantsApi, propertiesApi } from '../services/api';

const EMPTY = {
  tenantId: '', propertyId: '', amount: '', paymentDate: '',
  period: '', status: 'paid', paymentMethod: 'bank transfer', notes: '',
};

export default function RentPayments() {
  const [payments, setPayments] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    const [p, t, props] = await Promise.all([rentPaymentsApi.getAll(), tenantsApi.getAll(), propertiesApi.getAll()]);
    setPayments(p.data); setTenants(t.data); setProperties(props.data); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setEditing(null); setError(''); setShowModal(true); };
  const openEdit = (p) => {
    setForm({
      tenantId: p.tenantId?._id || p.tenantId || '',
      propertyId: p.propertyId?._id || p.propertyId || '',
      amount: p.amount, paymentDate: p.paymentDate?.slice(0, 10) || '',
      period: p.period, status: p.status, paymentMethod: p.paymentMethod, notes: p.notes || '',
    });
    setEditing(p._id); setError(''); setShowModal(true);
  };

  const f = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      editing ? await rentPaymentsApi.update(editing, form) : await rentPaymentsApi.create(form);
      setShowModal(false); load();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this payment?')) return;
    await rentPaymentsApi.remove(id); load();
  };

  if (loading) return <div className="loading">Loading…</div>;

  const total = payments.reduce((s, p) => s + p.amount, 0);

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Rent Payments</h2>
        <button className="btn btn-primary" onClick={openAdd}>+ Record Payment</button>
      </div>

      {payments.length > 0 && (
        <div className="summary-bar">Total collected: <strong>${total.toLocaleString()}</strong></div>
      )}

      {payments.length === 0 ? (
        <div className="empty-state">No payments recorded yet.</div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead><tr>
              <th>Tenant</th><th>Property</th><th>Amount</th>
              <th>Period</th><th>Date</th><th>Method</th><th>Status</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {payments.map(p => (
                <tr key={p._id}>
                  <td>{p.tenantId ? `${p.tenantId.firstName} ${p.tenantId.lastName}` : '—'}</td>
                  <td>{p.propertyId?.address || '—'}</td>
                  <td>${p.amount?.toLocaleString()}</td>
                  <td>{p.period}</td>
                  <td>{p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : '—'}</td>
                  <td>{p.paymentMethod}</td>
                  <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                  <td>
                    <button className="btn btn-sm btn-secondary" onClick={() => openEdit(p)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editing ? 'Edit Payment' : 'Record Payment'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              {error && <div className="error-msg">{error}</div>}
              <div className="form-row">
                <div className="form-group">
                  <label>Tenant *</label>
                  <select value={form.tenantId} onChange={f('tenantId')} required>
                    <option value="">Select tenant</option>
                    {tenants.map(t => <option key={t._id} value={t._id}>{t.firstName} {t.lastName}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Property *</label>
                  <select value={form.propertyId} onChange={f('propertyId')} required>
                    <option value="">Select property</option>
                    {properties.map(p => <option key={p._id} value={p._id}>{p.address}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Amount *</label><input type="number" value={form.amount} onChange={f('amount')} required /></div>
                <div className="form-group"><label>Period *</label><input placeholder="e.g. May 2025" value={form.period} onChange={f('period')} required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Payment Date *</label><input type="date" value={form.paymentDate} onChange={f('paymentDate')} required /></div>
                <div className="form-group">
                  <label>Method</label>
                  <select value={form.paymentMethod} onChange={f('paymentMethod')}>
                    {['bank transfer','check','cash','venmo','zelle','other'].map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <select value={form.status} onChange={f('status')}>
                    <option value="paid">Paid</option>
                    <option value="late">Late</option>
                    <option value="partial">Partial</option>
                  </select>
                </div>
              </div>
              <div className="form-group"><label>Notes</label><textarea value={form.notes} onChange={f('notes')} rows={2} /></div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Record'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
