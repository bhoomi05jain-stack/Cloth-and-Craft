import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FloatingDock } from './components/FloatingDock';
import { HomeDashboard } from './pages/HomeDashboard';
import { GenerateOutfitPage } from './pages/GenerateOutfitPage';
import { DailyInspirationPage } from './pages/DailyInspirationPage';
import { WardrobePage } from './pages/WardrobePage';
import { AddClothesPage } from './pages/AddClothesPage';
import { LaundryTrackerPage } from './pages/LaundryTrackerPage';
import { AccessoriesPage } from './pages/AccessoriesPage';
import { OutfitPlannerPage } from './pages/OutfitPlannerPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';
import { AuthPage } from './pages/AuthPage';
import { token } from './api/client';

const qc = new QueryClient();

function Shell() {
  const loc = useLocation();
  const authed = Boolean(token());
  if (!authed && loc.pathname !== '/login') return <Navigate to="/login" replace />;
  return (
    <div className="min-h-screen flex items-center justify-center p-3">
      <div className="phone-frame flex flex-col">
        <div className="px-6 pt-3 pb-1 flex justify-between text-[10px] font-bold">
          <span>9:41</span>
          <span className="tracking-widest">CRAFTY</span>
          <span>5G</span>
        </div>
        <div className="flex-1 overflow-y-auto relative">
          <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/" element={<HomeDashboard />} />
            <Route path="/generate" element={<GenerateOutfitPage />} />
            <Route path="/daily" element={<DailyInspirationPage />} />
            <Route path="/wardrobe" element={<WardrobePage />} />
            <Route path="/add" element={<AddClothesPage />} />
            <Route path="/laundry" element={<LaundryTrackerPage />} />
            <Route path="/accessories" element={<AccessoriesPage />} />
            <Route path="/planner" element={<OutfitPlannerPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/profile" element={<ProfileSettingsPage />} />
          </Routes>
        </div>
        {authed && <FloatingDock />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
