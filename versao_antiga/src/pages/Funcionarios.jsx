import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { Plus, Trash2, Eye, Search, FileHeart } from 'lucide-react';

const Funcionarios = () => {
  const { funcionarios, setFuncionarios, empresas, treinamentos, asos, setAsos } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ matricula: '', nome: '', cpf: '', cargo: '', empresa: '', admissao: '', nascimento: '' });
  
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedFuncionario, setSelectedFuncionario] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleExcluir = (id) => {
    if(window.confirm('Tem certeza que deseja excluir este funcionário?')) {
      setFuncionarios(funcionarios.filter(f => f.id !== id));
    }
  };

  const handleVerDetalhes = (func) => {
    setSelectedFuncionario(func);
    setIsModalOpen(true);
  };

  const columns = [
    { header: 'Matrícula', accessor: (row) => row.matricula || '-' },
    { header: 'Nome', accessor: (row) => <strong style={{color: 'var(--primary)'}}>{row.nome}</strong> },
    { header: 'CPF', accessor: (row) => row.cpf },
    { header: 'Cargo', accessor: (row) => row.cargo },
    { header: 'Empresa', accessor: (row) => row.empresa },
    { header: 'Ações', accessor: (row) => (
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button 
          onClick={() => handleVerDetalhes(row)} 
          style={{color: 'var(--primary)', cursor: 'pointer', background: 'none', border: 'none'}}
          title="Ver Detalhes (Treinamentos e ASOs)"
        >
          <Eye size={18} />
        </button>
        <button 
          onClick={() => handleExcluir(row.id)} 
          style={{color: 'var(--danger)', cursor: 'pointer', background: 'none', border: 'none'}}
          title="Excluir Funcionário"
        >
          <Trash2 size={18} />
        </button>
      </div>
    )},
  ];

  const handleSave = () => {
    if (!formData.matricula || !formData.nome || !formData.cpf) {
      alert("Por favor, preencha a Matrícula, Nome e CPF.");
      return;
    }
    setFuncionarios([...funcionarios, { id: Date.now(), ...formData }]);
    setFormData({ matricula: '', nome: '', cpf: '', cargo: '', empresa: '', admissao: '', nascimento: '' });
    setShowForm(false);
  };

  const handleDeleteAso = (id) => {
    setAsos(asos.filter(a => a.id !== id));
  };

  const funcionarioTreinamentos = treinamentos.filter(t => t.funcionario === selectedFuncionario?.nome);
  const funcionarioAsos = asos.filter(a => a.funcionario === selectedFuncionario?.nome);

  const filteredFuncionarios = funcionarios.filter(f => 
    f.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.cpf.includes(searchTerm)
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="title-page">Funcionários</h1>
          <p className="subtitle-page">Gestão do quadro de empregados das empresas.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> {showForm ? 'Cancelar' : 'Novo Funcionário'}
        </Button>
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', width: '100%', maxWidth: '400px' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={18} style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Buscar por Nome ou CPF..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      {showForm && (
        <Card title="Cadastrar Novo Funcionário" className="glass-panel" style={{marginBottom: '2rem'}}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(200px, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
            <Input label="Matrícula" value={formData.matricula} onChange={e => setFormData({...formData, matricula: e.target.value})} placeholder="Ex: 001" />
            <Input label="Nome Completo" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} />
            <Input label="CPF" value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} placeholder="000.000.000-00" />
            <Input label="Cargo" value={formData.cargo} onChange={e => setFormData({...formData, cargo: e.target.value})} />
            
            <div className="input-group" style={{ marginBottom: '1rem' }}>
              <label className="input-label">Empresa Vinculada</label>
              <select className="input-field" value={formData.empresa} onChange={e => setFormData({...formData, empresa: e.target.value})}>
                <option value="">Selecione uma empresa</option>
                {empresas.map(emp => (
                  <option key={emp.id} value={emp.nome}>{emp.nome}</option>
                ))}
              </select>
            </div>
            
            <Input type="date" label="Data de Nascimento" value={formData.nascimento} onChange={e => setFormData({...formData, nascimento: e.target.value})} />
            <Input type="date" label="Data de Admissão" value={formData.admissao} onChange={e => setFormData({...formData, admissao: e.target.value})} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Button variant="secondary" onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar Funcionário</Button>
          </div>
        </Card>
      )}

      <Card>
        <Table data={filteredFuncionarios} columns={columns} keyExtractor={(row) => row.id} />
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Detalhes: ${selectedFuncionario?.nome}`}>
        {selectedFuncionario && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Informações Básicas</h4>
              <p><strong>Matrícula:</strong> {selectedFuncionario?.matricula || 'Não informada'}</p>
              <p><strong>Nascimento:</strong> {selectedFuncionario?.nascimento ? new Date(selectedFuncionario.nascimento + 'T12:00:00Z').toLocaleDateString() : 'Não informado'}</p>
              <p><strong>Cargo:</strong> {selectedFuncionario?.cargo}</p>
              <p><strong>Empresa:</strong> {selectedFuncionario?.empresa}</p>
              <p><strong>Admissão:</strong> {selectedFuncionario?.admissao ? new Date(selectedFuncionario.admissao + 'T12:00:00Z').toLocaleDateString() : 'Não informada'}</p>
            </div>

            <div>
              <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Treinamentos (NRs)</h4>
              {funcionarioTreinamentos.length > 0 ? (
                <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
                  {funcionarioTreinamentos.map(t => (
                    <li key={t.id} style={{ marginBottom: '0.25rem' }}>
                      {t.tipo} - Validade: {new Date(t.validade + 'T12:00:00Z').toLocaleDateString()} 
                      <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', fontWeight: 'bold', color: t.status === 'Válido' ? 'var(--success)' : 'var(--warning)' }}>
                        ({t.status})
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted" style={{margin: 0}}>Nenhum treinamento registrado.</p>
              )}
            </div>

            <div>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--warning)' }}>
                <FileHeart size={18} /> Atestados de Saúde Ocupacional (ASOs)
              </h4>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {funcionarioAsos.length === 0 && <span className="text-muted">Nenhum ASO registrado.</span>}
                {funcionarioAsos.map(aso => (
                  <li key={aso.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: 'var(--background)', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }}>
                    <div>
                      <strong>{aso.tipo}</strong> <br/>
                      <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                        Exame: {new Date(aso.dataExame + 'T12:00:00Z').toLocaleDateString()} | 
                        Vence: {new Date(aso.validade + 'T12:00:00Z').toLocaleDateString()}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span className={`status-badge ${new Date(aso.validade) > new Date() ? 'status-success' : 'status-danger'}`}>
                        {new Date(aso.validade) > new Date() ? 'Válido' : 'Vencido'}
                      </span>
                      <button onClick={() => handleDeleteAso(aso.id)} style={{color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer'}}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Funcionarios;
