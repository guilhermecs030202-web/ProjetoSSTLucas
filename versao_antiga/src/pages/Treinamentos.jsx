import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { Plus, GraduationCap, Eye, Trash2, List, Search, UploadCloud, FileText } from 'lucide-react';

const Treinamentos = () => {
  const { treinamentos, setTreinamentos, funcionarios } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ funcionario: '', tipo: '', dataRealizado: '', validade: '', observacoes: [] });
  const [novaObservacao, setNovaObservacao] = useState('');
  const [isCustomTipo, setIsCustomTipo] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Instrutor
  const [matriculaInstrutor, setMatriculaInstrutor] = useState('');
  const [instrutorData, setInstrutorData] = useState(null);

  const [selectedTreinamento, setSelectedTreinamento] = useState(null);

  const handleExcluir = (id) => {
    if(window.confirm('Tem certeza que deseja excluir este treinamento?')) {
      setTreinamentos(treinamentos.filter(t => t.id !== id));
    }
  };

  const getTreinamentoStatusInfo = (validadeDate) => {
    if (!validadeDate) return { text: 'Válido', class: 'status-success' };
    const today = new Date();
    today.setHours(0,0,0,0);
    const validade = new Date(validadeDate + 'T12:00:00Z');
    validade.setHours(0,0,0,0);
    const diffDays = Math.ceil((validade - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Inválido', class: 'status-danger' };
    if (diffDays <= 45) return { text: 'Vencendo', class: 'status-warning' };
    return { text: 'Válido', class: 'status-success' };
  };

  const columns = [
    { header: 'Tipo', accessor: (row) => <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)'}}> <GraduationCap size={16} /> <strong>{row.tipo}</strong></div> },
    { header: 'Funcionário', accessor: (row) => row.funcionario },
    { header: 'Data de Realização', accessor: (row) => row.dataRealizado ? new Date(row.dataRealizado + 'T12:00:00Z').toLocaleDateString() : '-' },
    { header: 'Validade', accessor: (row) => {
        if (!row.validade) return '-';
        const validade = new Date(row.validade + 'T12:00:00Z');
        const today = new Date();
        today.setHours(0,0,0,0);
        validade.setHours(0,0,0,0);
        const diffTime = validade - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
          return <span style={{color: 'var(--danger)', fontWeight: 'bold'}}>Vencido há {Math.abs(diffDays)} dias</span>;
        } else if (diffDays === 0) {
          return <span style={{color: 'var(--warning)', fontWeight: 'bold'}}>Vence hoje</span>;
        } else {
          return <span>Faltam {diffDays} dias <br/><small className="text-muted">({validade.toLocaleDateString()})</small></span>;
        }
    }},
    { header: 'Status', accessor: (row) => (
      <span className={`status-badge ${row.statusClass}`}>
        {row.computedStatus}
      </span>
    )},
    { header: 'Ações', accessor: (row) => (
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button 
          onClick={() => setSelectedTreinamento(row)} 
          style={{color: 'var(--primary)', cursor: 'pointer', background: 'none', border: 'none'}}
          title="Ver Observações e Detalhes"
        >
          <Eye size={18} />
        </button>
        <button 
          onClick={() => handleExcluir(row.id)} 
          style={{color: 'var(--danger)', cursor: 'pointer', background: 'none', border: 'none'}}
          title="Excluir Treinamento"
        >
          <Trash2 size={18} />
        </button>
      </div>
    )},
  ];

  const handleAddObservacaoForm = () => {
    if(!novaObservacao) return;
    setFormData({ ...formData, observacoes: [...formData.observacoes, novaObservacao] });
    setNovaObservacao('');
  };

  const handleRemoveObservacaoForm = (idx) => {
    setFormData({ ...formData, observacoes: formData.observacoes.filter((_, i) => i !== idx) });
  };

  const handleMatriculaChange = (e) => {
    const val = e.target.value;
    setMatriculaInstrutor(val);
    const instrutor = funcionarios.find(f => f.matricula === val);
    if (instrutor) {
      setInstrutorData(instrutor);
    } else {
      setInstrutorData(null);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        alert('Por favor, selecione um arquivo PDF.');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSave = () => {
    if (!formData.funcionario || !formData.tipo) return;
    
    let fileUrl = null;
    let fileName = null;
    if (selectedFile) {
      fileUrl = URL.createObjectURL(selectedFile);
      fileName = selectedFile.name;
    }

    setTreinamentos([...treinamentos, { 
      id: Date.now(), 
      ...formData,
      instrutor: instrutorData ? { nome: instrutorData.nome, cargo: instrutorData.cargo, empresa: instrutorData.empresa } : null,
      fileUrl,
      fileName
    }]);
    setFormData({ funcionario: '', tipo: '', dataRealizado: '', validade: '', observacoes: [] });
    setIsCustomTipo(false);
    setMatriculaInstrutor('');
    setInstrutorData(null);
    setSelectedFile(null);
    setShowForm(false);
  };

  const handleRealizadoChange = (e) => {
    const data = e.target.value;
    if (data) {
      const dataObj = new Date(data + 'T12:00:00Z');
      dataObj.setFullYear(dataObj.getFullYear() + 1);
      const yyyy = dataObj.getFullYear();
      const mm = String(dataObj.getMonth() + 1).padStart(2, '0');
      const dd = String(dataObj.getDate()).padStart(2, '0');
      setFormData({ ...formData, dataRealizado: data, validade: `${yyyy}-${mm}-${dd}` });
    } else {
      setFormData({ ...formData, dataRealizado: data });
    }
  };

  const treinamentosComStatus = treinamentos.map(t => {
    const statusInfo = getTreinamentoStatusInfo(t.validade);
    return {
      ...t,
      computedStatus: statusInfo.text,
      statusClass: statusInfo.class
    };
  });

  const filteredTreinamentos = treinamentosComStatus.filter(t => 
    (t.tipo || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (t.funcionario || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (t.computedStatus || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="title-page">Treinamentos e Certificações</h1>
          <p className="subtitle-page">Controle os treinamentos obrigatórios (NRs) dos funcionários.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> {showForm ? 'Cancelar' : 'Registrar Treinamento'}
        </Button>
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', width: '100%', maxWidth: '400px' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={18} style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Buscar por Tipo, Funcionário ou Status..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      {showForm && (
        <Card title="Novo Registro de Treinamento" className="glass-panel" style={{marginBottom: '2rem'}}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(200px, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
            <div className="input-group" style={{ marginBottom: '1rem' }}>
              <label className="input-label">Funcionário</label>
              <select className="input-field" value={formData.funcionario} onChange={e => setFormData({...formData, funcionario: e.target.value})}>
                <option value="">Selecione o funcionário</option>
                {funcionarios.map(f => (
                  <option key={f.id} value={f.nome}>{f.nome}</option>
                ))}
              </select>
            </div>
            
            <div className="input-group" style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                <label className="input-label" style={{ marginBottom: 0 }}>Tipo de Treinamento</label>
                <button 
                  onClick={() => setIsCustomTipo(!isCustomTipo)} 
                  style={{ fontSize: '0.8rem', color: 'var(--primary)', cursor: 'pointer', background: 'none', border: 'none', textDecoration: 'underline' }}
                >
                  {isCustomTipo ? 'Selecionar da lista' : '+ Novo'}
                </button>
              </div>
              {isCustomTipo ? (
                <input 
                  className="input-field" 
                  value={formData.tipo} 
                  onChange={e => setFormData({...formData, tipo: e.target.value})} 
                  placeholder="Digite o nome do novo treinamento..." 
                />
              ) : (
                <select className="input-field" value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value})}>
                  <option value="">Selecione a NR</option>
                  <option value="NR-10">NR-10 (Segurança em Instalações Elétricas)</option>
                  <option value="NR-11">NR-11 (Transporte e Movimentação de Materiais)</option>
                  <option value="NR-33">NR-33 (Espaços Confinados)</option>
                  <option value="NR-35">NR-35 (Trabalho em Altura)</option>
                </select>
              )}
            </div>

            <Input type="date" label="Data de Realização" value={formData.dataRealizado} onChange={handleRealizadoChange} />
            <Input type="date" label="Válido até" value={formData.validade} onChange={e => setFormData({...formData, validade: e.target.value})} />
            <Input label="Nº Matrícula do Instrutor" placeholder="Ex: 001" value={matriculaInstrutor} onChange={handleMatriculaChange} />
          </div>

          <div style={{ marginBottom: '1.5rem', padding: '1.5rem', backgroundColor: 'var(--background)', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }}>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>Instrutor Responsável:</h4>
            {instrutorData ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 1fr) minmax(150px, 1fr) minmax(150px, 1fr)', gap: '1rem', marginTop: '0.5rem' }}>
                <p style={{ margin: 0 }}><strong>Nome:</strong> {instrutorData.nome}</p>
                <p style={{ margin: 0 }}><strong>Cargo:</strong> {instrutorData.cargo}</p>
                <p style={{ margin: 0 }}><strong>Empresa:</strong> {instrutorData.empresa}</p>
              </div>
            ) : (
              <p className="text-muted" style={{ margin: 0 }}>Nenhum instrutor encontrado com esta matrícula.</p>
            )}
          </div>

          <div style={{border: '2px dashed var(--primary)', cursor: 'pointer', borderRadius: 'var(--radius-md)', padding: '2rem', textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-main)', position: 'relative', backgroundColor: 'var(--surface-hover)'}}>
            <input 
              type="file" 
              accept="application/pdf" 
              onChange={handleFileChange} 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
              title="Clique para anexar PDF"
            />
            {selectedFile ? (
              <>
                <FileText size={32} style={{marginBottom: '0.5rem', color: 'var(--primary)'}} />
                <p><strong>PDF Selecionado:</strong> {selectedFile.name}</p>
                <p style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>Clique ou arraste outro para trocar</p>
              </>
            ) : (
              <>
                <UploadCloud size={32} style={{marginBottom: '0.5rem', color: 'var(--primary)'}} />
                <p>Anexar Certificado ou Documento (Opcional)</p>
              </>
            )}
          </div>

          <div style={{ marginBottom: '1.5rem', backgroundColor: 'var(--background)', padding: '1.5rem', borderRadius: 'var(--radius)' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
              <List size={18} /> Observações do Treinamento
            </h4>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', alignItems: 'flex-end' }}>
              <div className="input-group" style={{ margin: 0, flex: 1 }}>
                <input 
                  className="input-field"
                  value={novaObservacao} 
                  onChange={e => setNovaObservacao(e.target.value)} 
                  placeholder="Ex: Treinamento prático pendente..." 
                />
              </div>
              <Button onClick={handleAddObservacaoForm} style={{ height: '42px', padding: '0 1rem' }}><Plus size={18}/></Button>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {formData.observacoes.length === 0 && <span className="text-muted" style={{fontSize: '0.9rem'}}>Nenhuma observação inserida...</span>}
              {formData.observacoes.map((obs, idx) => (
                <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }}>
                  <span>{obs}</span>
                  <button onClick={() => handleRemoveObservacaoForm(idx)} style={{color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer'}}>
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Button variant="secondary" onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar Registro</Button>
          </div>
        </Card>
      )}

      <Card>
        <Table data={filteredTreinamentos} columns={columns} keyExtractor={(row) => row.id} />
      </Card>

      <Modal isOpen={!!selectedTreinamento} onClose={() => setSelectedTreinamento(null)} title={`Detalhes: ${selectedTreinamento?.tipo} - ${selectedTreinamento?.funcionario}`}>
        {selectedTreinamento && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Informações</h4>
              <p><strong>Curso/NR:</strong> {selectedTreinamento.tipo}</p>
              <p><strong>Funcionário:</strong> {selectedTreinamento.funcionario}</p>
              <p><strong>Realizado em:</strong> {selectedTreinamento.dataRealizado ? new Date(selectedTreinamento.dataRealizado + 'T12:00:00Z').toLocaleDateString() : '-'}</p>
              <p><strong>Válido até:</strong> {selectedTreinamento.validade ? new Date(selectedTreinamento.validade + 'T12:00:00Z').toLocaleDateString() : '-'}</p>
            </div>

            {selectedTreinamento.instrutor && (
              <div>
                <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Instrutor Responsável</h4>
                <p><strong>Nome:</strong> {selectedTreinamento.instrutor.nome}</p>
                <p><strong>Cargo:</strong> {selectedTreinamento.instrutor.cargo}</p>
                <p><strong>Empresa:</strong> {selectedTreinamento.instrutor.empresa}</p>
              </div>
            )}

            {selectedTreinamento.fileUrl && (
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                  <FileText size={18} /> Arquivo Anexado
                </h4>
                <div style={{ padding: '1rem', backgroundColor: 'var(--background)', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{selectedTreinamento.fileName || 'Arquivo'}</span>
                  <a 
                    href={selectedTreinamento.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-primary"
                    style={{ textDecoration: 'none' }}
                  >
                    <Eye size={16} /> Abrir PDF
                  </a>
                </div>
              </div>
            )}

            <div>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--warning)' }}>
                <List size={18} /> Observações
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(!selectedTreinamento.observacoes || (Array.isArray(selectedTreinamento.observacoes) ? selectedTreinamento.observacoes.length === 0 : true)) && typeof selectedTreinamento.observacoes !== 'string' && (
                  <span className="text-muted">Nenhuma observação registrada para este treinamento.</span>
                )}
                {/* Support legacy string observation if any mock data had it that way */}
                {typeof selectedTreinamento.observacoes === 'string' && selectedTreinamento.observacoes !== '' && (
                  <li style={{ padding: '0.75rem', backgroundColor: 'var(--background)', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }}>
                    • {selectedTreinamento.observacoes}
                  </li>
                )}
                {Array.isArray(selectedTreinamento.observacoes) && selectedTreinamento.observacoes.map((obs, idx) => (
                  <li key={idx} style={{ padding: '0.75rem', backgroundColor: 'var(--background)', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }}>
                    • {obs}
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

export default Treinamentos;
