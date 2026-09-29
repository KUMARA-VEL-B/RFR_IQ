import { useState, useEffect } from "react";
import { AppShell, type PageKey } from "./components/Layout";
import Home from "./pages/Home";
import Overview from "./pages/Overview";
import Forecast from "./pages/Forecast";
import Vessel from "./pages/Vessel";
import Ports from "./pages/Ports";
import Simulator from "./pages/Simulator";
import Risk from "./pages/Risk";
import Decision from "./pages/Decision";
import { ShipmentProvider } from "./state/shipment";
import { CurrencyProvider } from "./state/currency";

type AppView = "home" | "prototype";

const PROTOTYPE_PAGES: PageKey[] = ["overview", "forecast", "vessel", "ports", "simulator", "risk", "decision"];

export default function App() {
  const [view, setView] = useState<AppView>(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace(/^#\/?/, "");
      if (hash === "prototype" || hash === "dashboard" || PROTOTYPE_PAGES.includes(hash as PageKey)) {
        return "prototype";
      }
    }
    return "home";
  });

  const [page, setPage] = useState<PageKey>(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace(/^#\/?/, "");
      if (PROTOTYPE_PAGES.includes(hash as PageKey)) {
        return hash as PageKey;
      }
    }
    return "overview";
  });

  // Synchronize hash with back/forward history
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, "");
      if (hash === "" || hash === "home") {
        setView("home");
      } else if (hash === "prototype" || hash === "dashboard") {
        setView("prototype");
      } else if (PROTOTYPE_PAGES.includes(hash as PageKey)) {
        setView("prototype");
        setPage(hash as PageKey);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const enterPrototype = (targetPage: PageKey = "overview") => {
    setView("prototype");
    setPage(targetPage);
    window.location.hash = targetPage === "overview" ? "prototype" : targetPage;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const returnHome = () => {
    setView("home");
    window.location.hash = "home";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigatePage = (newPage: PageKey) => {
    setPage(newPage);
    window.location.hash = newPage;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <CurrencyProvider>
      {view === "home" ? (
        <Home onEnterPrototype={() => enterPrototype("overview")} />
      ) : (
        <ShipmentProvider>
          <AppShell
            page={page}
            go={navigatePage}
            onGoHome={returnHome}
          >
            <div key={page} className="anim-fade-up">
              {page === "overview" && <Overview go={navigatePage} />}
              {page === "forecast" && <Forecast go={navigatePage} />}
              {page === "vessel" && <Vessel go={navigatePage} />}
              {page === "ports" && <Ports go={navigatePage} />}
              {page === "simulator" && <Simulator go={navigatePage} />}
              {page === "risk" && <Risk go={navigatePage} />}
              {page === "decision" && <Decision go={navigatePage} />}
            </div>
          </AppShell>
        </ShipmentProvider>
      )}
    </CurrencyProvider>
  );
}
