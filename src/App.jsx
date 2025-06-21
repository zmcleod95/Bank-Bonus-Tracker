import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, lazy } from 'react';
import { PlayerProvider } from '@/context/PlayerContext';
import Layout from '@/components/layout/Layout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import './App.css';

// Lazy load pages for better performance
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const BonusCatalog = lazy(() => import('@/pages/BonusCatalog'));
const BonusDetail = lazy(() => import('@/pages/BonusDetail'));
const Tracking = lazy(() => import('@/pages/Tracking'));
const Comparison = lazy(() => import('@/pages/Comparison'));
const Settings = lazy(() => import('@/pages/Settings'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Optimize QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Keep data in cache for 10 minutes
      cacheTime: 10 * 60 * 1000,
      // Retry failed requests 2 times
      retry: 2,
      // Don't refetch on window focus by default
      refetchOnWindowFocus: false,
      // Don't refetch on reconnect by default
      refetchOnReconnect: false,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PlayerProvider>
        <Router>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="bonuses" element={<BonusCatalog />} />
                <Route path="bonuses/:id" element={<BonusDetail />} />
                <Route path="tracking" element={<Tracking />} />
                <Route path="comparison" element={<Comparison />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </PlayerProvider>
    </QueryClientProvider>
  );
}

export default App;

