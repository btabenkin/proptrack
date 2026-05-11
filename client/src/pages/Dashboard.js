import { useState, useEffect } from 'react';
import { propertiesApi, tenantsApi, rentPaymentsApi, expensesApi, maintenanceApi } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([
      propertiesApi.getAll(),
      tenantsApi.getAll(),
      rentPaymentsApi.getAll(),
      expensesApi.getAll(),
      maintenanceApi.getAll(),
    ]).then(([props, tenants, payments, expenses, maintenance]) => {
      setStats({
        properties: props.data.length,
        tenants: tenants.data.filter(t => t.status === 'active').length,
        totalRent: payments.data.reduce((s, p) => s + p.amount, 0),
        totalExpenses: expenses.data.reduce((s, e) => s + e.amount, 0),
        openMaintenance: maintenance.data.filter(m => m.status === 'open').length,
      });
    }).catch(() => setStats({}));
  }, []);

  if (!stats) return <div className="loading">Loading dashboard…</div>;

  const cards = [
    { label: 'Properties', value: stats.properties, cls: '' },
    { label: 'Active Tenants', value: stats.tenants, cls: 'green' },
    { label: 'Total Rent Collected', value: `$${(stats.totalRent || 0).toLocaleString()}`, cls: 'green' },
    { label: 'Total Expenses', value: `$${(stats.totalExpenses || 0).toLocaleString()}`, cls: 'red' },
    { label: 'Open Maintenance', value: stats.openMaintenance, cls: 'orange' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Dashboard</h2>
      </div>
      <div className="stats-grid">
        {cards.map(c => (
          <div key={c.label} className={`stat-card ${c.cls}`}>
            <div className="stat-value">{c.value}</div>
            <div className="stat-label">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
