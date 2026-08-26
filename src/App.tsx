import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import { SessionsProvider } from './context/SessionsContext';
import { ToastProvider } from './context/ToastContext';
import { Header } from './components/Header';
import { ToastStack } from './components/ToastStack';
import { Home } from './pages/Home';
import { Statistics } from './pages/Statistics';
import { Relax } from './pages/Relax';
import { Settings } from './pages/Settings';

export default function App() {
  return (
    <SettingsProvider>
      <SessionsProvider>
        <ToastProvider>
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <Header />
              <ToastStack />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/stats" element={<Statistics />} />
                  <Route path="/relax" element={<Relax />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </main>
            </div>
          </BrowserRouter>
        </ToastProvider>
      </SessionsProvider>
    </SettingsProvider>
  );
}
