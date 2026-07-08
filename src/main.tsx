import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/theme.css';
import './styles/index.css';
import { LandingScreen } from './screens/LandingScreen.tsx';
import { RoomScreen } from './screens/RoomScreen.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingScreen />} />
        <Route path="/join/:roomId" element={<LandingScreen />} />
        <Route path="/room/:roomId" element={<RoomScreen />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
