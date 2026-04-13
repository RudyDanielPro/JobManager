import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import CompanyDashboard from "./pages/CompanyDashboard";
import CandidateDashboard from "./pages/CandidateDashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./pages/admin/AdminLayout";
import CompanyJobs from "./pages/CompanyJobs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Todas las rutas con Layout (incluye Navbar) */}
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              <Route path="/profile" element={<Profile />} />

              {/* Rutas protegidas con Layout */}
              <Route
                path="/company/dashboard"
                element={
                  <ProtectedRoute requiredRole="RECRUITER">
                    <CompanyDashboard />
                  </ProtectedRoute>
                }
              />
              {/* Nueva ruta: Ver ofertas de la empresa (competencia) */}
              <Route
                path="/company/jobs"
                element={
                  <ProtectedRoute requiredRole="RECRUITER">
                    <CompanyJobs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/candidate/dashboard"
                element={
                  <ProtectedRoute requiredRole="CANDIDATO">
                    <CandidateDashboard />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Admin routes */}
            <Route element={<AdminLayout />}>
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;