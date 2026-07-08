import type { RoomUser } from '../lib/types.ts';

interface ParticipantListProps {
  users: RoomUser[];
  hostId: string | null;
  selfId: string | null;
}

/** Personnel roster showing each participant, host badge, and voted status. */
export function ParticipantList({ users, hostId, selfId }: ParticipantListProps) {
  return (
    <section className="panel participants" aria-label="Personnel">
      <h2 className="panel__heading">PERSONNEL</h2>
      <ul className="participants__list">
        {users.map((user) => (
          <li key={user.id} className="participants__item">
            <span className="participants__dot" aria-hidden="true">
              ●
            </span>
            <span className="participants__name">
              {user.name}
              {user.id === selfId && (
                <span className="participants__you"> (you)</span>
              )}
            </span>
            {user.id === hostId && (
              <span className="badge badge--host">HOST</span>
            )}
            <span
              className={`participants__status${
                user.hasVoted ? ' participants__status--voted' : ''
              }`}
            >
              {user.hasVoted ? '✔ voted' : '○ thinking…'}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
