import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { EmailProvider } from './contexts/EmailContext';
import { LearningProvider } from './contexts/LearningContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { AppRoutes } from './routes';
import { TooltipProvider } from './components/ui/tooltip';
import AIConsultantPage from './components/ai/AIConsultantPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <LearningProvider>
            <SettingsProvider>
              <EmailProvider>
                <TooltipProvider>
                  <BrowserRouter>
                    <Routes>
                      <Route path="/ai-consultant" element={<AIConsultantPage />} />
                      <Route path="/*" element={<AppRoutes />} />
                    </Routes>
                  </BrowserRouter>
                </TooltipProvider>
              </EmailProvider>
            </SettingsProvider>
          </LearningProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;