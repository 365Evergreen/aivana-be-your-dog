import React, { useState } from 'react';
import '../assets/styles/FloatingCopilotBot.css';
import Button from './common/Button';

export default function FloatingCopilotBot() {
  const [isOpen, setIsOpen] = useState(false);
  const tenantId = "7a5bf294-6ae8-47c4-b0c4-b2f9166d7a3f";
  const botId = "53333422-097b-f011-b4cc-000d3a79d4f1";
  const botUrl = `https://web.powerva.microsoft.com/environments/Default-${tenantId}/bots/${botId}/webchat`;

  return (
    <div className="floating-bot-container">
      {isOpen && (
        <div className="bot-dialog">
          <div className="bot-header" style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <h3>AI Assistant</h3>
            <Button className="close-button" onClick={() => setIsOpen(false)} ariaLabel="Close">×</Button>
          </div>
          <iframe
            src={botUrl}
            frameBorder="0"
            title="Copilot Bot"
            allow="microphone; camera"
            className="bot-iframe"
          />
        </div>
      )}
      <Button
        variant="primary"
        className="copilot-fab"
        onClick={() => setIsOpen(!isOpen)}
        ariaLabel="Open AI Assistant"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z" fill="white"/>
        </svg>
      </Button>
    </div>
  );
}