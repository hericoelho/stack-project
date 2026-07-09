import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/home/Home.page.tsx';

// Carregamento assíncrono (Lazy) do módulo federado
const RemoteAppEntry = React.lazy(() => import('remoteApp/RemoteAppEntry'));

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
        <h1>Aplication Main (Host)</h1>
        
        <nav style={{ marginBottom: '20px' }}>
          <Link to="/">Home do Host</Link> |{' '}
          <Link to="/remote">Ir para remote</Link> |{' '}
        </nav>

        <div>
          <Routes>
            {/* Rota nativa do Host */}
            <Route index element={<Home />} /> 

            {/* O "/*" é OBRIGATÓRIO para que as sub-rotas do Remote funcionem */}
            <Route path="/remote/*" element={
              <Suspense fallback={<div>Carregando Remoto...</div>}>
                <RemoteAppEntry />
              </Suspense>
            } />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
