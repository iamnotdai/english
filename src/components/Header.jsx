import { useEffect, useState } from "react";
import { MONTHS, TOTAL, title } from "../lib/course.js";
import { useProgress } from "../lib/store.jsx";
import { goToMonth } from "../lib/router.js";
import { useTheme } from "../lib/theme.js";

function ProgressRing({ value, total }) {
  const r = 15, c = 2 * Math.PI * r, pct = value / total;
  return (
    <span className="ring" title={`${value} of ${total} days completed`}>
      <svg viewBox="0 0 36 36" aria-hidden="true">
        <circle cx="18" cy="18" r={r} className="ring-bg" />
        <circle cx="18" cy="18" r={r} className="ring-fg" strokeDasharray={c} strokeDashoffset={c * (1 - pct)} />
      </svg>
      <span className="ring-txt"><b>{value}</b>/{total}<small>days</small></span>
    </span>
  );
}

const SunIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5" /><path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8 6 18M18 6l1.8-1.8" /></svg>
);
const MoonIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" /></svg>
);

export default function Header({ route }) {
  const { nextDay, doneCount } = useProgress();
  const [theme, toggleTheme] = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const onTimeline = route.view === "timeline";
  const onToday = route.view === "day" && route.day === nextDay;

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 4);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  // Close the mobile menu on navigation and on Escape; lock page scroll while it is open.
  useEffect(() => { setOpen(false); }, [route.view, route.day, route.tab]);
  useEffect(() => {
    if (!open) return;
    const k = e => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", k);
    document.body.classList.add("menu-open");
    return () => { document.removeEventListener("keydown", k); document.body.classList.remove("menu-open"); };
  }, [open]);

  const monthLink = (m, i) => (
    <a key={i} href="#/" onClick={e => { setOpen(false); goToMonth(e, i + 1); }}>
      Month {i + 1}<small>{m.level}</small>
    </a>
  );

  return (
    <header className={"site" + (scrolled ? " scrolled" : "") + (open ? " open" : "")}>
      <div className="wrap hd">
        <a className="brand" href="#/" aria-label="Ninety Days of English, home">
          <span className="mark" aria-hidden="true">90</span>
          <span>Ninety Days<small>of English</small></span>
        </a>

        <nav className="nav" aria-label="Main">
          <a href="#/" aria-current={onTimeline ? "page" : undefined}>Timeline</a>
          <a href={"#/day/" + nextDay} aria-current={onToday ? "page" : undefined}>Today</a>
          <span className="nav-sep" aria-hidden="true"></span>
          {MONTHS.map(monthLink)}
        </nav>

        <div className="hd-right">
          <ProgressRing value={doneCount} total={TOTAL} />
          <button className="icon-btn" onClick={toggleTheme} aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} title={theme === "dark" ? "Light mode" : "Dark mode"}>
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <a className="btn solid hd-cta" href={"#/day/" + nextDay}>{doneCount ? "Continue" : "Start"}: Day {nextDay}</a>
          <button className="icon-btn burger" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(o => !o)}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      <div id="mobile-menu" className="mmenu" hidden={!open}>
        <div className="wrap">
          <a className="mm-cta" href={"#/day/" + nextDay}>
            <span>{doneCount ? "Continue" : "Start"} with Day {nextDay}</span>
            <small>{title(nextDay)}</small>
          </a>
          <nav aria-label="Mobile">
            <a href="#/" aria-current={onTimeline ? "page" : undefined}>Timeline</a>
            {MONTHS.map((m, i) => (
              <a key={i} href="#/" onClick={e => { setOpen(false); goToMonth(e, i + 1); }}>
                Month {i + 1}: {m.name}<small>{m.level}</small>
              </a>
            ))}
          </nav>
          <div className="mm-prog">
            <span>{doneCount} of {TOTAL} days completed</span>
            <div className="bar"><i style={{ width: doneCount / TOTAL * 100 + "%" }}></i></div>
          </div>
        </div>
      </div>
      <div className="mm-scrim" hidden={!open} onClick={() => setOpen(false)}></div>
    </header>
  );
}
