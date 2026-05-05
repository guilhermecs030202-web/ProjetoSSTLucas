import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const loadInitialData = (key, defaultData) => {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultData;
      }
    }
    return defaultData;
  };

  const [empresas, setEmpresas] = useState(() => loadInitialData('sst_empresas', [
    { id: 1, nome: 'Construtora Alpha', cnpj: '11.111.111/0001-11', cargos: ['Encanador', 'Engenheira de Segurança', 'Pedreiro'], cipa: ['Marta Lira', 'José Carlos'] },
    { id: 2, nome: 'Logística Beta', cnpj: '22.222.222/0001-22', cargos: ['Motorista', 'Ajudante Geral', 'Supervisor'], cipa: ['Felipe Goulart'] },
  ]));

  const [funcionarios, setFuncionarios] = useState(() => loadInitialData('sst_funcionarios', [
    { id: 1, matricula: '001', nome: 'João Silva', cpf: '111.111.111-11', cargo: 'Encanador', empresa: 'Construtora Alpha', admissao: '2025-01-10', nascimento: '1985-05-20' },
    { id: 2, matricula: '002', nome: 'Ana Costa', cpf: '222.222.222-22', cargo: 'Engenheira de Segurança', empresa: 'Construtora Alpha', admissao: '2024-05-15', nascimento: '1990-11-10' },
    { id: 3, matricula: '003', nome: 'Pedro Barros', cpf: '333.333.333-33', cargo: 'Motorista', empresa: 'Logística Beta', admissao: '2023-11-20', nascimento: '1978-02-28' },
  ]));

  const [documentos, setDocumentos] = useState(() => loadInitialData('sst_documentos', [
    { id: 1, tipo: 'PGR', empresa: 'Construtora Alpha', dataUpload: '2026-01-10', validade: '2027-01-10', status: 'Válido' },
  ]));

  const [tiposDocumento, setTiposDocumento] = useState(() => loadInitialData('sst_tipos_doc', [
    'PGR', 'PCMSO', 'LTCAT', 'AET'
  ]));

  const [treinamentos, setTreinamentos] = useState(() => loadInitialData('sst_treinamentos', [
    { id: 1, funcionario: 'João Silva', tipo: 'NR-35', dataRealizado: '2025-05-10', validade: '2027-05-10', status: 'Válido', observacoes: 'Treinamento prático realizado na torre A.' },
    { id: 2, funcionario: 'Ana Costa', tipo: 'NR-10', dataRealizado: '2024-02-15', validade: '2026-02-15', status: 'Vencendo', observacoes: 'Pendente envio de certificado.' },
  ]));

  const [epis, setEpis] = useState(() => loadInitialData('sst_epis', [
    { 
      id: 1, 
      dataCompra: new Date().toISOString().split('T')[0],
      totalCompra: 750.00,
      itens: [
        { 
          idItem: 101,
          nome: 'Luva de Raspa', ca: '12345', descricao: 'Material reforçado', 
          quantidade: 50, preco: 15.00, 
          destinos: [
            { empresa: 'Construtora Alpha', quantidade: 30 },
            { empresa: 'Logística Beta', quantidade: 20 }
          ]
        }
      ]
    }
  ]));

  const [acidentes, setAcidentes] = useState(() => loadInitialData('sst_acidentes', [
    { id: 1, funcionario: 'João Silva', data: '2026-02-10', gravidade: 'Leve', descricao: 'Corte superficial no dedo ao manusear ferramenta.', medidas: 'Curativo local e orientação de segurança.', imagem: null }
  ]));

  const [asos, setAsos] = useState(() => loadInitialData('sst_asos', [
    { id: 1, funcionario: 'João Silva', tipo: 'Admissional', dataExame: '2025-01-10', validade: '2026-01-10', status: 'Apto', riscos: 'Ruído intermitente. Ausência de riscos químicos e biológicos.', exames: [{ nome: 'Audiometria', data: '2025-01-08' }, { nome: 'Hemograma Completo', data: '2025-01-05' }] },
    { id: 2, funcionario: 'Ana Costa', tipo: 'Periódico', dataExame: '2024-05-15', validade: '2025-05-15', status: 'Inapto Temporariamente', riscos: 'Risco ergonômico relatado no PGR.', exames: [{ nome: 'Avaliação Clínica', data: '2024-05-15' }] },
    { id: 3, funcionario: 'Pedro Barros', tipo: 'Admissional', dataExame: '2023-11-20', validade: '2024-11-20', status: 'Apto', riscos: 'Ausência de riscos ocupacionais específicos para a função.', exames: [] },
  ]));

  // Auto-save to localStorage
  useEffect(() => { localStorage.setItem('sst_empresas', JSON.stringify(empresas)); }, [empresas]);
  useEffect(() => { localStorage.setItem('sst_funcionarios', JSON.stringify(funcionarios)); }, [funcionarios]);
  useEffect(() => { localStorage.setItem('sst_documentos', JSON.stringify(documentos)); }, [documentos]);
  useEffect(() => { localStorage.setItem('sst_treinamentos', JSON.stringify(treinamentos)); }, [treinamentos]);
  useEffect(() => { localStorage.setItem('sst_epis', JSON.stringify(epis)); }, [epis]);
  useEffect(() => { localStorage.setItem('sst_acidentes', JSON.stringify(acidentes)); }, [acidentes]);
  useEffect(() => { localStorage.setItem('sst_asos', JSON.stringify(asos)); }, [asos]);
  useEffect(() => { localStorage.setItem('sst_tipos_doc', JSON.stringify(tiposDocumento)); }, [tiposDocumento]);

  return (
    <AppContext.Provider value={{
      empresas, setEmpresas,
      funcionarios, setFuncionarios,
      documentos, setDocumentos,
      treinamentos, setTreinamentos,
      epis, setEpis,
      acidentes, setAcidentes,
      asos, setAsos,
      tiposDocumento, setTiposDocumento
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext deve ser usado dentro de um AppProvider');
  }
  return context;
};
