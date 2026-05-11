import { useState, useEffect } from 'react';
import { tenantsApi, propertiesApi } from '../services/api';

const EMPTY = {
  propertyId: '', firstName: '', lastName: '', email: '',
  phone: '', leaseStart: '', leaseEnd: '', monthlyRent: '',
  securityDeposit: '', status: 'active',
};

export default function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    const [t, p] = await Promise.all([tenantsApi.getAll(), propertiesApi.getAll()]);
    setTenants(t.data); setProperties(p.data); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setEditing(null); setError(''); setShowModal(true); };
  const openEdit = (t) => {
    setForm({
      propertyId: t.propertyId?._id || t.propertyId || '',
      firstName: t.firstName, lastName: t.lastName, email: t.email, phone: t.phone,
      leaseStart: t.leaseStart?.slice(0, 10) || '',
      leaseEnd: t.leaseEnd?.slice(0, 10) || '',
      monthlyRent: t.monthlyRent, securityDeposit: t.securityDeposit || '', status: t.status,
    });
    setEditing(t._id); setError(''); setShowModal(true);
  };

  const f = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      editing ? await tenantsApi.update(editing, form) : await tenantsApi.create(form);
      setShowModal(false); load();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this tenant?')) return;
    await tenantsApi.remove(id); load();
  };

  if (loading) return <div className="loading">Loading…</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Tenants</h2>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Tenant</button>
      </div>

      {tenants.length === 0 ? (
        <div className="empty-state">No tenants yet.</div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead><tr>
              <th>Name</th><th>Property</th><th>Email</th><th>Phone</th>
              <th>Lease End</th><th>Monthly Rent</th><th>Status</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {tenants.map(t => (
                <tr key={t._id}>
                  <td>{t.firstName} {t.lastName}</td>
                  <td>{t.propertyId?.address || '—'}</td>
                  <td>{t.email}</td>
                  <td>{t.phone}</td>
                  <td>{t.leaseEnd ? new Date(t.leaseEnd).toLocaleDateString() : '—'}</td>
                  <td>${t.monthlyRent?.toLocaleString()}</td>
                  <td><span className={`badge badge-${t.status}`}>{t.status}</span></td>
                  <td>
                    <button className="btn btn-sm btn-secondary" onClick={() => openEdit(t)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(t._id)}>Delete</button>
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
              <h3>{editing ? 'Edit Tenant' : 'Add Tenant'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              {error && <div className="error-msg">{error}</div>}
              <div className="form-group">
                <label>Property *</label>
                <select value={form.propertyId} onChange={f('propertyId')} required>
                  <option value="">Select a property</option>
                  {properties.map(p => <option key={p._id} value={p._id}>{p.address}, {p.city}</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group"><label>First Name *</label><input value={form.firstName} onChange={f('firstName')} required /></div>
                <div className="form-group"><label>Last Name *</label><input value={form.lastName} onChange={f('lastName')} required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Email *</label><input type="email" value={form.email} onChange={f('email')} required /></div>
                <div className="form-group"><label>Phone *</label><input value={form.phone} onChange={f('phone')} required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Lease Start *</label><input type="date" value={form.leaseStart} onChange={f('leaseStart')} required /></div>
                <div className="form-group"><label>Lease End *</label><input type="date" value={form.leaseEnd} onChange={f('leaseEnd')} required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Monthly Rent *</label><input type="number" value={form.monthlyRent} onChange={f('monthlyRent')} required /></div>
                <div className="form-group"><label>Security Deposit</label><input type="number" value={form.securityDeposit} onChange={f('securityDeposit')} /></div>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={form.status} onChange={f('status')}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="evicted">Evicted</option>
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
