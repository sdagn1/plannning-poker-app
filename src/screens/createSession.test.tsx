import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { LandingScreen } from '../screens/LandingScreen.tsx';
import { RoomScreen } from '../screens/RoomScreen.tsx';
import { roomConnection } from '../lib/roomConnection.ts';
import { MockWebSocket } from '../test/mockWebSocket.ts';

function renderApp() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<LandingScreen />} />
        <Route path="/room/:roomId" element={<RoomScreen />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('create session room flow', () => {
  beforeEach(() => {
    MockWebSocket.reset();
    vi.stubGlobal('WebSocket', MockWebSocket);
  });

  afterEach(() => {
    roomConnection.reset();
    vi.unstubAllGlobals();
  });

  it('creates a room and lands the creator as host (AC01, AC04, AC06)', async () => {
    const user = userEvent.setup();
    renderApp();

    // AC01: initiate a new session with an empty callsign.
    await user.click(
      screen.getByRole('button', { name: /initiate new session/i }),
    );

    // AC06: creator lands in the room as host with deck and host controls.
    expect(await screen.findByText(/personnel/i)).toBeInTheDocument();
    expect(await screen.findByText('HOST')).toBeInTheDocument();
    expect(
      screen.getByRole('region', { name: /card deck/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('region', { name: /host controls/i }),
    ).toBeInTheDocument();

    // AC04: an empty callsign is assigned a name (from the fallback list).
    const socket = MockWebSocket.instances[0];
    expect(socket.url).toMatch(/name=/);
    expect(socket.url).not.toMatch(/name=(&|$)/);
  });

  it('surfaces the room id and copy-link inside the room (AC02, AC03)', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(
      screen.getByRole('button', { name: /initiate new session/i }),
    );

    // AC02: room id is present in the connection URL and shown in the room.
    const socket = await waitFor(() => {
      const s = MockWebSocket.instances[0];
      expect(s).toBeDefined();
      return s;
    });
    const roomId = new URL(socket.url).searchParams.get('room');
    expect(roomId).toBeTruthy();
    expect(await screen.findByText(roomId!)).toBeInTheDocument();

    // AC03: copy-link affordance is available inside the room.
    expect(
      screen.getByRole('button', { name: /copy room link/i }),
    ).toBeInTheDocument();
  });

  it('rejects an over-length callsign without creating a session (AC05)', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(
      screen.getByLabelText(/callsign/i),
      'a'.repeat(33),
    );
    await user.click(
      screen.getByRole('button', { name: /initiate new session/i }),
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /32 characters or fewer/i,
    );
    // Session was not created — no socket opened, still on landing.
    expect(MockWebSocket.instances).toHaveLength(0);
    expect(
      screen.getByRole('button', { name: /initiate new session/i }),
    ).toBeInTheDocument();
  });

  it('keeps the creator on the landing screen when the connection fails (AC07)', async () => {
    MockWebSocket.behaviour = 'fail';
    const user = userEvent.setup();
    renderApp();

    await user.click(
      screen.getByRole('button', { name: /initiate new session/i }),
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /unable to establish a session/i,
    );
    // Still on the landing screen — the room never rendered.
    expect(screen.queryByText(/personnel/i)).not.toBeInTheDocument();
  });
});
