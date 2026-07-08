import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useRoomConnection } from '../lib/useRoomConnection.ts';
import { ParticipantList } from '../components/ParticipantList.tsx';
import { CardDeck } from '../components/CardDeck.tsx';
import { HostControls } from '../components/HostControls.tsx';
import { CopyLinkButton } from '../components/CopyLinkButton.tsx';
import { DeathStarIcon } from '../components/DeathStarIcon.tsx';

export function RoomScreen() {
  const { roomId } = useParams<{ roomId: string }>();
  const connection = useRoomConnection();

  // Set the shareable URL as the document title for quick reference.
  useEffect(() => {
    if (roomId) document.title = `Room ${roomId} — Death Star Planning Poker`;
    return () => {
      document.title = 'Death Star Planning Poker';
    };
  }, [roomId]);

  // Joining an existing room is a separate story; if there is no active
  // connection for this room, send the user back to the landing screen.
  if (!roomId || connection.roomId !== roomId) {
    return <Navigate to="/" replace />;
  }

  const { state, userId } = connection;
  const isHost = state !== null && userId !== null && state.hostId === userId;
  const shareUrl =
    typeof window !== 'undefined' ? window.location.href : `/room/${roomId}`;

  return (
    <main className="room">
      <header className="room__bar">
        <span className="room__brand">
          <DeathStarIcon size={22} className="room__brand-icon" />
          DEATH STAR POKER
        </span>
        <span className="room__id">
          Room: <code>{roomId}</code>
        </span>
        <CopyLinkButton url={shareUrl} />
      </header>

      <div className="room__body">
        {state ? (
          <ParticipantList
            users={state.users}
            hostId={state.hostId}
            selfId={userId}
          />
        ) : (
          <section className="panel participants" aria-label="Personnel">
            <h2 className="panel__heading">PERSONNEL</h2>
            <p className="participants__waiting">Establishing uplink…</p>
          </section>
        )}

        <CardDeck />

        {isHost && <HostControls />}
      </div>
    </main>
  );
}
