import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateRoomId } from '../lib/roomId.ts';
import {
  validateCallsign,
  resolveCallsign,
  CALLSIGN_MAX_LENGTH,
} from '../lib/callsign.ts';
import { roomConnection } from '../lib/roomConnection.ts';
import { StarField } from '../components/StarField.tsx';

export function LandingScreen() {
  const navigate = useNavigate();
  const [callsign, setCallsign] = useState('');
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const overLength = useMemo(
    () => callsign.trim().length > CALLSIGN_MAX_LENGTH,
    [callsign],
  );

  async function handleInitiate() {
    setConnectionError(null);

    const validation = validateCallsign(callsign);
    if (!validation.valid) {
      setInlineError(
        `Callsign must be ${CALLSIGN_MAX_LENGTH} characters or fewer.`,
      );
      return;
    }
    setInlineError(null);

    const displayName = resolveCallsign(callsign);
    const roomId = generateRoomId();

    setCreating(true);
    try {
      await roomConnection.connect(roomId, displayName);
      navigate(`/room/${roomId}`);
    } catch {
      setConnectionError(
        'The Death Star is not responding. Unable to establish a session — try again.',
      );
    } finally {
      setCreating(false);
    }
  }

  return (
    <main className="landing">
      <StarField />
      <div className="landing__panel">
        <header className="landing__title">
          <span className="landing__title-sub">DEATH STAR</span>
          <span className="landing__title-main">PLANNING POKER</span>
        </header>

        <div className="field">
          <input
            className={`text-input${inlineError ? ' text-input--error' : ''}`}
            type="text"
            placeholder="Enter your callsign..."
            aria-label="Callsign"
            aria-invalid={overLength}
            value={callsign}
            onChange={(event) => {
              setCallsign(event.target.value);
              if (inlineError) setInlineError(null);
            }}
            disabled={creating}
          />
          {inlineError && (
            <p className="field__error" role="alert">
              {inlineError}
            </p>
          )}
        </div>

        <button
          className="btn btn--primary"
          type="button"
          onClick={handleInitiate}
          disabled={creating}
        >
          {creating ? 'INITIATING…' : 'INITIATE NEW SESSION ▶'}
        </button>

        {connectionError && (
          <p className="landing__connection-error" role="alert">
            ⚠ {connectionError}
          </p>
        )}
      </div>
    </main>
  );
}
