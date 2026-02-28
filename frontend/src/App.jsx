import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ClientList from './pages/ClientList.jsx';
import ClientDetail from './pages/ClientDetail.jsx';
import ClientForm from './components/ClientForm.jsx';
import './styles/global.css';
import './styles/components.css';

function App() {
  return (
    <Router>
      <Header />
      <div className="app-container">
        <Sidebar />
        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<ClientList />} />
            <Route path="/clients/new" element={<ClientForm />} />
            <Route path="/clients/:id" element={<ClientDetail />} />
            <Route path="/clients/:id/edit" element={<ClientForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
