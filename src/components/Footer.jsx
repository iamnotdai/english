import { MONTHS, TOTAL, fmtMin, studiedMin } from "../lib/course.js";
import { useProgress } from "../lib/store.jsx";
import { goToMonth, reducedMotion } from "../lib/router.js";

export default function Footer() {
  const { st, nextDay, doneCount } = useProgress();
  const toTop = () => window.scrollTo({ top: 0, behavior: reducedMotion() ? "auto" : "smooth" });

  return (
    <footer className="site">
      <div className="wrap ft-grid">
        <div className="ft-about">
          <a className="brand" href="#/" aria-label="Ninety Days of English, home">
            <span className="mark" aria-hidden="true">90</span>
            <span>Ninety Days<small>of English</small></span>
          </a>
          <p>A structured 3-month plan that takes you from A2 to B1+ with 2.5 hours of practice a day: vocabulary, dialogues, grammar, listening and writing.</p>
          <div className="levels" aria-label="Course levels">
            {MONTHS.map((m, i) => <span key={i}>{m.level}</span>)}
          </div>
        </div>

        <div className="ft-col">
          <h3>Course</h3>
          <ul>
            {MONTHS.map((m, i) => (
              <li key={i}><a href="#/" onClick={e => goToMonth(e, i + 1)}>Month {i + 1}: {m.name}</a></li>
            ))}
            <li><a href={"#/day/" + TOTAL}>Final test</a></li>
          </ul>
        </div>

        <div className="ft-col">
          <h3>Study</h3>
          <ul>
            <li><a href={"#/day/" + nextDay}>Today's lesson (Day {nextDay})</a></li>
            <li><a href={`#/day/${nextDay}/vocab`}>Vocabulary cards</a></li>
            <li><a href={`#/day/${nextDay}/talk`}>Dialogue practice</a></li>
            <li><a href={`#/day/${nextDay}/quiz`}>Quiz</a></li>
            <li><a href="#/">Full timeline</a></li>
          </ul>
        </div>

        <div className="ft-col ft-stats">
          <h3>Your progress</h3>
          <dl>
            <div><dt>Days completed</dt><dd>{doneCount} / {TOTAL}</dd></div>
            <div><dt>Time studied</dt><dd>{fmtMin(studiedMin(st.act))}</dd></div>
            <div><dt>Words to review</dt><dd>{st.hard.length}</dd></div>
          </dl>
          <div className="bar"><i style={{ width: doneCount / TOTAL * 100 + "%" }}></i></div>
        </div>
      </div>

      <div className="ft-bottom">
        <div className="wrap">
          <span>© {new Date().getFullYear()} Ninety Days of English. Progress is saved in this browser.</span>
          <button className="ft-top" onClick={toTop}>Back to top ↑</button>
        </div>
      </div>
    </footer>
  );
}
