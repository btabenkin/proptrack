import { useState, useEffect } from 'react';
import { expensesApi, propertiesApi } from '../services/api';

const EMPTY = { propertyId: '', category: 'maintenance', amount: '', date: '', description: '', vendor: '' };
const CATEGORIES = ['maintenance', 'taxes', 'insurance', 'utilities', 'repairs', 'other'];

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    const [e, p] = await Promise.all([expensesApi.getAll(), propertiesApi.getAll()]);
    setExpenses(e.data); setProperties(p.data); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setEditing(null); setError(''); setShowModal(true); };
  const openEdit = (e) => {
    setForm({
      propertyId: e.propertyId?._id || e.propertyId || '',
      category: e.category, amount: e.amount,
      date: e.date?.slice(0, 10) || '', description: e.description, vendor: e.vendor || '',
    });
    setEditing(e._id); setError(''); setShowModal(true);
  };

  const f = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    try {
      editing ? await expensesApi.update(editing, form) : await expensesApi.create(form);
      setShowModal(false); load();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    await expensesApi.remove(id); load();
  };

  if (loading) return <div className="loading">Loading…</div>;

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Expenses</h2>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Expense</button>
      </div>

      {expenses.length > 0 && (
        <div className="summary-bar">Total expenses: <strong>${total.toLocaleString()}</strong></div>
      )}

      {expenses.length === 0 ? (
        <div className="empty-state">No expenses recorded yet.</div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead><tr>
              <th>Property</th><th>Category</th><th>Amount</th>
              <th>Date</th><th>Description</th><th>Vendor</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {expenses.map(e => (
                <tr key={e._id}>
                  <td>{e.propertyId?.address || '—'}</td>
                  <td><span className="badge badge-category">{e.category}</span></td>
                  <td>${e.amount?.toLocaleString()}</td>
                  <td>{e.date ? new Date(e.date).toLocaleDateString() : '—'}</td>
                  <td>{e.description}</td>
                  <td>{e.vendor || '—'}</td>
                  <td>
                    <button className="btn btn-sm btn-secondary" onClick={() => openEdit(e)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(e._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={ev => ev.stopPropagation()}>
            <div className="modal-header">
              <h3>{editing ? 'Edit Expense' : 'Add Expense'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              {error && <div className="error-msg">{error}</div>}
              <div className="form-group">
                <label>Property *</label>
                <select value={form.propertyId} onChange={f('propertyId')} required>
                  <option value="">Select property</option>
                  {properties.map(p => <option key={p._id} value={p._id}>{p.address}, {p.city}</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select value={form.category} onChange={f('category')}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Amount *</label><input type="number" value={form.amount} onChange={f('amount')} required /></div>
                <div className="form-group"><label>Date *</label><input type="date" value={form.date} onChange={f('date')} required /></div>
              </div>
              <div className="form-group"><label>Description *</label><input value={form.description} onChange={f('description')} required /></div>
              <div className="form-group"><label>Vendor</label><input value={form.vendor} onChange={f('vendor')} /></div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
