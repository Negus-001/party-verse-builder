import { Route, Routes } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { ThemeProvider } from "./context/ThemeContext";
import { AnimatePresence } from "framer-motion";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Chatbot from "./components/chatbot/Chatbot";
import { LoadingSpinner } from "./components/ui/loading-spinner";

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Events = lazy(() => import("./pages/Events"));
const EventDetails = lazy(() => import("./pages/EventDetails"));
const CreateEvent = lazy(() => import("./pages/CreateEvent"));
const EditEvent = lazy(() => import("./pages/EditEvent"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const Settings = lazy(() => import("./pages/Settings"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Contact = lazy(() => import("./pages/Contact"));
const Help = lazy(() => import("./pages/Help"));
const Blog = lazy(() => import("./pages/Blog"));
const AIAssistant = lazy(() => import("./pages/AIAssistant"));
const Vendors = lazy(() => import("./pages/Vendors"));
const VendorDetails = lazy(() => import("./pages/VendorDetails"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Inspiration = lazy(() => import("./pages/Inspiration"));

// Loading component
const LoadingFallback = () => (
  <div className="fixed inset-0 grid place-items-center bg-background/80 backdrop-blur-sm">
    <LoadingSpinner size="lg" text="Loading Celebration Central..." />
  </div>
);

function App() {
  const { currentUser } = useAuth();
  
  // Page transition configuration
  const pageTransition = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };
  
  // This will run on mount to set the page title
  useEffect(() => {
    document.title = "Celebration Central - Plan Perfect Celebrations";
  }, []);

  return (
    <ThemeProvider defaultTheme="system" storageKey="celebration-central-theme">
      <AnimatePresence mode="wait" initial={false}>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/events" element={<Events />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/create-event" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
            <Route path="/edit-event/:id" element={<ProtectedRoute><EditEvent /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/help" element={<Help />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/vendor/:id" element={<VendorDetails />} />
            <Route path="/inspiration" element={<Inspiration />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AnimatePresence>

      {/* Chatbot component visible on all pages */}
      <Chatbot />

      {/* Toast notifications */}
      <Toaster />
      <Sonner />
    </ThemeProvider>
  );
}

export default App;
