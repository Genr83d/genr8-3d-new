import { Suspense, lazy, type JSX } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ScrollToTop } from "./components/layout/ScrollToTop";
import { SiteLayout } from "./components/layout/SiteLayout";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { GalleryPage } from "./pages/GalleryPage";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ServiceDetailPage } from "./pages/ServiceDetailPage";
import { ServicesPage } from "./pages/ServicesPage";

const ClockPage = lazy(async () => ({ default: (await import("./pages/ClockPage")).ClockPage }));
const AdminClockSubmissionsPage = lazy(async () => ({
  default: (await import("./pages/AdminClockSubmissionsPage")).AdminClockSubmissionsPage,
}));

function LegacyRedirect({ to }: { to: string }): JSX.Element {
  const { search, hash } = useLocation();
  return <Navigate to={`${to}${search}${hash}`} replace />;
}

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<div className="min-h-screen bg-base text-white" />}>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:slug" element={<ServiceDetailPage />} />
            <Route path="/products/clocks" element={<ClockPage />} />
            <Route path="/clocks" element={<LegacyRedirect to="/products/clocks" />} />
            <Route path="/admin/clocks" element={<AdminClockSubmissionsPage />} />
            <Route path="/products" element={<GalleryPage />} />
            <Route path="/gallery" element={<LegacyRedirect to="/products" />} />
            <Route path="/our-work" element={<LegacyRedirect to="/services" />} />
            <Route path="/portfolio" element={<LegacyRedirect to="/services" />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
