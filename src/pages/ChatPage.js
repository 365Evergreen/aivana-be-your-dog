import React, { useEffect, useRef } from 'react';
import "../assets/styles/ChatPage.css";

export default function ChatPage() {
  const chatContainerRef = useRef(null);
  const tenantId = "7a5bf294-6ae8-47c4-b0c4-b2f9166d7a3f";
  const botId = "53333422-097b-f011-b4cc-000d3a79d4f1";

  useEffect(() => {
    // Load the Bot Framework Web Chat script
    const script = document.createElement("script");
    script.src = "https://cdn.botframework.com/botframework-webchat/latest/webchat.js";
    script.async = true;
    document.body.appendChild(script);

    // Initialize chat after script loads
    script.onload = async () => {
      try {
        // Get Direct Line token from Copilot Studio
        const tokenResponse = await fetch(`https://powerva.microsoft.com/api/botmanagement/v1/directline/directlinetoken?botId=${botId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!tokenResponse.ok) {
          throw new Error('Failed to get token');
        }

        const { token } = await tokenResponse.json();

        // Render the Web Chat with the token
        window.WebChat.renderWebChat(
          {
            directLine: window.WebChat.createDirectLine({ token }),
            styleOptions: {
              botAvatarImage: 'https://docs.microsoft.com/en-us/azure/bot-service/v4sdk/media/logo_bot.svg',
              userAvatarImage: 'https://avatars.githubusercontent.com/u/12345678',
              bubbleBackground: '#F2F2F2',
              bubbleFromUserBackground: '#E6F2FF',
              rootHeight: '100%',
              rootWidth: '100%'
            }
          },
          chatContainerRef.current
        );
      } catch (error) {
        console.error("Chat initialization error:", error);
        
        // Fallback to the alternative approach if token acquisition fails
        chatContainerRef.current.innerHTML = `
          <div class="fallback-message">
            <h3>Chat Service Connection Issue</h3>
            <p>Unable to connect to the chat service directly. Try using the chat button instead.</p>
            <button id="openChatButton" class="fallback-button">Open Chat in New Window</button>
          </div>
        `;
        
        document.getElementById('openChatButton').addEventListener('click', () => {
          const botUrl = `https://web.powerva.microsoft.com/environments/Default-${tenantId}/bots/${botId}/webchat`;
          window.open(botUrl, '_blank', 'width=400,height=600');
        });
      }
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [botId, tenantId]);

  return (
    <div className="chat-page">
      <div className="chat-header">
        <h2>AI Assistant</h2>
        <p>Powered by Microsoft Copilot Studio</p>
      </div>
      <div 
        className="chat-container" 
        ref={chatContainerRef}
      />
    </div>
  );
}
