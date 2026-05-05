import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Empresas from './pages/Empresas';
import Funcionarios from './pages/Funcionarios';
import Documentos from './pages/Documentos';
import Treinamentos from './pages/Treinamentos';
import Epis from './pages/Epis';
import Acidentes from './pages/Acidentes';
import Asos from './pages/Asos';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="empresas" element={<Empresas />} />
          <Route path="funcionarios" element={<Funcionarios />} />
          <Route path="documentos" element={<Documentos />} />
          <Route path="treinamentos" element={<Treinamentos />} />
          <Route path="epis" element={<Epis />} />
          <Route path="acidentes" element={<Acidentes />} />
          <Route path="asos" element={<Asos />} />
          <Route path="*" element={
            <div>
              <h1 className="title-page">Em Construção</h1>
              <p className="subtitle-page">Esta tela será desenvolvida em breve.</p>
            </div>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
