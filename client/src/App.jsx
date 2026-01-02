import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import AnalysisResult from './pages/AnalysisResult';

function Layout({ children }) {
  const location = useLocation();
  // Hide navbar on login page if desired, or keep it. Let's keep it for now but maybe simpler style.
  // Requirement Says: Navbar Style: Fixed at the top.
  // LOGIN PAGE Requirement: Layout: Centered vertically and horizontally. Navbar might be distracting or it might be fine.
  // Let's explicitly include Navbar on all pages for consistency.

  return (
    <div className="min-h-screen text-white font-sans antialiased selection:bg-blue-500/30 selection:text-blue-200">
      <Navbar />
      <main>
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/results" element={<AnalysisResult />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
