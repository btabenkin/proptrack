import { useState, useEffect } from 'react';
import { propertiesApi } from '../services/api';

const EMPTY = {
  address: '', city: '', state: '', zip: '',
  bedrooms: '', bathrooms: '', squareFeet: '',
  purchasePrice: '', currentValue: '', status: 'available', purchaseDate: '',
};

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  const load = () => propertiesApi.getAll().then(r => { setProperties(r.data); setLoading(false); });
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setEditing(null); setError(''); setShowModal(true); };
  const openEdit = (p) => {
    setForm({
      address: p.address, city: p.city, state: p.state, zip: p.zip,
      bedrooms: p.bedrooms, bathrooms: p.bathrooms, squareFeet: p.squareFeet,
      purchasePrice: p.purchasePrice, currentValue: p.currentValue || '',
      status: p.status, purchaseDate: p.purchaseDate ? p.purchaseDate.slice(0, 10) : '',
    });
    setEditing(p._id); setError(''); setShowModal(true);
  };

  const f = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      editing ? await propertiesApi.update(editing, form) : await propertiesApi.create(form);
      setShowModal(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property?')) return;
    await propertiesApi.remove(id);
    load();
  };

  if (loading) return <div className="loading">Loading…</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Properties</h2>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Property</button>
      </div>

      {properties.length === 0 ? (
        <div className="empty-state">No properties yet. Add your first one!</div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead><tr>
              <th>Address</th><th>City</th><th>State</th>
              <th>Beds / Baths</th><th>Sq Ft</th><th>Purchase Price</th>
              <th>Status</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {properties.map(p => (
                <tr key={p._id}>
                  <td>{p.address}</td>
                  <td>{p.city}</td>
                  <td>{p.state}</td>
                  <td>{p.bedrooms} bd / {p.bathrooms} ba</td>
                  <td>{p.squareFeet?.toLocaleString()}</td>
                  <td>${p.purchasePrice?.toLocaleString()}</td>
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
              <h3>{editing ? 'Edit Property' : 'Add Property'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              {error && <div className="error-msg">{error}</div>}
              <div className="form-row">
                <div className="form-group"><label>Address *</label><input value={form.address} onChange={f('address')} required /></div>
                <div className="form-group"><label>City *</label><input value={form.city} onChange={f('city')} required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>State *</label><input value={form.state} onChange={f('state')} required /></div>
                <div className="form-group"><label>Zip *</label><input value={form.zip} onChange={f('zip')} required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Bedrooms *</label><input type="number" value={form.bedrooms} onChange={f('bedrooms')} required /></div>
                <div className="form-group"><label>Bathrooms *</label><input type="number" step="0.5" value={form.bathrooms} onChange={f('bathrooms')} required /></div>
                <div className="form-group"><label>Sq Ft *</label><input type="number" value={form.squareFeet} onChange={f('squareFeet')} required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Purchase Price *</label><input type="number" value={form.purchasePrice} onChange={f('purchasePrice')} required /></div>
                <div className="form-group"><label>Current Value</label><input type="number" value={form.currentValue} onChange={f('currentValue')} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Purchase Date</label><input type="date" value={form.purchaseDate} onChange={f('purchaseDate')} /></div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={form.status} onChange={f('status')}>
                    <option value="available">Available</option>
                    <option value="rented">Rented</option>
                    <option value="maintenance">Maintenance</option>
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
