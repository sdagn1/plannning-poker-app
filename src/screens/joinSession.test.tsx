import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { LandingScreen } from '../screens/LandingScreen.tsx';
import { RoomScreen } from '../screens/RoomScreen.tsx';
import { roomConnection } from '../lib/roomConnection.ts';
import { MockWebSocket } from '../test/mockWebSocket.ts';

const ROOM_ID = 'xk29-4plm';

function renderApp(entry: string) {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route path="/" element={<LandingScreen />} />
        <Route path="/join/:roomId" element={<LandingScreen />} />
        <Route path="/room/:roomId" element={<RoomScreen />} />
      </Routes>
    </MemoryRouter>,
  );
}

/** Drive the messages for a room that already has a host, plus the joiner. */
function admitJoiner(socket: MockWebSocket) {
  act(() => {
    socket.emit({ type: 'welcome', userId: 'user-joiner' });
    socket.emit({
      type: 'state',
      hostId: 'user-host',
      revealed: false,
      users: [
        { id: 'user-host', name: 'Darth Vader', hasVoted: false },
        { id: 'user-joiner', name: 'Boba Fett', hasVoted: false },
      ],
      votes: null,
    });
  });
}

describe('join session room flow', () => {
  beforeEach(() => {
    MockWebSocket.reset();
    // Joining an existing room: drive the roster manually so the joiner is
    // not treated as the host.
    MockWebSocket.autoWelcome = false;
    vi.stubGlobal('WebSocket', MockWebSocket);
  });

  afterEach(() => {
    roomConnection.reset();
    vi.unstubAllGlobals();
  });

  it('pre-populates the room from the link and joins as a non-host with the full roster (AC01, AC06)', async () => {
    const user = userEvent.setup();
    renderApp(`/join/${ROOM_ID}`);

    // AC01: the shared room id is surfaced and a callsign is prompted for.
    expect(screen.getByText(ROOM_ID)).toBeInTheDocument();
    await user.type(screen.getByLabelText(/callsign/i), 'Boba Fett');
    await user.click(screen.getByRole('button', { name: /join briefing/i }));

    const socket = await waitFor(() => {
      const s = MockWebSocket.instances[0];
      expect(s).toBeDefined();
      return s;
    });
    admitJoiner(socket);

    // AC06: joiner sees the full roster and appears as a regular (non-host)
    // participant.
    expect(await screen.findByText('Boba Fett')).toBeInTheDocument();
    expect(screen.getByText('Darth Vader')).toBeInTheDocument();
    expect(screen.getByText(/\(you\)/i)).toBeInTheDocument();
    // Exactly one HOST badge, and it belongs to the existing host, not us.
    const hostRow = screen.getByText('Darth Vader').closest('li')!;
    expect(hostRow).toHaveTextContent('HOST');
    const selfRow = screen.getByText('Boba Fett').closest('li')!;
    expect(selfRow).not.toHaveTextContent('HOST');
  });

  it('assigns a random Star Wars callsign when the field is empty (AC02)', async () => {
    const user = userEvent.setup();
    renderApp(`/join/${ROOM_ID}`);

    await user.click(screen.getByRole('button', { name: /join briefing/i }));

    const socket = await waitFor(() => {
      const s = MockWebSocket.instances[0];
      expect(s).toBeDefined();
      return s;
    });
    const name = new URL(socket.url).searchParams.get('name');
    expect(name).toBeTruthy();
    expect(new URL(socket.url).searchParams.get('room')).toBe(ROOM_ID);
  });

  it('rejects an over-length callsign without joining (AC03)', async () => {
    const user = userEvent.setup();
    renderApp(`/join/${ROOM_ID}`);

    await user.type(screen.getByLabelText(/callsign/i), 'a'.repeat(33));
    await user.click(screen.getByRole('button', { name: /join briefing/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /32 characters or fewer/i,
    );
    // No socket opened — the join did not proceed.
    expect(MockWebSocket.instances).toHaveLength(0);
  });

  it('shows a themed error for an invalid room link and offers no join (AC04)', () => {
    renderApp('/join/NOT-a-valid-room');

    expect(screen.getByRole('alert')).toHaveTextContent(
      /corrupted or unrecognised/i,
    );
    // The join affordance is not offered; the user stays on the landing screen.
    expect(
      screen.queryByRole('button', { name: /join briefing/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /initiate new session/i }),
    ).toBeInTheDocument();
  });

  it('shows a distinct room-full error and keeps the joiner on the landing screen (AC05)', async () => {
    MockWebSocket.behaviour = 'fail';
    const user = userEvent.setup();
    renderApp(`/join/${ROOM_ID}`);

    await user.click(screen.getByRole('button', { name: /join briefing/i }));

    expect(await screen.findByText(/full capacity/i)).toBeInTheDocument();
    // Still on the landing/join screen — the room never rendered.
    expect(
      screen.queryByRole('region', { name: /personnel/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /join briefing/i }),
    ).toBeInTheDocument();
  });

  it('updates the roster in real time as people join and leave (AC07)', async () => {
    const user = userEvent.setup();
    renderApp(`/join/${ROOM_ID}`);

    await user.click(screen.getByRole('button', { name: /join briefing/i }));
    const socket = await waitFor(() => {
      const s = MockWebSocket.instances[0];
      expect(s).toBeDefined();
      return s;
    });
    admitJoiner(socket);
    expect(await screen.findByText('Boba Fett')).toBeInTheDocument();

    // A new participant joins — the roster grows.
    act(() => {
      socket.emit({
        type: 'state',
        hostId: 'user-host',
        revealed: false,
        users: [
          { id: 'user-host', name: 'Darth Vader', hasVoted: false },
          { id: 'user-joiner', name: 'Boba Fett', hasVoted: false },
          { id: 'user-3', name: 'Kylo Ren', hasVoted: false },
        ],
        votes: null,
      });
    });
    expect(await screen.findByText('Kylo Ren')).toBeInTheDocument();

    // That participant leaves — the roster shrinks (full snapshot replace).
    act(() => {
      socket.emit({
        type: 'state',
        hostId: 'user-host',
        revealed: false,
        users: [
          { id: 'user-host', name: 'Darth Vader', hasVoted: false },
          { id: 'user-joiner', name: 'Boba Fett', hasVoted: false },
        ],
        votes: null,
      });
    });
    await waitFor(() =>
      expect(screen.queryByText('Kylo Ren')).not.toBeInTheDocument(),
    );
  });
});
