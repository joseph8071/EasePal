import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Landing } from "./pages/Landing";
import { Safety } from "./pages/Safety";
import { Onboarding } from "./pages/Onboarding";
import { RoutinePreview } from "./pages/RoutinePreview";
import { RoutinePlayer } from "./pages/RoutinePlayer";
import { Progress } from "./pages/Progress";
import { Journal } from "./pages/Journal";
import { CaseStudy } from "./pages/CaseStudy";
import { Feedback } from "./pages/Feedback";
import { Library } from "./pages/Library";
import { NotFound } from "./pages/NotFound";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Layout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/safety" element={<Safety />} />
        <Route path="/start" element={<Onboarding />} />
        <Route path="/moves" element={<Library />} />
        <Route path="/routine" element={<RoutinePreview />} />
        <Route path="/routine/play" element={<RoutinePlayer />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/case-study" element={<CaseStudy />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
