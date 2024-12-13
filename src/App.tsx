import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Frameworks } from './pages/Frameworks';
import { Parties } from './pages/Parties';
import { Engagements } from './pages/Engagements';
import { Workflows } from './pages/Workflows';
import { WorkflowVisualizationPage } from './pages/WorkflowVisualizationPage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/frameworks"
            element={
              <ProtectedRoute>
                <Layout>
                  <Frameworks />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/parties"
            element={
              <ProtectedRoute>
                <Layout>
                  <Parties />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/engagements"
            element={
              <ProtectedRoute>
                <Layout>
                  <Engagements />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/workflows"
            element={
              <ProtectedRoute>
                <Layout>
                  <Workflows />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/workflows/visualization"
            element={
              <ProtectedRoute>
                <Layout>
                  <WorkflowVisualizationPage />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
