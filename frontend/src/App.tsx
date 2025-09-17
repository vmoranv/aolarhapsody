import { CopilotKit } from '@copilotkit/react-core';
import { Analytics } from '@vercel/analytics/react';
import MainContent from './components/MainContent';
import '@copilotkit/react-ui/styles.css';

const App = () => {
  return (
    <CopilotKit
      publicApiKey={import.meta.env.VITE_COPILOT_PUBLIC_API_KEY}
      publicLicenseKey={import.meta.env.VITE_COPILOT_LICENSE_KEY}
    >
      <MainContent />
      <Analytics />
    </CopilotKit>
  );
};

export default App;
