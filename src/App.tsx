import { lazy, type JSX } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ScrollToTop } from "./components/layout/ScrollToTop";
import { SiteLayout } from "./components/layout/SiteLayout";
const AboutPage = lazy(async () => ({ default: (await import("./pages/AboutPage")).AboutPage }));
const ContactPage = lazy(async () => ({ default: (await import("./pages/ContactPage")).ContactPage }));
const GalleryPage = lazy(async () => ({ default: (await import("./pages/GalleryPage")).GalleryPage }));
const HomePage = lazy(async () => ({ default: (await import("./pages/HomePage")).HomePage }));
const NotFoundPage = lazy(async () => ({ default: (await import("./pages/NotFoundPage")).NotFoundPage }));
const ServiceDetailPage = lazy(async () => ({ default: (await import("./pages/ServiceDetailPage")).ServiceDetailPage }));
const ServicesPage = lazy(async () => ({ default: (await import("./pages/ServicesPage")).ServicesPage }));

const FactoryTourPage = lazy(async () => ({ default: (await import("./pages/FactoryTourPage")).FactoryTourPage }));

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
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="/products/clocks" element={<ClockPage />} />
          <Route path="/clocks" element={<LegacyRedirect to="/products/clocks" />} />
          <Route path="/admin/clocks" element={<AdminClockSubmissionsPage />} />
          <Route path="/factory-tour" element={<FactoryTourPage />} />
          <Route path="/products" element={<GalleryPage />} />
          <Route path="/gallery" element={<LegacyRedirect to="/products" />} />
          <Route path="/our-work" element={<LegacyRedirect to="/services" />} />
          <Route path="/portfolio" element={<LegacyRedirect to="/services" />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
