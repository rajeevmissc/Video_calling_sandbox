import { useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { SocketProvider } from "./context/Socketcontext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Main";
import LoadingScreen from "./components/Loading";
import { PresenceProvider } from "./context/UserStatusContext";
import { ToastProvider, WalletProvider } from './Screen/Wallet/contexts';

// Lazy pages
const MobileOTPLogin = lazy(() => import("./Screen/Auth/MobileAuth"));
const Dashboard = lazy(() => import("./components/Dashboards"));
const ServicePlatform = lazy(() => import("./Screen/ServicesScreen/ServicePlatform"));
const ProviderDetailsPage = lazy(() => import("./Screen/ServicesScreen/ProviderDetailsPage"));
const HomePage = lazy(() => import("./Screen/HomeScrren/HomePage")); // ← moved to /home
const Wallet = lazy(() => import("./Screen/Wallet/Wallet"));
const ShareComponent = lazy(() => import("./Screen/Share/ShareComponent"));
const Admin = lazy(() => import("./Screen/admin/UnifiedAdminDashboard"));
const Call = lazy(() => import("./components/Call/Call"));
const AppointmentsList = lazy(() => import("./Screen/Appointments/AppointmentsList"));
const ProviderOnboardingForm = lazy(() => import("./Screen/admin/ProviderOnboard/ProviderOnboard"));
const FeedbackForm = lazy(() => import("./Screen/admin/ProviderOnboard/FeedbackForm"));
const ServiceProviderMainPage = lazy(() => import("./Screen/ServiceProvider/MainPage"));
const LandingPage = lazy(() => import("./Screen/LandingPage/LandingPage")); // NEW DEFAULT
const ContactusPage = lazy(() => import("./components/ContactuspageElements/Contactuspage"));
const DataProtectionPage = lazy(() => import("./components/DataprotectionpageElements/Dataprotectionpage"));
const PrivacyPolicy = lazy(() => import("./components/PrivacypolicypageElements/Privacypolicypage"));
const GetServices = lazy(() => import("./Screen/ServicesScreen/Servicesexplorer"));
const TermsPage = lazy(() => import("./components/PrivacypolicypageElements/TermsAndConditionPage"));
const NotFound = lazy(() => import("./components/NotFound"));
const FAQSection = lazy(() => import("./components/ContactuspageElements/FAQsection"))
function App() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(() => console.log("Service Worker registered"))
        .catch((err) => console.error("Service Worker Error:", err));
    }
  }, []);

  return (
    <AuthProvider>
      <SocketProvider>
        <PresenceProvider>
            <ToastProvider>
              <WalletProvider>
              <Router>
                <Suspense fallback={<div className="loading-screen"><LoadingScreen /></div>}>
                  <Routes>

                    {/* Public Route */}
                    <Route path="/auth/login" element={<MobileOTPLogin />} />

                    {/* Layout Wrapper */}
                    <Route path="/" element={<Layout />}>

                      {/* DEFAULT PAGE = LandingPage */}
                      <Route index element={<LandingPage />} />

                      {/* HomePage moved to /home */}
                      <Route path="home" element={<HomePage />} />

                      {/* Auth Protected Routes */}
                      <Route
                        path="dashboard"
                        element={
                          <ProtectedRoute>
                            <NotFound />
                          </ProtectedRoute>
                        }
                      />

                      <Route path="wallet" element={<Wallet />} />
                      <Route path="feedback" element={<FeedbackForm />} />
                      <Route path="appointment" element={<AppointmentsList />} />
                      <Route path="provider-onboard-from" element={<ProviderOnboardingForm />} />
                      <Route path="admin" element={<Admin />} />
                      <Route path="services" element={<ServicePlatform />} />
                      <Route path="share" element={<ShareComponent />} />

                      <Route path="call/:channelName/:callType" element={<Call />} />
                      <Route path="provider/:providerId" element={<ProviderDetailsPage />} />
                      <Route path="service-provider-profile" element={<ServiceProviderMainPage />} />
                      <Route path="get-services" element={<GetServices />} />
                      {/* Keep landing just in case */}
                      <Route path="contact-us" element={<ContactusPage />} />
                      <Route path="data-protection" element={<DataProtectionPage />} />
                      <Route path="terms-and-conditions" element={<TermsPage />} />
                      <Route path="/faq" element={<FAQSection />} />
                      <Route path="privacy-policy" element={<PrivacyPolicy />} />
                      <Route path="landing" element={<LandingPage />} />
                      <Route path="*" element={<NotFound />} />
                    </Route>
                  </Routes>
                </Suspense>
              </Router>
          </WalletProvider>
        </ToastProvider>
        </PresenceProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
