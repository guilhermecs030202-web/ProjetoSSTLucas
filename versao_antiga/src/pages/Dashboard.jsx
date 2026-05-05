import React from 'react';
import Card from '../components/ui/Card';
import { Users, Building2, AlertTriangle, Activity } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const StatCard = ({ title, value, icon, color }) => (
  <Card className="stat-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <div style={{ backgroundColor: color, color: '#fff', padding: '1rem', borderRadius: '12px', display: 'flex' }}>
      {icon}
    </div>
    <div>
      <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0, fontWeight: 500 }}>{title}</h3>
      <p style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>{value}</p>
    </div>
  </Card>
);

const Dashboard = () => {
  const { empresas, funcionarios, treinamentos, asos, documentos } = useAppContext();

  const today = new Date();
  today.setHours(0,0,0,0);

  // Counters
  const totalEmpresas = empresas.length;
  const totalFuncionarios = funcionarios.length;

  const treinamentosVencidos = treinamentos.filter(t => {
    if (!t.validade) return false;
    const validade = new Date(t.validade + 'T12:00:00Z');
    validade.setHours(0,0,0,0);
    return validade < today;
  }).length;

  const asosAtenção = asos.filter(a => {
    if (!a.validade) return false;
    const validade = new Date(a.validade + 'T12:00:00Z');
    validade.setHours(0,0,0,0);
    const diffDays = Math.ceil((validade - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 30; // Vencidos ou a vencer em 30 dias
  }).length;

  // Avisos formatados
  const docsAvisos = documentos.filter(d => {
    if (!d.validade) return false;
    const validade = new Date(d.validade + 'T12:00:00Z');
    validade.setHours(0,0,0,0);
    const diffDays = Math.ceil((validade - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 45; // 45 days warning
  }).map(d => {
    const validade = new Date(d.validade + 'T12:00:00Z');
    validade.setHours(0,0,0,0);
    const diffDays = Math.ceil((validade - today) / (1000 * 60 * 60 * 24));
    const statusTxt = diffDays < 0 ? 'está vencido' : diffDays === 0 ? 'vence hoje' : `vence em ${diffDays} dias`;
    return { id: d.id, empresa: d.empresa, tipo: d.tipo, statusTxt, danger: diffDays < 0 };
  });

  const asosAvisosList = asos.filter(a => {
    if (!a.validade) return false;
    const validade = new Date(a.validade + 'T12:00:00Z');
    validade.setHours(0,0,0,0);
    const diffDays = Math.ceil((validade - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  }).map(a => {
    const validade = new Date(a.validade + 'T12:00:00Z');
    validade.setHours(0,0,0,0);
    const diffDays = Math.ceil((validade - today) / (1000 * 60 * 60 * 24));
    const statusTxt = diffDays < 0 ? 'está vencido' : diffDays === 0 ? 'vence hoje' : `vence em ${diffDays} dias`;
    return { id: a.id, funcionario: a.funcionario, tipo: a.tipo, statusTxt, danger: diffDays < 0 };
  });

  return (
    <div>
      <h1 className="title-page">Visão Geral</h1>
      <p className="subtitle-page">Acompanhe os principais indicadores de Segurança do Trabalho.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard title="Empresas Ativas" value={totalEmpresas} icon={<Building2 />} color="var(--primary)" />
        <StatCard title="Funcionários" value={totalFuncionarios} icon={<Users />} color="var(--secondary)" />
        <StatCard title="Treinamentos Vencidos" value={treinamentosVencidos} icon={<AlertTriangle />} color="var(--danger)" />
        <StatCard title="ASOs Vencendo/Vencidos" value={asosAtenção} icon={<Activity />} color="var(--warning)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <Card title="Avisos de Documentos">
          {docsAvisos.length === 0 ? (
            <p className="text-muted" style={{ margin: 0, padding: '1rem 0' }}>Nenhum documento vencendo nos próximos 45 dias.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {docsAvisos.map(doc => (
                <li key={doc.id} style={{ padding: '1rem 0', borderBottom: '1px solid var(--border-light)', color: doc.danger ? 'var(--danger)' : 'inherit' }}>
                  <strong>{doc.empresa}</strong>: O documento {doc.tipo} {doc.statusTxt}.
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Avisos de ASO">
          {asosAvisosList.length === 0 ? (
            <p className="text-muted" style={{ margin: 0, padding: '1rem 0' }}>Nenhum ASO vencendo nos próximos 30 dias.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {asosAvisosList.map(aso => (
                <li key={aso.id} style={{ padding: '1rem 0', borderBottom: '1px solid var(--border-light)', color: aso.danger ? 'var(--danger)' : 'inherit' }}>
                  <strong>{aso.funcionario}</strong>: ASO {aso.tipo} {aso.statusTxt}.
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
