import { useEffect, useLayoutEffect, useRef } from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Timeline from "./components/Timeline.jsx";
import DayPage from "./components/DayPage.jsx";
import { useRoute, pending, scrollToMonth, reducedMotion } from "./lib/router.js";
import { title } from "./lib/course.js";
import { stopAll } from "./lib/speech.js";

export default function App() {
  const route = useRoute();
  const prev = useRef(null);

  useEffect(() => {
    document.title = route.view === "day"
      ? "Day " + route.day + ": " + title(route.day) + " | Ninety Days of English"
      : "Timeline | Ninety Days of English";
    if (route.view === "timeline") stopAll();
  }, [route.view, route.day]);

  // Scroll handling on navigation, mirroring the original single-page behaviour.
  useLayoutEffect(() => {
    const p = prev.current;
    prev.current = route;
    if (route.view === "day" && p && p.view === "day" && p.day === route.day && p.tab !== route.tab) {
      const panel = document.getElementById("panel");
      if (panel && (panel.getBoundingClientRect().top < 0 || window.innerWidth < 820))
        panel.scrollIntoView({ block: "start", behavior: reducedMotion() ? "auto" : "smooth" });
    } else if (route.view === "timeline" && pending.month) {
      const m = pending.month;
      pending.month = 0;
      scrollToMonth(m, false);
    } else {
      window.scrollTo(0, 0);
    }
  }, [route.view, route.day, route.tab]);

  return (
    <>
      <Header route={route} />
      <main id="app" className="wrap">
        {route.view === "day"
          ? <DayPage key={route.day} day={route.day} tab={route.tab} />
          : <Timeline />}
      </main>
      <Footer />
    </>
  );
}
