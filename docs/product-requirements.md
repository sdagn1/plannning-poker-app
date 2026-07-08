# Product Requirements

## Overview

Planning Poker is a real-time, browser-based estimation tool. Participants join a shared room, vote on a story, and the host reveals all votes simultaneously. No accounts or persistence — each session is ephemeral.

---

## Functional Requirements

### 1. Room Creation

A user can start a new session without signing in.

**Acceptance criteria:**
- Generating a new room creates a unique room ID matching `^[a-z0-9]{4,32}(-[a-z0-9]{4,32})*$` (total ≤ 128 chars).
- The room ID is surfaced in the URL so it can be shared.
- The first user to connect becomes the **host**.
- A room is discarded as soon as all participants disconnect.

---

### 2. Joining a Room

Any user with the room URL can join.

**Acceptance criteria:**
- A display name (1–32 chars after trim) is required to join.
- Joining a valid room opens a WebSocket connection to `wss://<host>/ws?room=<roomId>&name=<displayName>`.
- If `room` or `name` fails validation, the user sees an error and the connection is not opened.
- Rooms at capacity (50 participants) reject new joiners with a clear error message.
- No authentication is required; the room ID acts as the join code.

---

### 3. Voting

Participants submit a point estimate for the current story.

**Acceptance criteria:**
- Any participant (including the host) can cast a vote.
- Vote values are free-form strings (e.g. Fibonacci numbers, T-shirt sizes, `?`, `☕`).
- Submitting a new vote before reveal overwrites the previous vote silently.
- Voting is disabled once votes have been revealed; attempting to vote shows an error.
- The UI indicates which participants have voted (without revealing their value).

---

### 4. Revealing Votes

The host reveals all votes at once.

**Acceptance criteria:**
- Only the host sees an active **Reveal** button.
- On reveal, all vote values become visible to every participant simultaneously.
- Attempting to reveal when votes are already revealed shows an error (no state change).
- Revealing with zero votes is allowed; an empty result is shown.

---

### 5. Resetting the Round

The host clears votes to start a new estimation round.

**Acceptance criteria:**
- Only the host sees an active **Reset** button.
- Reset clears all votes and sets the round back to unrevealed.
- Attempting to reset when no votes exist and the round is already unrevealed shows an error.
- Non-host users receive an error if they attempt to reset.

---

### 6. Participant List

All participants can see who is in the room and their voting status.

**Acceptance criteria:**
- The participant list updates in real time as users join or leave.
- Each participant shows their display name and a voted/not-voted indicator.
- Display names are not required to be unique; the UI disambiguates duplicates by ID if needed.
- When a participant disconnects, they are removed from the list immediately.

---

### 7. Host Promotion

If the host disconnects, the session continues without interruption.

**Acceptance criteria:**
- On host disconnection, the participant who joined earliest (smallest `seq`) is automatically promoted to host.
- The new host immediately sees Reveal and Reset controls.
- All participants see the updated host assignment without a page reload.
- A reconnecting former host is treated as a new participant and does not regain host status.

---

### 8. Reconnection

A disconnected participant can rejoin a room.

**Acceptance criteria:**
- Reconnecting opens a fresh session (new user ID, no prior vote).
- On reconnect the client receives `welcome` followed by a full `state` snapshot.
- The reconnect flow uses the same logic as the initial join flow.
- Server close code `1001` (server shutdown) triggers an automatic reconnect attempt after a short delay.

---

### 9. Error Handling

Users receive clear, non-breaking feedback when an action fails.

**Acceptance criteria:**
- Server error messages are surfaced in the UI without crashing or disconnecting.
- The full error vocabulary from the API contract is handled (malformed message, rate limit, unknown type, etc.).
- The WebSocket remains open after a recoverable error.

---

### 10. Unanimous Vote Easter Egg

When the team reaches perfect consensus, a celebration is shown.

**Acceptance criteria:**
- Triggered only when votes are revealed, all participants voted, and every vote value is identical.
- Displays a full-consensus celebration showing Emperor Palpatine from *Revenge of the Sith* with the quote: **"I love democracy."**
- Triggered client-side on receipt of the `state` message with `revealed: true`; no backend change required.
- Does not trigger if any participant has not voted, or if any two vote values differ.
- The celebration is dismissible (e.g. clicking away or a close button).

---

## Non-Functional Requirements

| Concern | Requirement |
|---|---|
| Capacity | Up to 50 participants per room |
| Latency | State updates delivered to all participants in real time over WebSocket |
| Persistence | None — all state is in-memory; data is lost on server restart |
| Availability | Frontend should ping `GET /health` to keep the backend warm |
| Security | No user authentication; room IDs are unguessable join codes, not secrets |
| Compatibility | Must work in modern evergreen browsers |
