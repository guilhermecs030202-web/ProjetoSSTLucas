import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { UploadCloud, FileText, Trash2, Eye, Plus, List, Search, Settings } from 'lucide-react';

const Documentos = () => {
  const { documentos, setDocumentos, empresas, tiposDocumento, setTiposDocumento } = useAppContext();
  
  const getInitialDates = () => {
    const today = new Date().toISOString().split('T')[0];
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    return { dataElaboracao: today, validade: nextYear.toISOString().split('T')[0] };
  };

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ tipo: '', empresa: '', ...getInitialDates(), observacoes: [] });
  const [novaObservacao, setNovaObservacao] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [showConfigModal, setShowConfigModal] = useState(false);
  const [novoTipoDoc, setNovoTipoDoc] = useState('');

  // States for Details Modal
  const [selectedDoc, setSelectedDoc] = useState(null);

  const handleExcluir = (id) => {
    if(window.confirm('Tem certeza que deseja excluir este documento?')) {
      setDocumentos(documentos.filter(d => d.id !== id));
    }
  };

  const handleAddTipoDoc = () => {
    if(!novoTipoDoc || tiposDocumento.includes(novoTipoDoc)) return;
    setTiposDocumento([...tiposDocumento, novoTipoDoc]);
    setNovoTipoDoc('');
  };

  const handleRemoverTipoDoc = (tipo) => {
    if(window.confirm(`Remover "${tipo}" das opções?`)) {
      setTiposDocumento(tiposDocumento.filter(t => t !== tipo));
    }
  };

  const getDocStatusInfo = (validadeDate) => {
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
    { header: 'Tipo do Documento', accessor: (row) => <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)'}}> <FileText size={16} /> <strong>{row.tipo}</strong></div> },
    { header: 'Empresa', accessor: (row) => row.empresa },
    { header: 'Data de Revisão', accessor: (row) => row.validade ? new Date(row.validade + 'T12:00:00Z').toLocaleDateString() : '-' },
    { header: 'Status', accessor: (row) => (
      <span className={`status-badge ${row.statusClass}`}>
        {row.computedStatus}
      </span>
    )},
    { header: 'Ações', accessor: (row) => (
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button 
          onClick={() => setSelectedDoc(row)} 
          style={{color: 'var(--primary)', cursor: 'pointer', background: 'none', border: 'none'}}
          title="Ver Observações"
        >
          <Eye size={18} />
        </button>
        <button 
          onClick={() => handleExcluir(row.id)} 
          style={{color: 'var(--danger)', cursor: 'pointer', background: 'none', border: 'none'}}
          title="Excluir Documento"
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
    if (!formData.tipo || !formData.empresa) return;

    let fileUrl = null;
    let fileName = null;
    if (selectedFile) {
      fileUrl = URL.createObjectURL(selectedFile);
      fileName = selectedFile.name;
    }

    setDocumentos([...documentos, { 
      id: Date.now(), 
      ...formData, 
      dataUpload: new Date().toISOString().split('T')[0],
      fileUrl,
      fileName
    }]);
    setFormData({ tipo: '', empresa: '', ...getInitialDates(), observacoes: [] });
    setSelectedFile(null);
    setShowForm(false);
  };

  const documentosComStatus = documentos.map(d => {
    const statusInfo = getDocStatusInfo(d.validade);
    return {
      ...d,
      computedStatus: statusInfo.text,
      statusClass: statusInfo.class
    };
  });

  const filteredDocumentos = documentosComStatus.filter(d => 
    (d.tipo || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (d.empresa || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (d.computedStatus || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="title-page">Documentos de SST</h1>
          <p className="subtitle-page">Repositório de arquivos como PGR, PCMSO e LTCAT.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="secondary" onClick={() => setShowConfigModal(true)} title="Configurar Tipos de Documentos">
            <Settings size={18} /> Configurar
          </Button>
          <Button onClick={() => setShowForm(!showForm)}>
            <UploadCloud size={18} /> {showForm ? 'Cancelar' : 'Anexar Documento'}
          </Button>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', width: '100%', maxWidth: '400px' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={18} style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Buscar por Tipo, Empresa ou Status..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      {showForm && (
        <Card title="Envio de Documento" className="glass-panel" style={{marginBottom: '2rem'}}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div className="input-group" style={{ marginBottom: '1rem' }}>
              <label className="input-label">Tipo de Documento</label>
              <select className="input-field" value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value})}>
                <option value="">Selecione o tipo</option>
                {tiposDocumento.map((tipo, idx) => (
                  <option key={idx} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>
            
            <div className="input-group" style={{ marginBottom: '1rem' }}>
              <label className="input-label">Empresa Vinculada</label>
              <select className="input-field" value={formData.empresa} onChange={e => setFormData({...formData, empresa: e.target.value})}>
                <option value="">Selecione a empresa</option>
                {empresas.map(emp => (
                  <option key={emp.id} value={emp.nome}>{emp.nome}</option>
                ))}
              </select>
            </div>

            <Input 
              type="date" 
              label="Data de Elaboração" 
              value={formData.dataElaboracao || ''} 
              onChange={e => {
                const val = e.target.value;
                if (!val) {
                  setFormData({...formData, dataElaboracao: val});
                  return;
                }
                const newDate = new Date(val + 'T12:00:00Z');
                newDate.setFullYear(newDate.getFullYear() + 1);
                setFormData({...formData, dataElaboracao: val, validade: newDate.toISOString().split('T')[0]});
              }} 
            />
            <Input type="date" label="Data de Revisão" value={formData.validade || ''} onChange={e => setFormData({...formData, validade: e.target.value})} />
          </div>

          <div style={{ marginBottom: '1.5rem', backgroundColor: 'var(--background)', padding: '1.5rem', borderRadius: 'var(--radius)' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
              <List size={18} /> Observações do Documento
            </h4>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', alignItems: 'flex-end' }}>
              <div className="input-group" style={{ margin: 0, flex: 1 }}>
                <input 
                  className="input-field"
                  value={novaObservacao} 
                  onChange={e => setNovaObservacao(e.target.value)} 
                  placeholder="Ex: Refazer medição de ruído..." 
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
          
          <div style={{border: '2px dashed var(--primary)', cursor: 'pointer', borderRadius: 'var(--radius-md)', padding: '2rem', textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-main)', position: 'relative', backgroundColor: 'var(--surface-hover)'}}>
            <input 
              type="file" 
              accept="application/pdf" 
              onChange={handleFileChange} 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
              title="Clique para selecionar o PDF"
            />
            {selectedFile ? (
              <>
                <FileText size={32} style={{marginBottom: '0.5rem', color: 'var(--primary)'}} />
                <p><strong>Arquivo selecionado:</strong> {selectedFile.name}</p>
                <p style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>Clique ou arraste outro para trocar</p>
              </>
            ) : (
              <>
                <UploadCloud size={32} style={{marginBottom: '0.5rem', color: 'var(--primary)'}} />
                <p>Arraste e solte o arquivo PDF aqui, ou clique para selecionar</p>
              </>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Button variant="secondary" onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar Documento</Button>
          </div>
        </Card>
      )}

      <Card>
        <Table data={filteredDocumentos} columns={columns} keyExtractor={(row) => row.id} />
      </Card>

      <Modal isOpen={!!selectedDoc} onClose={() => setSelectedDoc(null)} title={`Detalhes: ${selectedDoc?.tipo} - ${selectedDoc?.empresa}`}>
        {selectedDoc && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Informações</h4>
              <p><strong>Tipo:</strong> {selectedDoc.tipo}</p>
              <p><strong>Empresa:</strong> {selectedDoc.empresa}</p>
              <p><strong>Enviado em:</strong> {selectedDoc.dataUpload ? new Date(selectedDoc.dataUpload + 'T12:00:00Z').toLocaleDateString() : '-'}</p>
              <p><strong>Data de Elaboração:</strong> {selectedDoc.dataElaboracao ? new Date(selectedDoc.dataElaboracao + 'T12:00:00Z').toLocaleDateString() : '-'}</p>
              <p><strong>Data de Revisão:</strong> {selectedDoc.validade ? new Date(selectedDoc.validade + 'T12:00:00Z').toLocaleDateString() : '-'}</p>
            </div>

            <div>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--warning)' }}>
                <List size={18} /> Observações
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(!selectedDoc.observacoes || selectedDoc.observacoes.length === 0) && (
                  <span className="text-muted">Nenhuma observação registrada para este documento.</span>
                )}
                {(selectedDoc.observacoes || []).map((obs, idx) => (
                  <li key={idx} style={{ padding: '0.75rem', backgroundColor: 'var(--background)', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }}>
                    • {obs}
                  </li>
                ))}
              </ul>
            </div>

            {selectedDoc.fileUrl && (
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                  <FileText size={18} /> Arquivo Anexado
                </h4>
                <div style={{ padding: '1rem', backgroundColor: 'var(--background)', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{selectedDoc.fileName || 'Documento.pdf'}</span>
                  <a 
                    href={selectedDoc.fileUrl} 
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
          </div>
        )}
      </Modal>

      <Modal isOpen={showConfigModal} onClose={() => setShowConfigModal(false)} title="Configurar Tipos de Documentos">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label className="input-label">Adicionar Novo Tipo</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                className="input-field" 
                value={novoTipoDoc} 
                onChange={e => setNovoTipoDoc(e.target.value)} 
                placeholder="Ex: PPRA, PCMAT..."
              />
              <Button onClick={handleAddTipoDoc} style={{ padding: '0 1rem' }}><Plus size={18} /></Button>
            </div>
          </div>
          
          <div>
            <h4 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Opções Atuais</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {tiposDocumento.length === 0 && <span className="text-muted">Nenhum tipo cadastrado.</span>}
              {tiposDocumento.map((tipo, idx) => (
                <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: 'var(--background)', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }}>
                  <span>{tipo}</span>
                  <button onClick={() => handleRemoverTipoDoc(tipo)} style={{color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer'}}>
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default Documentos;
