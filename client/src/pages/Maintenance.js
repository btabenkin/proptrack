import { useState, useEffect } from 'react';
import { maintenanceApi, propertiesApi, tenantsApi } from '../services/api';

const EMPTY = { propertyId: '', tenantId: '', title: '', description: '', status: 'open', priority: 'medium' };

export default function Maintenance() {
  const [requests, setRequests] = useState([]);
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    const [m, p, t] = await Promise.all([maintenanceApi.getAll(), propertiesApi.getAll(), tenantsApi.getAll()]);
    setRequests(m.data); setProperties(p.data); setTenants(t.data); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setEditing(null); setError(''); setShowModal(true); };
  const openEdit = (r) => {
    setForm({
      propertyId: r.propertyId?._id || r.propertyId || '',
      tenantId: r.tenantId?._id || r.tenantId || '',
      title: r.title, description: r.description, status: r.status, priority: r.priority,
    });
    setEditing(r._id); setError(''); setShowModal(true);
  };

  const f = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form, tenantId: form.tenantId || undefined };
      editing ? await maintenanceApi.update(editing, data) : await maintenanceApi.create(data);
      setShowModal(false); load();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this request?')) return;
    await maintenanceApi.remove(id); load();
  };

  if (loading) return <div className="loading">Loading…</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Maintenance</h2>
        <button className="btn btn-primary" onClick={openAdd}>+ New Request</button>
      </div>

      {requests.length === 0 ? (
        <div className="empty-state">No maintenance requests.</div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead><tr>
              <th>Title</th><th>Property</th><th>Tenant</th>
              <th>Priority</th><th>Status</th><th>Created</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {requests.map(r => (
                <tr key={r._id}>
                  <td>{r.title}</td>
                  <td>{r.propertyId?.address || '—'}</td>
                  <td>{r.tenantId ? `${r.tenantId.firstName} ${r.tenantId.lastName}` : '—'}</td>
                  <td><span className={`badge badge-priority-${r.priority}`}>{r.priority}</span></td>
                  <td><span className={`badge badge-${r.status}`}>{r.status}</span></td>
                  <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-sm btn-secondary" onClick={() => openEdit(r)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(r._id)}>Delete</button>
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
              <h3>{editing ? 'Edit Request' : 'New Maintenance Request'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              {error && <div className="error-msg">{error}</div>}
              <div className="form-row">
                <div className="form-group">
                  <label>Property *</label>
                  <select value={form.propertyId} onChange={f('propertyId')} required>
                    <option value="">Select property</option>
                    {properties.map(p => <option key={p._id} value={p._id}>{p.address}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Tenant (optional)</label>
                  <select value={form.tenantId} onChange={f('tenantId')}>
                    <option value="">None</option>
                    {tenants.map(t => <option key={t._id} value={t._id}>{t.firstName} {t.lastName}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group"><label>Title *</label><input value={form.title} onChange={f('title')} required /></div>
              <div className="form-group"><label>Description *</label><textarea value={form.description} onChange={f('description')} rows={3} required /></div>
              <div className="form-row">
                <div className="form-group">
                  <label>Priority</label>
                  <select value={form.priority} onChange={f('priority')}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={form.status} onChange={f('status')}>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
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
