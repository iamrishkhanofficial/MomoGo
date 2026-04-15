import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CustomerAuth from "./pages/CustomerAuth";
import AdminAuth from "./pages/AdminAuth";
import AdminDashboard from "./pages/AdminDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import MenuManagement from "./pages/MenuManagement";
import Customers from "./pages/Customers";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";
import MenuPage from "./pages/MenuPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/auth" element={<CustomerAuth />} />
              <Route path="/admin/login" element={<AdminAuth />} />
              <Route path="/staff-login" element={<AdminAuth />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/menu" element={<MenuManagement />} />
              <Route path="/admin/customers" element={<Customers />} />
              <Route path="/admin/analytics" element={<Analytics />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/my-orders" element={<MyOrders />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
