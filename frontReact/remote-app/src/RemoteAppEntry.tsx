import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/home/Home.page';
import AltPage from './pages/alt/Alt.page';
import ActivityList from './pages/activities/ActivityList.page'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CreateActivityForm from './pages/activities/CreateActivityForm.page';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 min
      refetchOnWindowFocus: false,
    },
  },
});


export default function RemoteAppEntry() {
  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ padding: '20px', border: '2px dashed blue' }}>
        <h3>Módulo Remoto</h3>
        
        {/* Navegação interna usando Links relativos (sem "/" no início) */}
        <nav>
          <Link to="/remote/">Início do remoto</Link> |{' '}
          <Link to="/remote/alt">Página Alternativa</Link> |{' '}
          <Link to="/remote/activities">Lista de Atividades</Link> |{' '}
          <Link to="/remote/activities/create">Criar Atividade</Link>
        </nav>

        <hr />

        {/* Roteador interno */}
        <Routes>
          {/* Equivale ao caminho base definido pelo Host */}
          <Route index element={<Home />} /> 
          <Route path="alt" element={<AltPage />} />
          <Route path="activities" element={<ActivityList />} />
          <Route path="activities/create" element={<CreateActivityForm />} />
        </Routes>
      </div>
    </QueryClientProvider>
  );
}
