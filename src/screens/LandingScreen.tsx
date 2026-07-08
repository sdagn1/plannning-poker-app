import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { generateRoomId, parseJoinRoomId } from '../lib/roomId.ts';
import {
  validateCallsign,
  resolveCallsign,
  CALLSIGN_MAX_LENGTH,
} from '../lib/callsign.ts';
import { roomConnection } from '../lib/roomConnection.ts';
import { StarField } from '../components/StarField.tsx';

export function LandingScreen() {
  const navigate = useNavigate();
  // A room id is present in the route when the user arrived via a shared link.
  const { roomId: linkRoomId } = useParams<{ roomId: string }>();
  const [callsign, setCallsign] = useState('');
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const overLength = useMemo(
    () => callsign.trim().length > CALLSIGN_MAX_LENGTH,
    [callsign],
  );

  // Resolve and validate the room id from a shared link, if present.
  const joinRoomId = useMemo(
    () => (linkRoomId === undefined ? null : parseJoinRoomId(linkRoomId)),
    [linkRoomId],
  );
  const linkIsInvalid = linkRoomId !== undefined && joinRoomId === null;

  /** Validate the callsign field, returning the resolved name or null. */
  function checkCallsign(): string | null {
    const validation = validateCallsign(callsign);
    if (!validation.valid) {
      setInlineError(
        `Callsign must be ${CALLSIGN_MAX_LENGTH} characters or fewer.`,
      );
      return null;
    }
    setInlineError(null);
    return resolveCallsign(callsign);
  }

  async function handleInitiate() {
    setConnectionError(null);
    const displayName = checkCallsign();
    if (displayName === null) return;

    const roomId = generateRoomId();
    setBusy(true);
    try {
      await roomConnection.connect(roomId, displayName);
      navigate(`/room/${roomId}`);
    } catch {
      setConnectionError(
        'The Death Star is not responding. Unable to establish a session — try again.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleJoin() {
    if (joinRoomId === null) return;
    setConnectionError(null);
    const displayName = checkCallsign();
    if (displayName === null) return;

    setBusy(true);
    try {
      await roomConnection.connect(joinRoomId, displayName);
      navigate(`/room/${joinRoomId}`);
    } catch {
      // The room id and callsign already passed validation, so a rejected
      // upgrade means the briefing room has reached capacity.
      setConnectionError(
        'This briefing room is at full capacity. No further personnel can board.',
      );
    } finally {
      setBusy(false);
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

        {linkIsInvalid && (
          <p className="landing__connection-error" role="alert">
            ⚠ That briefing link is corrupted or unrecognised. Initiate a new
            session instead.
          </p>
        )}

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
            disabled={busy}
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
          disabled={busy}
        >
          {busy ? 'INITIATING…' : 'INITIATE NEW SESSION ▶'}
        </button>

        {joinRoomId !== null && (
          <>
            <p className="landing__divider">— or join existing —</p>
            <p className="landing__join-room">
              Briefing room: <code>{joinRoomId}</code>
            </p>
            <button
              className="btn btn--primary"
              type="button"
              onClick={handleJoin}
              disabled={busy}
            >
              {busy ? 'BOARDING…' : 'JOIN BRIEFING ▶'}
            </button>
          </>
        )}

        {connectionError && (
          <p className="landing__connection-error" role="alert">
            ⚠ {connectionError}
          </p>
        )}
      </div>
    </main>
  );
}
