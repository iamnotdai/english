import { L, scope } from "../../lib/course.js";
import { SayBtn } from "../Shared.jsx";

export default function GrammarPane({ day }) {
  return scope(day).map(d => {
    const g = L[d].g;
    return (
      <div className="gblock" key={d}>
        {!L[day] && <p className="eyebrow">Day {d}</p>}
        <h3>{g.n}</h3>
        <p className="rule">{g.r}</p>
        <ul className="exs">
          {g.ex.map(e => <li key={e}><SayBtn t={e} /><span className="ex">{e}</span></li>)}
        </ul>
      </div>
    );
  });
}
