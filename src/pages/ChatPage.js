import React, { useEffect, useRef } from 'react';
import "../assets/styles/ChatPage.css";

export default function ChatPage() {
  const chatContainerRef = useRef(null);
  const tenantId = "7a5bf294-6ae8-47c4-b0c4-b2f9166d7a3f";
  const botId = "53333422-097b-f011-b4cc-000d3a79d4f1";

  useEffect(() => {
    // Reference to store the iframe element
    let iframeElement = null;
    
    // Only proceed if the container ref is available
    if (!chatContainerRef.current) return;
    
    const loadBot = () => {
      try {
        // Create and add the iframe
        const iframe = document.createElement('iframe');
        iframe.src = `https://web.powerva.microsoft.com/environments/Default-${tenantId}/bots/${botId}/webchat`;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.title = "Copilot Studio Chat";
        iframe.allow = "microphone; camera";
        
        // Add error handling for iframe load
        iframe.onerror = () => {
          showErrorMessage();
        };
        
        // Clear any existing content
        chatContainerRef.current.innerHTML = '';
        chatContainerRef.current.appendChild(iframe);
        
        // Store reference to the iframe
        iframeElement = iframe;
        
        // Add message event listener to catch errors from iframe
        window.addEventListener('message', handleIframeMessages);
      } catch (error) {
        console.error("Error loading bot:", error);
        showErrorMessage();
      }
    };
    
    // Handle messages from the iframe
    const handleIframeMessages = (event) => {
      // Check if message indicates an error
      if (event.data && event.data.error) {
        showErrorMessage();
      }
    };
    
    // Show error message when bot fails to load
    const showErrorMessage = () => {
      if (!chatContainerRef.current) return;
      
      chatContainerRef.current.innerHTML = `
        <div class="chat-error">
          <h3>Connection Error</h3>
          <p>Unable to connect to the AI Assistant. Please try again later.</p>
          <button id="retry-button">Try Again</button>
          <p class="small-text">If the problem persists, you may need to <a href="https://web.powerva.microsoft.com/environments/Default-${tenantId}/bots/${botId}/webchat" target="_blank">open the assistant in a new window</a>.</p>
        </div>
      `;
      
      // Add event listener to retry button
      const retryButton = chatContainerRef.current.querySelector('#retry-button');
      if (retryButton) {
        retryButton.addEventListener('click', loadBot);
      }
    };
    
    // Load the bot initially
    loadBot();
    
    // Clean up function
    return () => {
      window.removeEventListener('message', handleIframeMessages);
      if (chatContainerRef.current) {
        chatContainerRef.current.innerHTML = '';
      }
    };
  }, [tenantId, botId]);

  return (
    <div className="chat-page">
      <div className="chat-header">
        <h2>AI Assistant</h2>
        <p>Powered by Microsoft Copilot Studio</p>
      </div>
      <div ref={chatContainerRef} className="chat-container"></div>
    </div>
  );
}
