import { CopilotKit } from '@copilotkit/react-core';
import MainContent from './components/MainContent';
import '@copilotkit/react-ui/styles.css';

const App = () => {
  return (
    <CopilotKit
      publicApiKey={import.meta.env.VITE_COPILOT_PUBLIC_API_KEY}
      publicLicenseKey={import.meta.env.VITE_COPILOT_LICENSE_KEY}
    >
      <MainContent />
    </CopilotKit>
  );
};

export default App;
