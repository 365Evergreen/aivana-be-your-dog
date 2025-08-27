import React, { useEffect } from 'react';
import "../assets/styles/ChatPage.css";

export default function ChatPage() {
  const tenantId = "7a5bf294-6ae8-47c4-b0c4-b2f9166d7a3f";
  const botId = "53333422-097b-f011-b4cc-000d3a79d4f1";

  useEffect(() => {
    // Create a container for the chat iframe
    const chatContainer = document.getElementById('copilot-chat-container');
    
    // Create and add the iframe
    const iframe = document.createElement('iframe');
    iframe.src = `https://web.powerva.microsoft.com/environments/Default-${tenantId}/bots/${botId}/webchat`;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.title = "Copilot Studio Chat";
    iframe.allow = "microphone; camera";
    
    // Clear any existing content
    if (chatContainer) {
      chatContainer.innerHTML = '';
      chatContainer.appendChild(iframe);
    }
    
    return () => {
      // Clean up on unmount
      if (chatContainer) {
        chatContainer.innerHTML = '';
      }
    };
  }, [tenantId, botId]);

  return (
    <div className="chat-page">
      <div className="chat-header">
        <h2>AI Assistant</h2>
        <p>Powered by Microsoft Copilot Studio</p>
      </div>
      <div id="copilot-chat-container" className="chat-container"></div>
    </div>
  );
}
