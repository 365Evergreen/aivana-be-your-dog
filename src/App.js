
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SidebarMenu from './components/layout/SidebarMenu';
import Dashboard from './pages/Dashboard';
import EmailPage from './pages/EmailPage';
import CalendarPage from './pages/CalendarPage';
import FilesPage from './pages/FilesPage';
import ChatPage from './pages/ChatPage';
import AdminPage from './pages/AdminPage';
import './assets/styles/global.css';
import './assets/styles/dashboard.css';


function App() {
  return (
    <Router>
      <div className="dashboard-root">
        <SidebarMenu />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/email" element={<EmailPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/files" element={<FilesPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
