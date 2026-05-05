import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { Plus, HeartPulse, Eye, Trash2, Activity, User, Briefcase, FileText, Search, List, Archive } from 'lucide-react';

const Asos = () => {
  const { asos, setAsos, funcionarios } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [selectedAso, setSelectedAso] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // States for new ASO form
  const [formData, setFormData] = useState({
    funcionario: '',
    cpf: '',
    cargo: '',
    empresa: '',
    riscos: '',
    exames: [],
    tipo: '',
    dataExame: '',
    validade: '',
    status: 'Apto'
  });

  const [novoExameNome, setNovoExameNome] = useState('');
  const [novoExameData, setNovoExameData] = useState('');
  const [novoExameValidade, setNovoExameValidade] = useState('');

  const handleExcluir = (id) => {
    if(window.confirm('Tem certeza que deseja excluir este ASO?')) {
      setAsos(asos.filter(a => a.id !== id));
    }
  };

  const calculateDaysRemaining = (validadeDate) => {
    if (!validadeDate) return null;
    const validade = new Date(validadeDate + 'T12:00:00Z');
    const today = new Date();
    today.setHours(0,0,0,0);
    validade.setHours(0,0,0,0);
    return Math.ceil((validade - today) / (1000 * 60 * 60 * 24));
  };

  const columns = [
    { header: 'Tipo', accessor: (row) => <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)'}}> <HeartPulse size={16} /> <strong>{row.tipo}</strong></div> },
    { header: 'Funcionário', accessor: (row) => row.funcionario },
    { header: 'Data do Exame', accessor: (row) => row.dataExame ? new Date(row.dataExame + 'T12:00:00Z').toLocaleDateString() : '-' },
    { header: 'Validade', accessor: (row) => {
        const diffDays = calculateDaysRemaining(row.validade);
        if (diffDays === null) return '-';
        if (diffDays < 0) return <span style={{color: 'var(--danger)', fontWeight: 'bold'}}>Vencido</span>;
        if (diffDays === 0) return <span style={{color: 'var(--warning)', fontWeight: 'bold'}}>Vence hoje</span>;
        return <span>Faltam {diffDays} dias <br/><small className="text-muted">({new Date(row.validade + 'T12:00:00Z').toLocaleDateString()})</small></span>;
    }},
    { header: 'Aptidão', accessor: (row) => {
      const isLegacyErrored = !['Apto', 'Inapto Temporariamente', 'Inapto'].includes(row.status);
      const actualStatus = isLegacyErrored ? 'Apto' : row.status;
      const isOk = actualStatus === 'Apto';
      return (
        <span className={`status-badge ${isOk ? 'status-success' : (actualStatus === 'Inapto Temporariamente' ? 'status-warning' : 'status-danger')}`}>
          {actualStatus}
        </span>
      );
    }},
    { header: 'Ações', accessor: (row) => (
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button onClick={() => setSelectedAso(row)} style={{color: 'var(--primary)', cursor: 'pointer', background: 'none', border: 'none'}} title="Ver Detalhes do ASO">
          <Eye size={18} />
        </button>
        <button onClick={() => handleExcluir(row.id)} style={{color: 'var(--danger)', cursor: 'pointer', background: 'none', border: 'none'}} title="Excluir ASO">
          <Trash2 size={18} />
        </button>
      </div>
    )},
  ];

  const handleFuncionarioSelect = (e) => {
    const nome = e.target.value;
    const funcData = funcionarios.find(f => f.nome === nome);
    if (funcData) {
      setFormData({
        ...formData,
        funcionario: funcData.nome,
        cpf: funcData.cpf || 'Não informado',
        cargo: funcData.cargo || 'Não informado',
        empresa: funcData.empresa || 'Não informado'
      });
    } else {
      setFormData({ ...formData, funcionario: '', cpf: '', cargo: '', empresa: '' });
    }
  };

  const handleAddExame = () => {
    if(!novoExameNome || !novoExameData) return;
    setFormData({ 
      ...formData, 
      exames: [...formData.exames, { nome: novoExameNome, data: novoExameData, validade: novoExameValidade }] 
    });
    setNovoExameNome('');
    setNovoExameData('');
    setNovoExameValidade('');
  };

  const handleRemoveExame = (idx) => {
    setFormData({ ...formData, exames: formData.exames.filter((_, i) => i !== idx) });
  };

  const handleSave = () => {
    if (!formData.funcionario || !formData.tipo) return;
    
    // Arquiva ASOs anteriores do funcionário
    const novosAsos = asos.map(a => {
      if (a.funcionario === formData.funcionario && !a.arquivado) {
        return { ...a, arquivado: true };
      }
      return a;
    });

    setAsos([...novosAsos, { 
      id: Date.now(), 
      ...formData,
      arquivado: false
    }]);

    setFormData({
      funcionario: '', cpf: '', cargo: '', empresa: '', riscos: '', exames: [], tipo: '', dataExame: '', validade: '', status: 'Apto'
    });
    setShowForm(false);
  };

  const filteredAsos = asos.filter(a => {
    if (a.arquivado) return false;
    const termo = searchTerm.toLowerCase();
    
    const isLegacyErrored = !['Apto', 'Inapto Temporariamente', 'Inapto'].includes(a.status);
    const actualStatus = isLegacyErrored ? 'Apto' : a.status;
    const statusLower = actualStatus.toLowerCase();
    
    const matchStatus = termo === 'apto' 
      ? statusLower === 'apto' 
      : statusLower.includes(termo);

    return a.tipo.toLowerCase().includes(termo) || 
           a.funcionario.toLowerCase().includes(termo) || 
           matchStatus;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="title-page">Controle de ASOs (NR-07)</h1>
          <p className="subtitle-page">Atestados de Saúde Ocupacional e controle de aptidão e exames.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> {showForm ? 'Cancelar' : 'Registrar Novo ASO'}
        </Button>
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', width: '100%', maxWidth: '400px' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={18} style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Buscar por Tipo, Funcionário ou Aptidão..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      {showForm && (
        <Card title="Novo ASO" className="glass-panel" style={{marginBottom: '2rem'}}>
          
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}><User size={18}/> Dados Básicos</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="input-group" style={{ margin: 0 }}>
              <label className="input-label">Selecionar Funcionário</label>
              <select className="input-field" value={formData.funcionario} onChange={handleFuncionarioSelect}>
                <option value="">Selecione...</option>
                {funcionarios.map(f => (
                  <option key={f.id} value={f.nome}>{f.nome}</option>
                ))}
              </select>
            </div>
            <Input label="CPF" value={formData.cpf} disabled style={{ backgroundColor: 'var(--surface)' }} />
            <Input label="Cargo/Função" value={formData.cargo} disabled style={{ backgroundColor: 'var(--surface)' }} />
            <Input label="Empresa Vinculada" value={formData.empresa} disabled style={{ backgroundColor: 'var(--surface)' }} />
          </div>

          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}><Activity size={18}/> Classificação do ASO</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="input-group" style={{ margin: 0 }}>
              <label className="input-label">Tipo de Exame</label>
              <select className="input-field" value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value})}>
                <option value="">Selecione...</option>
                <option value="Admissional">Admissional</option>
                <option value="Periódico">Periódico</option>
                <option value="Retorno ao Trabalho">Retorno ao Trabalho (&gt;30 dias)</option>
                <option value="Mudança de Riscos">Mudança de Riscos/Função</option>
                <option value="Demissional">Demissional</option>
              </select>
            </div>
            <Input type="date" label="Data de Realização" value={formData.dataExame} onChange={e => setFormData({...formData, dataExame: e.target.value})} />
            <Input type="date" label="Validade" value={formData.validade} onChange={e => setFormData({...formData, validade: e.target.value})} />
            <div className="input-group" style={{ margin: 0 }}>
              <label className="input-label">Aptidão (Status final)</label>
              <select className="input-field" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="Apto">Apto</option>
                <option value="Inapto Temporariamente">Inapto Temporariamente</option>
                <option value="Inapto">Inapto</option>
              </select>
            </div>
          </div>

          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}><List size={18}/> Observação</h4>
          <div style={{ marginBottom: '1.5rem' }}>
            <div className="input-group" style={{ margin: 0 }}>
              <input 
                className="input-field" 
                value={formData.riscos} 
                onChange={e => setFormData({...formData, riscos: e.target.value})} 
                placeholder="Adicione uma observação sobre este ASO..."
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem', backgroundColor: 'var(--background)', padding: '1.5rem', borderRadius: 'var(--radius)' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
              <FileText size={18} /> Exames Complementares Vinculados
            </h4>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', alignItems: 'flex-end' }}>
              <div className="input-group" style={{ margin: 0, flex: 2 }}>
                <label className="input-label" style={{fontSize: '0.8rem'}}>Nome do Exame</label>
                <input 
                  className="input-field"
                  value={novoExameNome} 
                  onChange={e => setNovoExameNome(e.target.value)} 
                  placeholder="Ex: Audiometria..." 
                />
              </div>
              <div className="input-group" style={{ margin: 0, flex: 1 }}>
                <label className="input-label" style={{fontSize: '0.8rem'}}>Realizado em</label>
                <input 
                  type="date"
                  className="input-field"
                  value={novoExameData} 
                  onChange={e => setNovoExameData(e.target.value)} 
                />
              </div>
              <div className="input-group" style={{ margin: 0, flex: 1 }}>
                <label className="input-label" style={{fontSize: '0.8rem'}}>Validade</label>
                <input 
                  type="date"
                  className="input-field"
                  value={novoExameValidade} 
                  onChange={e => setNovoExameValidade(e.target.value)} 
                />
              </div>
              <Button onClick={handleAddExame} style={{ height: '42px', padding: '0 1rem' }}><Plus size={18}/></Button>
            </div>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {formData.exames.length === 0 && <span className="text-muted" style={{fontSize: '0.9rem'}}>Nenhum exame complementar adicionado (Apenas clínico).</span>}
              {formData.exames.map((exame, idx) => (
                <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }}>
                  <span>
                    <strong style={{color: 'var(--primary)'}}>{exame.nome}</strong> - {new Date(exame.data + 'T12:00:00Z').toLocaleDateString()}
                    {exame.validade && <span style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}> | Válido até: {new Date(exame.validade + 'T12:00:00Z').toLocaleDateString()}</span>}
                  </span>
                  <button onClick={() => handleRemoveExame(idx)} style={{color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer'}}>
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Button variant="secondary" onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar ASO Oficial</Button>
          </div>
        </Card>
      )}

      <Card>
        <Table data={filteredAsos} columns={columns} keyExtractor={(row) => row.id} />
      </Card>

      <Modal isOpen={!!selectedAso} onClose={() => setSelectedAso(null)} title={`Detalhes ASO: ${selectedAso?.funcionario}`}>
        {selectedAso && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{backgroundColor: 'var(--background)', padding: '1rem', borderRadius: 'var(--radius)'}}>
                <h4 style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem', color: 'var(--primary)'}}><User size={16}/> Funcionário</h4>
                <p><strong>Nome:</strong> {selectedAso.funcionario}</p>
                <p><strong>CPF:</strong> {selectedAso.cpf || 'N/A'}</p>
                <p><strong>Cargo:</strong> {selectedAso.cargo || 'N/A'} - {selectedAso.empresa || 'N/A'}</p>
              </div>

              <div style={{backgroundColor: 'var(--background)', padding: '1rem', borderRadius: 'var(--radius)'}}>
                <h4 style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem', color: 'var(--primary)'}}><Activity size={16}/> Atestado</h4>
                <p><strong>Tipo:</strong> {selectedAso.tipo}</p>
                <p><strong>Data de Exame:</strong> {selectedAso.dataExame ? new Date(selectedAso.dataExame + 'T12:00:00Z').toLocaleDateString() : '-'}</p>
                <p><strong>Aptidão:</strong> <span className={`status-badge ${!['Inapto', 'Inapto Temporariamente'].includes(selectedAso.status) ? 'status-success' : (selectedAso.status === 'Inapto Temporariamente' ? 'status-warning' : 'status-danger')}`}>{!['Apto', 'Inapto Temporariamente', 'Inapto'].includes(selectedAso.status) ? 'Apto' : selectedAso.status}</span></p>
              </div>
            </div>

            <div style={{backgroundColor: 'var(--background)', padding: '1rem', borderRadius: 'var(--radius)'}}>
              <h4 style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem', color: 'var(--primary)'}}><List size={16}/> Observação</h4>
              <p>{selectedAso.riscos || 'Não especificado.'}</p>
            </div>

            <div>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--warning)' }}>
                <FileText size={18} /> Exames Complementares
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(!selectedAso.exames || selectedAso.exames.length === 0) && (
                  <span className="text-muted">Apenas avaliação clínica descrita. Nenhum exame complementar vinculado.</span>
                )}
                {(selectedAso.exames || []).map((exame, idx) => (
                  <li key={idx} style={{ padding: '0.75rem', backgroundColor: 'var(--background)', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }}>
                    • <strong>{exame.nome}</strong> - Data: {new Date(exame.data + 'T12:00:00Z').toLocaleDateString()} 
                    {exame.validade && <span style={{marginLeft: '0.5rem', color: 'var(--text-muted)'}}>| Validade: {new Date(exame.validade + 'T12:00:00Z').toLocaleDateString()}</span>}
                  </li>
                ))}
              </ul>
            </div>

            {asos.filter(a => a.funcionario === selectedAso.funcionario && a.arquivado).length > 0 && (
              <div style={{backgroundColor: 'var(--background)', padding: '1rem', borderRadius: 'var(--radius)'}}>
                <h4 style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem', color: 'var(--text-main)'}}><Archive size={16}/> Histórico de ASOs Anteriores</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {asos.filter(a => a.funcionario === selectedAso.funcionario && a.arquivado).sort((a,b) => b.id - a.id).map(velhoAso => (
                    <li key={velhoAso.id} style={{ padding: '0.5rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)', backgroundColor: 'var(--surface)'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between'}}>
                         <strong>{velhoAso.tipo}</strong>
                         <span style={{fontSize: '0.8rem'}} className={`status-badge ${!['Inapto', 'Inapto Temporariamente'].includes(velhoAso.status) ? 'status-success' : (velhoAso.status === 'Inapto Temporariamente' ? 'status-warning' : 'status-danger')}`}>
                           {!['Apto', 'Inapto Temporariamente', 'Inapto'].includes(velhoAso.status) ? 'Apto' : velhoAso.status}
                         </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        Exame: {velhoAso.dataExame ? new Date(velhoAso.dataExame + 'T12:00:00Z').toLocaleDateString() : '-'} | 
                        Validade: {velhoAso.validade ? new Date(velhoAso.validade + 'T12:00:00Z').toLocaleDateString() : '-'}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        )}
      </Modal>

    </div>
  );
};

export default Asos;
