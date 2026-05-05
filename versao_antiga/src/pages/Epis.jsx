import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { Plus, ShoppingCart, Trash2, Eye, Building, DollarSign, Package, CheckCircle } from 'lucide-react';

const Epis = () => {
  const { epis, setEpis, empresas } = useAppContext();
  
  // States para o fluxo de nova compra
  const [showNewCompra, setShowNewCompra] = useState(false);
  const [carrinho, setCarrinho] = useState([]);
  
  const [formData, setFormData] = useState({
    nome: '', ca: '', descricao: '', quantidade: '', preco: ''
  });
  
  const [destinos, setDestinos] = useState([]);
  const [empresaSelect, setEmpresaSelect] = useState('');
  const [qtdEmpresa, setQtdEmpresa] = useState('');

  // Detalhes da Compra
  const [selectedCompra, setSelectedCompra] = useState(null);

  const handleAddDestino = () => {
    if (!empresaSelect || !qtdEmpresa || parseInt(qtdEmpresa) <= 0) return;
    setDestinos([...destinos, { empresa: empresaSelect, quantidade: parseInt(qtdEmpresa) }]);
    setEmpresaSelect('');
    setQtdEmpresa('');
  };

  const handleRemoveDestino = (idx) => {
    setDestinos(destinos.filter((_, i) => i !== idx));
  };

  const handleAddItemToCarrinho = () => {
    if (!formData.nome || !formData.quantidade || !formData.preco) {
      alert("Preencha Nome, Quantidade e Preço do equipamento.");
      return;
    }
    
    const totalDestinado = destinos.reduce((acc, d) => acc + d.quantidade, 0);
    if (totalDestinado > parseInt(formData.quantidade)) {
      alert("Você destinou mais itens do que a quantidade que está comprando!");
      return;
    }

    setCarrinho([...carrinho, {
      idItem: Date.now(),
      nome: formData.nome,
      ca: formData.ca,
      descricao: formData.descricao,
      quantidade: parseInt(formData.quantidade),
      preco: parseFloat(formData.preco),
      destinos: destinos
    }]);

    setFormData({ nome: '', ca: '', descricao: '', quantidade: '', preco: '' });
    setDestinos([]);
  };

  const handleRemoveFromCarrinho = (idItem) => {
    setCarrinho(carrinho.filter(c => c.idItem !== idItem));
  };

  const handleFinalizarCompra = () => {
    if (carrinho.length === 0) return;
    const total = carrinho.reduce((acc, item) => acc + (item.quantidade * item.preco), 0);
    
    const novaCompra = {
      id: Date.now(),
      dataCompra: new Date().toISOString().split('T')[0],
      totalCompra: total,
      itens: carrinho
    };
    
    setEpis([novaCompra, ...epis]);
    setCarrinho([]);
    setShowNewCompra(false);
  };

  const handleExcluirCompra = (id) => {
    if (window.confirm("Deseja realmente excluir este Relatório de Compra inteiro?")) {
      setEpis(epis.filter(c => c.id !== id));
    }
  };

  const columns = [
    { header: 'Registro', accessor: (row) => <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)'}}> <ShoppingCart size={16} /> <strong>#{String(row.id).slice(-6)}</strong></div> },
    { header: 'Data da Compra', accessor: (row) => row.dataCompra ? new Date(row.dataCompra + 'T12:00:00Z').toLocaleDateString() : 'Legado' },
    { header: 'Valor Total', accessor: (row) => <strong style={{color: 'var(--success)'}}>R$ {(row.totalCompra || 0).toFixed(2).replace('.', ',')}</strong> },
    { header: 'Ações', accessor: (row) => (
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button 
          onClick={() => setSelectedCompra(row)} 
          style={{color: 'var(--primary)', cursor: 'pointer', background: 'none', border: 'none'}}
          title="Ver Detalhes e Destinações"
        >
          <Eye size={18} />
        </button>
        <button 
          onClick={() => handleExcluirCompra(row.id)} 
          style={{color: 'var(--danger)', cursor: 'pointer', background: 'none', border: 'none'}}
          title="Excluir Registro"
        >
          <Trash2 size={18} />
        </button>
      </div>
    )}
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="title-page">Relatório de Compras (EPIs)</h1>
          <p className="subtitle-page">Fechamento financeiro e distribuição de Equipamentos de Proteção para as empresas.</p>
        </div>
        <Button onClick={() => setShowNewCompra(!showNewCompra)}>
          <Plus size={18} /> {showNewCompra ? 'Fechar Painel' : 'Novo Registro de Compras'}
        </Button>
      </div>

      {showNewCompra && (
        <Card title="Montar Novo Registro de Compras" className="glass-panel" style={{marginBottom: '2rem'}}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 300px', gap: '2rem' }}>
            
            {/* Esquerda: Adição de Itens */}
            <div>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                <Package size={18} /> Cadastrar Equipamento Adquirido
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <Input label="Nome do EPI *" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} placeholder="Ex: Capacete, Luva..." />
                <Input label="CA" value={formData.ca} onChange={e => setFormData({...formData, ca: e.target.value})} placeholder="Opcional" />
                <div style={{ gridColumn: '1 / -1' }}>
                  <Input label="Descrição" value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} placeholder="Material, tamanho, cor..." />
                </div>
                <Input label="Quantidade *" type="number" min="1" value={formData.quantidade} onChange={e => setFormData({...formData, quantidade: e.target.value})} />
                <div className="input-group" style={{ margin: 0 }}>
                  <label className="input-label">Preço Unitário (R$) *</label>
                  <input 
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="input-field"
                    value={formData.preco}
                    onChange={e => setFormData({...formData, preco: e.target.value})}
                  />
                </div>
              </div>

              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-main)', marginTop: '1.5rem' }}>
                <Building size={16} /> Destinação / Rateio
              </h4>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', marginBottom: '1rem' }}>
                <div className="input-group" style={{ margin: 0, flex: 2 }}>
                  <select className="input-field" value={empresaSelect} onChange={e => setEmpresaSelect(e.target.value)}>
                    <option value="">Empresa...</option>
                    {empresas.map(emp => (
                      <option key={emp.id} value={emp.nome}>{emp.nome}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group" style={{ margin: 0, flex: 1 }}>
                  <input 
                    type="number" 
                    min="1" 
                    placeholder="Qtd" 
                    className="input-field" 
                    value={qtdEmpresa} 
                    onChange={e => setQtdEmpresa(e.target.value)} 
                  />
                </div>
                <Button onClick={handleAddDestino} style={{ height: '42px', padding: '0 1rem' }}><Plus size={18}/></Button>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {destinos.length === 0 && <span className="text-muted" style={{fontSize: '0.85rem'}}>Ainda não rateado. Ficará como estoque geral.</span>}
                {destinos.map((dest, idx) => (
                  <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }}>
                    <span><strong style={{color: 'var(--primary)'}}>{dest.quantidade} cx/un</strong> - {dest.empresa}</span>
                    <button onClick={() => handleRemoveDestino(idx)} style={{color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer'}}>
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>

              <Button onClick={handleAddItemToCarrinho} variant="secondary" style={{ width: '100%' }}>Adicionar ao Carrinho de Compras</Button>
            </div>

            {/* Direita: Carrinho */}
            <div style={{ backgroundColor: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
                <ShoppingCart size={18} /> Lista da Compra
              </h4>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '350px', overflowY: 'auto' }}>
                {carrinho.length === 0 && <p className="text-muted">Seu carrinho está vazio.</p>}
                
                {carrinho.map(item => (
                  <li key={item.idItem} style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <strong>{item.quantidade}x {item.nome}</strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>R$ {item.preco.toFixed(2)} un. | Total: <span style={{color: 'var(--success)'}}>R$ {(item.quantidade * item.preco).toFixed(2)}</span></div>
                      </div>
                      <button onClick={() => handleRemoveFromCarrinho(item.idItem)} style={{color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer'}}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {carrinho.length > 0 && (
                <div style={{ marginTop: '2rem', borderTop: '2px dashed var(--border)', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.1rem' }}>
                    <strong>Total Geral:</strong>
                    <strong style={{ color: 'var(--success)' }}>
                      R$ {carrinho.reduce((acc, i) => acc + (i.quantidade * i.preco), 0).toFixed(2).replace('.', ',')}
                    </strong>
                  </div>
                  <Button onClick={handleFinalizarCompra} style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={18} /> Registrar Fechamento
                  </Button>
                </div>
              )}
            </div>

          </div>
        </Card>
      )}

      <Card>
        <Table data={epis} columns={columns} keyExtractor={(row) => row.id} />
      </Card>

      <Modal isOpen={!!selectedCompra} onClose={() => setSelectedCompra(null)} title={`Desdobramento da Compra #${String(selectedCompra?.id).slice(-6)}`}>
        {selectedCompra && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'var(--background)', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem', border: '1px solid var(--border-light)' }}>
              <div>
                <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)' }}>Data da Realização</p>
                <h4 style={{ margin: 0, color: 'var(--text-main)' }}>{selectedCompra.dataCompra ? new Date(selectedCompra.dataCompra + 'T12:00:00Z').toLocaleDateString() : 'Módulo Antigo'}</h4>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)' }}>Investimento Total</p>
                <h4 style={{ margin: 0, color: 'var(--success)', fontSize: '1.4rem' }}>R$ {(selectedCompra.totalCompra || 0).toFixed(2).replace('.', ',')}</h4>
              </div>
            </div>

            <h4 style={{ marginBottom: '1rem', color: 'var(--primary)' }}><Package size={18} style={{verticalAlign: 'middle', marginRight: '0.5rem'}}/> Equipamentos Adquiridos ({selectedCompra.itens?.length || 0})</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(selectedCompra.itens || []).map((item, index) => (
                <div key={index} style={{ backgroundColor: 'var(--background)', padding: '1rem', borderRadius: 'var(--radius)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
                    <div>
                      <strong style={{ fontSize: '1.1rem' }}>{item.nome}</strong> {item.ca ? <span className="text-muted" style={{fontSize:'0.85rem'}}>| CA: {item.ca}</span> : null}
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{item.descricao || 'Nenhuma descrição técnica extra'}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: '0 0 0.25rem 0' }}><strong>{item.quantidade || 0}cx/un</strong></p>
                      <p style={{ margin: 0, color: 'var(--success)' }}>R$ {((item.quantidade || 0) * (item.preco || 0)).toFixed(2).replace('.', ',')}</p>
                    </div>
                  </div>
                  
                  {/* Rateio Info */}
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Distribuição deste item:</strong>
                    {(!item.destinos || item.destinos.length === 0) ? (
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>• 100% Retido (Estoque Geral)</p>
                    ) : (
                      <ul style={{ margin: '0.5rem 0 0 0', padding: 0, listStyle: 'none' }}>
                        {item.destinos.map((dest, didx) => (
                          <li key={didx} style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                            • Enviados <strong>{dest.quantidade} unid.</strong> para <strong>{dest.empresa}</strong>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
          </div>
        )}
      </Modal>

    </div>
  );
};

export default Epis;
