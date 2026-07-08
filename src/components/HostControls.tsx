/**
 * Host-only controls. Reveal/reset behaviour is delivered by a separate story,
 * so the buttons are presentational here — the host can see the controls.
 */
export function HostControls() {
  return (
    <section className="host-controls" aria-label="Host controls">
      <span className="host-controls__label">HOST ONLY</span>
      <button className="btn btn--danger" type="button" disabled>
        REVEAL VOTES
      </button>
      <button className="btn btn--danger-outline" type="button" disabled>
        RESET
      </button>
    </section>
  );
}
