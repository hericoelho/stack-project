import { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import RemoteAppEntry from './RemoteAppEntry';

function App() {

  return (
      <BrowserRouter>
      <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
        <h1>Aplication Remote (Remote)</h1>
        
        <nav style={{ marginBottom: '20px' }}>
          <Link to="/remote/">Home do Remote</Link> |{' '}
        </nav>

        <div>
          <Routes>
            {/* Rota nativa do Remote */}
            <Route path="/remote/*" element={
              <Suspense fallback={<div>Carregando Pagina...</div>}>
                <RemoteAppEntry />
              </Suspense>
            } />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
