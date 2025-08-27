import React from 'react';
import "../assets/styles/ChatPage.css";

export default function ChatPage() {
  const tenantId = "7a5bf294-6ae8-47c4-b0c4-b2f9166d7a3f";
  const botId = "53333422-097b-f011-b4cc-000d3a79d4f1";
  
  // Use the official embedded chat URL
  const botUrl = `https://web.powerva.microsoft.com/environments/Default-${tenantId}/bots/${botId}/webchat`;

  return (
    <div className="chat-page">
      <div className="chat-header">
        <h2>AI Assistant</h2>
        <p>Powered by Microsoft Copilot Studio</p>
      </div>
      <div className="chat-container">
        <iframe
          src={botUrl}
          frameBorder="0"
          style={{ width: '100%', height: '600px', borderRadius: '8px' }}
          title="Copilot Studio Chat"
          allow="microphone; camera"
        />
      </div>
    </div>
  );
}
