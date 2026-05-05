import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { Plus, Trash2, Eye, Users, FileText, Briefcase, Star, Search } from 'lucide-react';

const Empresas = () => {
  const { empresas, setEmpresas, funcionarios, documentos } = useAppContext();
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ nome: '', cnpj: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedEmpresa, setSelectedEmpresa] = useState(null);
  


  const handleExcluirEmpresa = (id) => {
    if(window.confirm('Tem certeza que deseja excluir esta empresa?')) {
      setEmpresas(empresas.filter(e => e.id !== id));
    }
  };

  const handleSaveEmpresa = () => {
    if (!formData.nome || !formData.cnpj) return;
    setEmpresas([...empresas, { id: Date.now(), ...formData, cargos: [], cipa: [] }]);
    setFormData({ nome: '', cnpj: '' });
    setShowForm(false);
  };

  const openDetails = (empresa) => {
    setSelectedEmpresa(empresa);
  };



  const toggleCipaMembro = (funcionarioNome) => {
    const cipaCurrent = selectedEmpresa.cipa || [];
    let novaCipa = [];
    if (cipaCurrent.includes(funcionarioNome)) {
      novaCipa = cipaCurrent.filter(nome => nome !== funcionarioNome);
    } else {
      novaCipa = [...cipaCurrent, funcionarioNome];
    }
    const updated = { ...selectedEmpresa, cipa: novaCipa };
    setEmpresas(empresas.map(e => e.id === updated.id ? updated : e));
    setSelectedEmpresa(updated);
  };

  const columns = [
    { header: 'Nome da Empresa', accessor: (row) => <strong style={{color: 'var(--primary)'}}>{row.nome}</strong> },
    { header: 'CNPJ', accessor: (row) => row.cnpj },
    { 
      header: 'Funcionários (Qtd)', 
      accessor: (row) => {
        const count = funcionarios.filter(f => f.empresa === row.nome).length;
        return <span style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Users size={16}/> {count}</span>;
      }
    },
    { header: 'Ações', accessor: (row) => (
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button 
          onClick={() => openDetails(row)} 
          style={{color: 'var(--primary)', cursor: 'pointer', background: 'none', border: 'none'}}
          title="Ver Funcionários, Documentos e Configurações"
        >
          <Eye size={18} />
        </button>
        <button 
          onClick={() => handleExcluirEmpresa(row.id)} 
          style={{color: 'var(--danger)', cursor: 'pointer', background: 'none', border: 'none'}}
          title="Excluir Empresa"
        >
          <Trash2 size={18} />
        </button>
      </div>
    )},
  ];

  const funcsDaEmpresa = selectedEmpresa ? funcionarios.filter(f => f.empresa === selectedEmpresa.nome) : [];
  const docsDaEmpresa = selectedEmpresa ? documentos.filter(d => d.empresa === selectedEmpresa.nome) : [];
  const cipaList = selectedEmpresa ? (selectedEmpresa.cipa || []) : [];

  const cargosDinâmicos = funcsDaEmpresa.reduce((acc, func) => {
    if (func.cargo) {
      acc[func.cargo] = (acc[func.cargo] || 0) + 1;
    }
    return acc;
  }, {});
  const cargosList = Object.entries(cargosDinâmicos).sort((a, b) => b[1] - a[1]);

  const filteredEmpresas = empresas.filter(e => 
    e.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (e.cnpj && e.cnpj.includes(searchTerm))
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="title-page">Empresas e Matrizes</h1>
          <p className="subtitle-page">Cadastre as unidades e gerencie seus funcionários, CIPA e documentos.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> {showForm ? 'Cancelar' : 'Nova Empresa'}
        </Button>
      </div>

      {showForm && (
        <Card title="Cadastrar Nova Empresa" className="glass-panel" style={{marginBottom: '2rem'}}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) minmax(200px, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
            <Input 
              label="Nome da Empresa" 
              value={formData.nome} 
              onChange={e => setFormData({...formData, nome: e.target.value})} 
              placeholder="Ex: Construtora XYZ..."
            />
            <Input 
              label="CNPJ" 
              value={formData.cnpj} 
              onChange={e => setFormData({...formData, cnpj: e.target.value})} 
              placeholder="00.000.000/0001-00"
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Button variant="secondary" onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button onClick={handleSaveEmpresa}>Salvar Empresa</Button>
          </div>
        </Card>
      )}

      <Card>
        <div style={{ padding: '0 0.5rem 1rem 0.5rem', display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-light)', marginBottom: '1rem' }}>
          <div className="input-field" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', maxWidth: '400px', backgroundColor: 'var(--background)' }}>
            <Search size={18} color="var(--text-muted)" />
            <input 
              type="text" 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              placeholder="Buscar por nome ou CNPJ..." 
              style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', color: 'var(--text-main)', fontSize: '0.9rem' }} 
            />
          </div>
        </div>

        <Table data={filteredEmpresas} columns={columns} keyExtractor={(row) => row.id} />
      </Card>

      <Modal isOpen={!!selectedEmpresa} onClose={() => setSelectedEmpresa(null)} title={`Visão Geral: ${selectedEmpresa?.nome}`}>
        {selectedEmpresa && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            <div style={{ backgroundColor: 'var(--background)', padding: '1.5rem', borderRadius: 'var(--radius)' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>
                <Users size={18} /> Quadro de Funcionários & CIPA
              </h4>
              <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Clique na estrela ao lado de um funcionário para admiti-lo como membro da CIPA nesta unidade.
              </p>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {funcsDaEmpresa.length === 0 && <span className="text-muted" style={{fontSize: '0.9rem'}}>Nenhum funcionário vinculado atualmente a esta empresa.</span>}
                {funcsDaEmpresa.map(func => {
                  const isCipa = cipaList.includes(func.nome);
                  return (
                    <li key={func.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)', border: `1px solid ${isCipa ? 'var(--success)' : 'var(--border-light)'}` }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <strong style={{ fontSize: '1rem' }}>{func.nome}</strong>
                        <span style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>{func.cargo}</span>
                      </div>
                      <button 
                        onClick={() => toggleCipaMembro(func.nome)} 
                        style={{ 
                          display: 'flex', alignItems: 'center', gap: '0.5rem',
                          color: isCipa ? 'var(--success)' : 'var(--text-muted)', 
                          background: isCipa ? 'rgba(16, 185, 129, 0.1)' : 'var(--background)', 
                          border: isCipa ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-color)', 
                          padding: '0.5rem 1rem',
                          borderRadius: '24px',
                          cursor: 'pointer',
                          fontWeight: isCipa ? 'bold' : 'normal',
                          transition: 'all 0.2s ease',
                          fontSize: '0.85rem'
                        }}
                      >
                        <Star size={16} fill={isCipa ? 'var(--success)' : 'transparent'} /> {isCipa ? 'Membro da CIPA' : 'Adicionar à CIPA'}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: '1.5rem' }}>
              
              {/* Cargos e Funções */}
              <div style={{ backgroundColor: 'var(--background)', padding: '1.5rem', borderRadius: 'var(--radius)' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
                  <Briefcase size={18} /> Funções e Quantitativos
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {cargosList.length === 0 && <span className="text-muted" style={{fontSize: '0.9rem'}}>Nenhuma função cadastrada nos funcionários desta empresa.</span>}
                  {cargosList.map(([cargo, qtd]) => (
                    <li key={cargo} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)', alignItems: 'center' }}>
                      <div>
                        <strong>{cargo}</strong> <br/>
                        <span style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>{qtd} funcionário{qtd !== 1 ? 's' : ''} ativo{qtd !== 1 ? 's' : ''}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Documentos */}
              <div style={{ backgroundColor: 'var(--background)', padding: '1.5rem', borderRadius: 'var(--radius)' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--warning)' }}>
                  <FileText size={18} /> Documentos Vigentes
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {docsDaEmpresa.length === 0 && <span className="text-muted" style={{fontSize: '0.9rem'}}>Nenhum documento encontrado para esta unidade.</span>}
                  {docsDaEmpresa.map(doc => {
                    const today = new Date();
                    today.setHours(0,0,0,0);
                    let diffDays = null;
                    if (doc.validade) {
                      const validade = new Date(doc.validade + 'T12:00:00Z');
                      validade.setHours(0,0,0,0);
                      diffDays = Math.ceil((validade - today) / (1000 * 60 * 60 * 24));
                    }
                    return (
                      <li key={doc.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '0.75rem 1rem', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <strong style={{ fontSize: '1rem' }}>{doc.tipo}</strong>
                          <span className={`status-badge ${diffDays !== null && diffDays < 0 ? 'status-danger' : 'status-success'}`} style={{fontSize: '0.75rem'}}>{diffDays !== null && diffDays < 0 ? 'Vencido' : 'Válido'}</span>
                        </div>
                        {doc.validade && (
                          <div style={{ fontSize: '0.85rem', color: diffDays !== null && diffDays <= 45 ? 'var(--danger)' : 'var(--text-muted)' }}>
                            Vence em: {new Date(doc.validade + 'T12:00:00Z').toLocaleDateString()}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Empresas;
