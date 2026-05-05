import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  FileText, 
  GraduationCap, 
  HardHat, 
  AlertTriangle,
  FileHeart
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/empresas', icon: <Building2 size={20} />, label: 'Empresas' },
    { to: '/funcionarios', icon: <Users size={20} />, label: 'Funcionários' },
    { to: '/documentos', icon: <FileText size={20} />, label: 'Documentos' },
    { to: '/treinamentos', icon: <GraduationCap size={20} />, label: 'Treinamentos' },
    { to: '/asos', icon: <FileHeart size={20} />, label: 'ASOs' },
    { to: '/epis', icon: <HardHat size={20} />, label: 'EPIs' },
    { to: '/acidentes', icon: <AlertTriangle size={20} />, label: 'Acidentes' }
  ];

  return (
    <aside className="sidebar">
      
      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink 
                to={item.to} 
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <p className="text-muted text-sm" style={{fontSize: '0.8rem'}}>© 2026 AntiGravity</p>
      </div>
    </aside>
  );
};

export default Sidebar;
