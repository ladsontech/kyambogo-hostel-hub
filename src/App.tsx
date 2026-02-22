
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import HostelDetails from "./pages/HostelDetails";
import AdminAuth from "./pages/admin/AdminAuth";
import AdminDashboard from "./pages/admin/AdminDashboard";
import BrokerAuth from "./pages/broker/BrokerAuth";
import BrokerDashboard from "./pages/broker/BrokerDashboard";
import BrokerRules from "./pages/broker/BrokerRules";
import ServicesPage from "./pages/ServicesPage";
import HelpPage from "./pages/HelpPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import TamuPage from "./pages/TamuPage";
import NotFound from "./pages/NotFound";

import { TamuAssistant } from "./components/TamuAssistant";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/hostels" element={<Index />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/hostel/:id" element={<HostelDetails />} />
          <Route path="/admin" element={<AdminAuth />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/owner" element={<BrokerAuth />} />
          <Route path="/owner/dashboard" element={<BrokerDashboard />} />
          <Route path="/broker/rules" element={<BrokerRules />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/tamu" element={<TamuPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <TamuAssistant />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
