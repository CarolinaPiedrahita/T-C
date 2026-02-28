import { useLocation, Link } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <aside className="sidebar">
      <h2 style={{ marginBottom: '20px', color: '#FF8C42' }}>Menú</h2>
      <ul>
        <li>
          <Link to="/" className={isActive('/')}>
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/clients" className={isActive('/clients')}>
            Clientes
          </Link>
        </li>
        <li>
          <Link to="/clients/new" className={isActive('/clients/new')}>
            Nuevo Cliente
          </Link>
        </li>
      </ul>
    </aside>
  );
}
