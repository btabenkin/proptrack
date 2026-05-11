import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '⬛' },
  { path: '/properties', label: 'Properties', icon: '🏢' },
  { path: '/tenants', label: 'Tenants', icon: '👥' },
  { path: '/payments', label: 'Rent Payments', icon: '💰' },
  { path: '/expenses', label: 'Expenses', icon: '📊' },
  { path: '/maintenance', label: 'Maintenance', icon: '🔧' },
];

export default function Layout() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="app-logo">PropTrack</div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(({ path, label, icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <span className="nav-icon">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
