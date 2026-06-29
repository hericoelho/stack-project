import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import AltPage from './pages/AltPage';

export default function RemoteAppEntry() {
  return (
    <div style={{ padding: '20px', border: '2px dashed blue' }}>
      <h3>Módulo Remoto</h3>
      
      {/* Navegação interna usando Links relativos (sem "/" no início) */}
      <nav>
        <Link to="/remote/">Início do remoto</Link> |{' '}
        <Link to="/remote/alt">Página Alternativa</Link>
      </nav>

      <hr />

      {/* Roteador interno */}
      <Routes>
        {/* Equivale ao caminho base definido pelo Host */}
        <Route index element={<Home />} /> 
        <Route path="alt" element={<AltPage />} />
      </Routes>
    </div>
  );
}
