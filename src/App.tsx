import { useState, useEffect } from "react";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { TeamPage } from "./pages/TeamPage";
import { ResearchPage } from "./pages/ResearchPage";
import { BlogPage } from "./pages/BlogPage";
import { PartnersPage } from "./pages/PartnersPage";
import { AdminPage } from "./pages/AdminPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");

  // Handle browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "") || "home";
      setCurrentPage(hash);
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Set initial page from URL

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = () => {
    switch (currentPage) {
      case "about":
        return <AboutPage onNavigate={handleNavigate} />;
      case "team":
        return <TeamPage />;
      case "research":
        return <ResearchPage />;
      case "blog":
        return <BlogPage />;
      case "partners":
        return <PartnersPage />;
      case "admin":
        return <AdminPage />;
      case "home":
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}