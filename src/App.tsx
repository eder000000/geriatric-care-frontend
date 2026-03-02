import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { AppShell } from '@/components/layout/AppShell';
import { LoginPage } from '@/pages/auth/LoginPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { PatientsPage } from '@/pages/patients/PatientsPage';
import { PatientDetailPage } from '@/pages/patients/PatientDetailPage';
import { VitalSignsPage } from '@/pages/vitalsigns/VitalSignsPage';
import { MedicationsPage } from '@/pages/medications/MedicationsPage';
import { CarePlansPage } from '@/pages/careplans/CarePlansPage';
import { AlertsPage } from '@/pages/alerts/AlertsPage';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard"    element={<DashboardPage />} />
              <Route path="patients"     element={<PatientsPage />} />
              <Route path="patients/:id" element={<PatientDetailPage />} />
              <Route path="vital-signs"  element={<VitalSignsPage />} />
              <Route path="medications"  element={<MedicationsPage />} />
              <Route path="care-plans"   element={<CarePlansPage />} />
              <Route path="alerts"       element={<AlertsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
