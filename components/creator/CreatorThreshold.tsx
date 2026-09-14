export function CreatorThreshold() {
  return (
    <section
      className="creator-threshold"
      data-creator-threshold="unrevealed"
      data-creator-stage="threshold"
      aria-labelledby="creator-threshold-title"
    >
      <div className="creator-shell creator-threshold__inner">
        <div className="creator-threshold__counter" aria-label="Transition from world three to world four">
          <span>03 / 06</span>
          <span aria-hidden="true">→</span>
          <span>04 / 06</span>
        </div>
        <div>
          <p className="creator-kicker">THRESHOLD</p>
          <h2 id="creator-threshold-title">THE UNREVEALED</h2>
          <p>Still being made inside BMP.</p>
        </div>
      </div>
      <div className="creator-threshold__line" aria-hidden="true" />
    </section>
  );
}
