import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import Button from '../components/common/Button';
import "../assets/styles/ChatPage.css";

export default function ChatPage() {
  const chatContainerRef = useRef(null);
  const tenantId = "7a5bf294-6ae8-47c4-b0c4-b2f9166d7a3f";
  const botId = "53333422-097b-f011-b4cc-000d3a79d4f1";

  useEffect(() => {
    // Only proceed if the container ref is available
    if (!chatContainerRef.current) return;

    // Capture the current ref value to use in cleanup
    const container = chatContainerRef.current;
    
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
        container.innerHTML = '';
        container.appendChild(iframe);
        
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
    
    // Show error message when bot fails to load — render a small React fragment so we can use Fluent buttons
    const showErrorMessage = () => {
      if (!container) return;

      // clear existing content
      container.innerHTML = '';

      const mount = document.createElement('div');
      container.appendChild(mount);

      const ErrorNode = (
        <div className="chat-error">
          <h3>Connection Error</h3>
          <p>Unable to connect to the AI Assistant. Please try again later.</p>
          <Button onClick={loadBot} className="ml-8">Try Again</Button>
          <p className="small-text">If the problem persists, you may need to <a href={`https://web.powerva.microsoft.com/environments/Default-${tenantId}/bots/${botId}/webchat`} target="_blank" rel="noreferrer">open the assistant in a new window</a>.</p>
        </div>
      );

      ReactDOM.render(ErrorNode, mount);
    };
    
    // Load the bot initially
    loadBot();
    
    // Clean up function
    return () => {
      window.removeEventListener('message', handleIframeMessages);
      if (container) {
        container.innerHTML = '';
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
