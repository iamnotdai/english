import { DLG, L, talkDays } from "../../lib/course.js";
import { say, stopAll } from "../../lib/speech.js";
import { DialogLines, PlayCtl, SayBtn } from "../Shared.jsx";

export default function TalkPane({ day, sess, patch }) {
  const ds = talkDays(day);
  const T = sess.talk;
  const idx = T.idx >= ds.length ? 0 : T.idx;
  const D = { day: ds[idx], ...DLG[ds[idx]] };
  const showVi = sess.showVi;
  const toggleVi = () => patch("showVi", v => !v);

  // Begin a role-play: if the app's character speaks first, say that line.
  const startRole = (mode, dlg = D) => {
    patch("talk", t => ({ ...t, mode, step: 0, rev: [] }));
    if (mode !== "read" && dlg.l[0][0] !== +mode) setTimeout(() => say(dlg.l[0][1], dlg.l[0][0]), 150);
  };
  const pickMode = m => { stopAll(); startRole(m); };
  const pickDialog = v => { stopAll(); patch("talk", { mode: "read", step: 0, rev: [], idx: v }); };

  let body;
  if (T.mode === "read") {
    body = (
      <>
        <PlayCtl lines={D.l} showVi={showVi} toggleVi={toggleVi} />
        <DialogLines D={D} showVi={showVi} />
        <p className="muted small">Listen to each line and repeat it, then switch to a role-play mode.</p>
      </>
    );
  } else {
    const me = +T.mode, end = T.step >= D.l.length - 1;
    const reveal = i => { patch("talk", t => ({ ...t, rev: [...t.rev, i] })); say(D.l[i][1], D.l[i][0]); };
    const next = () => {
      const step = T.step + 1, l = D.l[step];
      patch("talk", t => ({ ...t, step, rev: D.l[t.step][0] === me ? [...t.rev, t.step] : t.rev }));
      if (l[0] !== me) say(l[1], l[0]);
    };
    body = (
      <>
        <p className="muted intro">The app speaks for {D.p[1 - me]}. On your turn, read the Vietnamese cue, say the line in English out loud, then tap “Show answer” to compare.</p>
        <div className="dlg">
          {D.l.slice(0, T.step + 1).map((l, i) => {
            const mine = l[0] === me, open = !mine || T.rev.includes(i);
            return (
              <div key={i} className={`line s${l[0]}${mine ? " me" : ""}`}>
                <span className="who">{mine ? "You" : D.p[l[0]]}</span>
                <div className="bub">
                  {mine && !open
                    ? <><p className="your">Your turn. Say this in English:</p><p lang="vi">{l[2]}</p></>
                    : <><p className="ex">{l[1]}</p>{(mine || showVi) && <p className="vi" lang="vi">{l[2]}</p>}</>}
                </div>
                {mine && !open
                  ? <button className="btn small" onClick={() => reveal(i)}>Show answer</button>
                  : <SayBtn t={l[1]} w={l[0]} />}
              </div>
            );
          })}
        </div>
        <div className="crow left" style={{ marginTop: 16 }}>
          {end
            ? <button className="btn small solid" onClick={() => startRole(T.mode)}>Start again</button>
            : <button className="btn small solid" onClick={next}>Next line</button>}
          <button className="btn small" onClick={toggleVi}>{showVi ? "Hide Vietnamese" : "Show Vietnamese"}</button>
        </div>
        {end && <p className="muted small">Done! Swap roles, or repeat until you can say every line without checking.</p>}
      </>
    );
  }

  return (
    <>
      {ds.length > 1 && (
        <>
          <label className="lbl" htmlFor="dsel">Choose a dialogue</label>
          <select id="dsel" className="select" value={idx} onChange={e => pickDialog(+e.target.value)}>
            {ds.map((d, i) => <option key={d} value={i}>Day {d}: {L[d].t}</option>)}
          </select>
        </>
      )}
      <p className="ctx"><b>Scene:</b> {D.c}</p>
      <div className="seg" role="group" aria-label="Practice mode">
        <button aria-pressed={T.mode === "read"} onClick={() => pickMode("read")}>Read and listen</button>
        <button aria-pressed={T.mode === "0"} onClick={() => pickMode("0")}>Play {D.p[0]}</button>
        <button aria-pressed={T.mode === "1"} onClick={() => pickMode("1")}>Play {D.p[1]}</button>
      </div>
      {body}
    </>
  );
}
