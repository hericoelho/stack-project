import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/home/Home.page';
import AltPage from './pages/alt/Alt.page';
import ActivityList from './pages/activities/ActivityList.page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CreateActivityForm from './pages/activities/CreateActivityForm.page';
import './remote.css';
import { Toaster } from 'sonner';
import { useSseNotifications } from './pages/activities/hooks/useSseNotifications.hook';
import { SseProvider } from './contexts/SseProvider';
import type { ActivityStatusMessage } from './pages/activities/types/activity.types';

const parseActivityEvent = (raw: unknown) => raw as ActivityStatusMessage;

const baseUrl = import.meta.env.VITE_BFF_API_BASE_URL;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 min
      refetchOnWindowFocus: false,
    },
  },
});

function SseToastListener() {
  useSseNotifications();
  return null;
}


export default function RemoteAppEntry() {
  return (
    <QueryClientProvider client={queryClient}>  
      <SseProvider<ActivityStatusMessage> url={`${baseUrl}/activities/stream`} parseEvent={parseActivityEvent}>
        <SseToastListener />
        <Toaster position="top-right" richColors />
        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Módulo Remoto</h3>
          
          <nav className="flex flex-wrap justify-center gap-3 text-sm mb-4">
            <Link to="/remote/" className="text-indigo-600 dark:text-indigo-400 hover:underline">Início do remoto</Link>
            <Link to="/remote/alt" className="text-indigo-600 dark:text-indigo-400 hover:underline">Página Alternativa</Link>
            <Link to="/remote/activities" className="text-indigo-600 dark:text-indigo-400 hover:underline">Lista de Atividades</Link>
            <Link to="/remote/activities/create" className="text-indigo-600 dark:text-indigo-400 hover:underline">Criar Atividade</Link>
          </nav>

          <hr className="border-gray-200 dark:border-gray-700 mb-4" />

          <Routes>
            <Route index element={<Home />} /> 
            <Route path="alt" element={<AltPage />} />
            <Route path="activities" element={<ActivityList />} />
            <Route path="activities/create" element={<CreateActivityForm />} />
          </Routes>
        </div>
      </SseProvider>
    </QueryClientProvider>
  );
}
