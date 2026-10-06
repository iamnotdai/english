import { DLG, L, oldDeck, lastDlgDay } from "../../lib/course.js";
import { useProgress } from "../../lib/store.jsx";
import { CardBlock, DialogLines, PlayCtl } from "../Shared.jsx";

export default function OldPane({ day, sess, patch }) {
  const { st } = useProgress();
  const dk = oldDeck(day, st.hard), ld = lastDlgDay(day);
  const toggleVi = () => patch("showVi", v => !v);
  return (
    <>
      <h3 className="subh">Earlier words</h3>
      {!dk.length
        ? <p className="muted">This is day one, so there are no earlier words yet. Start with the Vocabulary section.</p>
        : <>
            <p className="muted intro">{dk.length} words to review: words from 1, 2, 4, 7, 14, 30 and 60 days ago, plus any words you've flagged. Look at the picture, say the word, then flip the card.</p>
            <CardBlock dk={dk} c="o" mode="pic" sess={sess} patch={patch} />
          </>}
      {ld > 0 && (
        <div className="oldtalk">
          <h3 className="subh">Previous dialogue: Day {ld}, {L[ld].t}</h3>
          <p className="ctx"><b>Scene:</b> {DLG[ld].c}</p>
          <PlayCtl lines={DLG[ld].l} showVi={sess.showVi} toggleVi={toggleVi} />
          <DialogLines D={DLG[ld]} showVi={sess.showVi} />
          <p className="muted small">Listen to each line and repeat it straight away, copying the rhythm and intonation (shadowing).</p>
        </div>
      )}
    </>
  );
}
