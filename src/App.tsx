import { Suspense, lazy, type JSX } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ScrollToTop } from "./components/layout/ScrollToTop";
import { SiteLayout } from "./components/layout/SiteLayout";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PortfolioPage } from "./pages/PortfolioPage";
import { ServiceDetailPage } from "./pages/ServiceDetailPage";
import { ServicesPage } from "./pages/ServicesPage";

const ClockPage = lazy(async () => ({ default: (await import("./pages/ClockPage")).ClockPage }));
const AdminClockSubmissionsPage = lazy(async () => ({
  default: (await import("./pages/AdminClockSubmissionsPage")).AdminClockSubmissionsPage,
}));

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
            <Route path="/clocks" element={<ClockPage />} />
            <Route path="/admin/clocks" element={<AdminClockSubmissionsPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
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
