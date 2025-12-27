import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { AppProvider } from './context/AppContext';
import CalendarView from './pages/CalendarView';
import Dashboard from './pages/Dashboard';
import EquipmentDetail from './pages/EquipmentDetail';
import EquipmentList from './pages/EquipmentList';
import KanbanBoard from './pages/KanbanBoard';
import Reports from './pages/Reports';
import RequestList from './pages/RequestList';
import TeamList from './pages/TeamList';

export default function App() {
  return (
    <AppProvider>
      <Router>
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
      </Router>
    </AppProvider>
  );
}
