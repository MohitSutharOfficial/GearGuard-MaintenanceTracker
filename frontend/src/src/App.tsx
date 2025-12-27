import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import AuthCallback from './pages/AuthCallback';
import CalendarView from './pages/CalendarView';
import Dashboard from './pages/Dashboard';
import EquipmentDetail from './pages/EquipmentDetail';
import EquipmentList from './pages/EquipmentList';
import ForgotPassword from './pages/ForgotPassword';
import KanbanBoard from './pages/KanbanBoard';
import Login from './pages/Login';
import Reports from './pages/Reports';
import RequestList from './pages/RequestList';
import ResetPassword from './pages/ResetPassword';
import SignUp from './pages/SignUp';
import TeamList from './pages/TeamList';

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Protected Routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/kanban" element={<KanbanBoard />} />
                      <Route path="/calendar" element={<CalendarView />} />
                      <Route path="/equipment" element={<EquipmentList />} />
                      <Route path="/equipment/:id" element={<EquipmentDetail />} />
                      <Route path="/requests" element={<RequestList />} />
                      <Route path="/teams" element={<TeamList />} />
                      <Route path="/reports" element={<Reports />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}
