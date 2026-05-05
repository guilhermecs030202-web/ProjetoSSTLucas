import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { Plus, AlertTriangle, Image as ImageIcon, Search, Trash2, Eye, Edit } from 'lucide-react';

const Acidentes = () => {
  const { acidentes, setAcidentes, funcionarios } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id: null, funcionario: '', data: '', gravidade: '', descricao: '', medidas: '', imagem: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAcidente, setSelectedAcidente] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const columns = [
    { header: 'Data', accessor: (row) => new Date(row.data).toLocaleDateString() },
    { header: 'Funcionário Envolvido', accessor: (row) => <strong>{row.funcionario}</strong> },
    { header: 'Gravidade', accessor: (row) => (
      <span className={`status-badge ${row.gravidade === 'Grave' ? 'status-danger' : row.gravidade === 'Moderado' ? 'status-warning' : 'status-success'}`}>
        {row.gravidade}
      </span>
    )},
    { header: 'Ações', accessor: (row) => (
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button 
          onClick={() => handleView(row)} 
          style={{color: 'var(--primary)', cursor: 'pointer', background: 'none', border: 'none'}}
          title="Ver Ocorrência"
        >
          <Eye size={18} />
        </button>
        <button 
          onClick={() => handleEdit(row)} 
          style={{color: 'var(--warning)', cursor: 'pointer', background: 'none', border: 'none'}}
          title="Editar Ocorrência"
        >
          <Edit size={18} />
        </button>
        <button 
          onClick={() => handleDelete(row.id)} 
          style={{color: 'var(--danger)', cursor: 'pointer', background: 'none', border: 'none'}}
          title="Excluir Ocorrência"
        >
          <Trash2 size={18} />
        </button>
      </div>
    )}
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if(file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imagem: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (acidente) => {
    setFormData(acidente);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este registro de acidente?')) {
      setAcidentes(acidentes.filter(a => a.id !== id));
    }
  };

  const handleView = (acidente) => {
    setSelectedAcidente(acidente);
    setShowViewModal(true);
  };

  const handleSave = () => {
    if (!formData.funcionario || !formData.data) return;
    
    if (isEditing) {
      setAcidentes(acidentes.map(a => a.id === formData.id ? formData : a));
    } else {
      setAcidentes([...acidentes, { 
        id: Date.now(), 
        ...formData
      }]);
    }
    
    setFormData({ id: null, funcionario: '', data: '', gravidade: '', descricao: '', medidas: '', imagem: null });
    setShowForm(false);
    setIsEditing(false);
  };

  const handleCancelForm = () => {
    setFormData({ id: null, funcionario: '', data: '', gravidade: '', descricao: '', medidas: '', imagem: null });
    setShowForm(false);
    setIsEditing(false);
  };

  const filteredAcidentes = acidentes.filter(a => 
    a.funcionario.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.gravidade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="title-page">Registro de Acidentes de Trabalho</h1>
          <p className="subtitle-page">Acompanhe acidentes e anexe registros fotográficos das ocorrências.</p>
        </div>
        <Button onClick={() => showForm ? handleCancelForm() : setShowForm(true)} variant="danger">
          <AlertTriangle size={18} /> {showForm ? 'Cancelar' : 'Registrar Ocorrência'}
        </Button>
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', width: '100%', maxWidth: '400px' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={18} style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Buscar por Funcionário ou Gravidade..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      {showForm && (
        <Card title={isEditing ? "Editar Ocorrência de Acidente" : "Nova Ocorrência de Acidente"} className="glass-panel" style={{marginBottom: '2rem', borderLeft: '4px solid var(--danger)'}}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="input-group" style={{ marginBottom: '1rem' }}>
              <label className="input-label">Funcionário</label>
              <select className="input-field" value={formData.funcionario} onChange={e => setFormData({...formData, funcionario: e.target.value})}>
                <option value="">Selecione o funcionário</option>
                {funcionarios.map(f => (
                  <option key={f.id} value={f.nome}>{f.nome}</option>
                ))}
              </select>
            </div>
            
            <Input type="date" label="Data do Ocorrido" value={formData.data} onChange={e => setFormData({...formData, data: e.target.value})} />
            
            <div className="input-group" style={{ marginBottom: '1rem', gridColumn: 'span 2' }}>
              <label className="input-label">Gravidade</label>
              <select className="input-field" value={formData.gravidade} onChange={e => setFormData({...formData, gravidade: e.target.value})}>
                <option value="">Selecione a gravidade</option>
                <option value="Leve">Incidente / Leve (Sem afastamento)</option>
                <option value="Moderado">Moderado (Afastamento menor)</option>
                <option value="Grave">Grave (CAT emitida)</option>
              </select>
            </div>
            
            <div className="input-group" style={{ marginBottom: '1rem', gridColumn: 'span 2' }}>
              <label className="input-label">Descrição do Acidente</label>
              <textarea 
                className="input-field" 
                rows={3} 
                value={formData.descricao} 
                onChange={e => setFormData({...formData, descricao: e.target.value})} 
                placeholder="Descreva detalhadamente o ocorrido..."
              ></textarea>
            </div>

            <div className="input-group" style={{ marginBottom: '1rem', gridColumn: 'span 2' }}>
              <label className="input-label">Medidas Tomadas</label>
              <input 
                className="input-field" 
                value={formData.medidas} 
                onChange={e => setFormData({...formData, medidas: e.target.value})} 
                placeholder="Ações corretivas, encaminhamentos, etc."
              />
            </div>

            <div className="input-group" style={{ marginBottom: '1rem', gridColumn: 'span 2' }}>
              <label className="input-label">Anexar Fotografia / Evidência (Opcional)</label>
              <input 
                type="file"
                accept="image/*"
                className="input-field" 
                onChange={handleImageUpload}
              />
              {formData.imagem && <div style={{marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--success)'}}>Imagem selecionada com sucesso.</div>}
            </div>

          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Button variant="secondary" onClick={handleCancelForm}>Cancelar</Button>
            <Button onClick={handleSave} variant="danger">{isEditing ? 'Atualizar Ocorrência' : 'Salvar Ocorrência'}</Button>
          </div>
        </Card>
      )}

      <Card>
        <Table data={filteredAcidentes} columns={columns} keyExtractor={(row) => row.id} />
      </Card>

      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Detalhes da Ocorrência">
        {selectedAcidente && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(200px, 1fr)', gap: '1rem', backgroundColor: 'var(--surface)', padding: '1rem', borderRadius: 'var(--radius)' }}>
              <div>
                <strong style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Funcionário</strong>
                <span>{selectedAcidente.funcionario}</span>
              </div>
              <div>
                <strong style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Data do Ocorrido</strong>
                <span>{new Date(selectedAcidente.data).toLocaleDateString()}</span>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <strong style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Gravidade</strong>
                <span className={`status-badge ${selectedAcidente.gravidade === 'Grave' ? 'status-danger' : selectedAcidente.gravidade === 'Moderado' ? 'status-warning' : 'status-success'}`}>
                  {selectedAcidente.gravidade}
                </span>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius)', borderLeft: '4px solid var(--danger)' }}>
              <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Descrição do Acidente
              </h4>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                {selectedAcidente.descricao || 'Nenhuma descrição fornecida.'}
              </p>
            </div>

            <div style={{ backgroundColor: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius)', borderLeft: '4px solid var(--success)' }}>
              <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Medidas Tomadas
              </h4>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                {selectedAcidente.medidas || 'Nenhuma medida registrada.'}
              </p>
            </div>

            {selectedAcidente.imagem && (
              <div style={{ backgroundColor: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius)' }}>
                <h4 style={{ marginBottom: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ImageIcon size={18} /> Fotografia / Evidência
                </h4>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', maxHeight: '400px', overflow: 'hidden', borderRadius: 'var(--radius)', backgroundColor: 'var(--background)' }}>
                  <img src={selectedAcidente.imagem} alt="Evidência do Acidente" style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }} />
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Acidentes;
