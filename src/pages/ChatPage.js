import React, { useEffect, useRef } from 'react';
import { useMsal } from "@azure/msal-react";
import "./ChatPage.css";

export default function ChatPage() {
  const chatContainerRef = useRef(null);
  const { accounts, instance } = useMsal();

  useEffect(() => {
    // Load the Microsoft Copilot Studio Web Chat SDK
    const script = document.createElement("script");
    script.src = "https://cdn.botframework.com/botframework-webchat/latest/webchat.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = async () => {
      try {
        // Get the token for the authenticated user
        const account = accounts[0];
        const tokenResponse = await instance.acquireTokenSilent({
          scopes: ["https://bots.botframework.com/.default"],
          account: account
        });

        // Initialize the Web Chat with your bot parameters
        window.WebChat.renderWebChat(
          {
            directLine: window.WebChat.createDirectLine({
              token: await getBotToken(tokenResponse.accessToken),
            }),
            styleOptions: {
              botAvatarImage: '/bot-avatar.png',
              accent: '#0078d4',
              backgroundColor: '#f5f5f5',
              bubbleBackground: '#fff',
              bubbleBorderRadius: 8,
              bubbleFromUserBackground: '#e8f5fd',
              bubbleFromUserBorderRadius: 8,
              userAvatarImage: '/user-avatar.png',
            }
          },
          chatContainerRef.current
        );
      } catch (error) {
        console.error("Error initializing chat:", error);
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [accounts, instance]);

  // Function to get the Direct Line token for your bot
  async function getBotToken(userToken) {
    // Replace with your bot's Direct Line token endpoint
    const botTokenEndpoint = `https://powerva.microsoft.com/api/botmanagement/v1/directline/directlinetoken?botId=53333422-097b-f011-b4cc-000d3a79d4f1`;
    
    const response = await fetch(botTokenEndpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.token;
    } else {
      throw new Error('Failed to get bot token');
    }
  }

  return (
    <div className="chat-page">
      <div className="chat-header">
        <h2>AI Assistant</h2>
        <p>Powered by Microsoft Copilot Studio</p>
      </div>
      <div className="chat-container" ref={chatContainerRef} />
    </div>
  );
}
