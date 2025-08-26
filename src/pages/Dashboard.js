
import React, { useEffect, useState } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { loginRequest } from '../msalConfig';
import { getGraphClient } from '../services/graph';

export default function Dashboard() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [emails, setEmails] = useState([]);
  const [events, setEvents] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated && accounts.length > 0) {
        setLoading(true);
        const accessTokenRequest = {
          ...loginRequest,
          account: accounts[0],
        };
        try {
          const response = await instance.acquireTokenSilent(accessTokenRequest);
          const client = getGraphClient(response.accessToken);
          // Fetch emails
          const emailsRes = await client.api('/me/mailfolders/inbox/messages').top(5).orderby('receivedDateTime DESC').get();
          setEmails(emailsRes.value || []);
          // Fetch events
          const eventsRes = await client.api('/me/calendar/events').top(3).orderby('start/dateTime DESC').get();
          setEvents(eventsRes.value || []);
          // Fetch files
          const filesRes = await client.api('/me/drive/root/recent').top(3).get();
          setFiles(filesRes.value || []);
        } catch (e) {
          // handle error
        }
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated, accounts, instance]);

  // Get current time in Brisbane (Australia/Brisbane)
  const getBrisbaneTime = () => {
    try {
      return new Date().toLocaleTimeString('en-AU', { timeZone: 'Australia/Brisbane', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return new Date().toLocaleTimeString();
    }
  };
  if (loading) {
    return (
      <div className="dashboard-loading">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>Good morning!</h1>
          <p>Here's what's happening with your Microsoft 365 workspace today.</p>
        </div>
        <div className="last-updated">Brisbane time: {getBrisbaneTime()}</div>
      </div>
      <div className="dashboard-widgets">
        <div className="widget-card">
          <div className="widget-icon" style={{background:'#e8f0fe', color:'#2563eb'}}>
            <span role="img" aria-label="email">📧</span>
          </div>
          <div className="widget-title">Unread Emails</div>
          <div className="widget-value">{emails.length}</div>
          <div className="widget-sub">{emails[0]?.subject || ''}</div>
        </div>
        <div className="widget-card">
          <div className="widget-icon" style={{background:'#e6f4ea', color:'#22c55e'}}>
            <span role="img" aria-label="calendar">📅</span>
          </div>
          <div className="widget-title">Today's Meetings</div>
          <div className="widget-value">{events.length}</div>
          <div className="widget-sub">{events[0]?.subject || ''}</div>
        </div>
        <div className="widget-card">
          <div className="widget-icon" style={{background:'#f3e8ff', color:'#a259ec'}}>
            <span role="img" aria-label="files">📄</span>
          </div>
          <div className="widget-title">Recent Files</div>
          <div className="widget-value">{files.length}</div>
          <div className="widget-sub">{files[0]?.name || ''}</div>
        </div>
        <div className="widget-card">
          <div className="widget-icon" style={{background:'#fff7e6', color:'#f59e42'}}>
            <span role="img" aria-label="team">👥</span>
          </div>
          <div className="widget-title">Team Updates</div>
          <div className="widget-value">-</div>
          <div className="widget-sub">-</div>
        </div>
      </div>
      <div className="dashboard-sections">
        <div className="section-card" style={{flex:2}}>
          <div className="section-header">
            <h2>Today's Schedule</h2>
            <button>View All</button>
          </div>
          <ul className="schedule-list">
            {events.map(ev => (
              <li className="schedule-item" key={ev.id}>
                <div className="schedule-info">
                  <span className="schedule-title">{ev.subject}</span>
                  <span className="schedule-meta">{ev.start?.dateTime?.slice(11,16)} · {ev.attendees?.length || 0} attendees</span>
                </div>
                <span className="schedule-status">{ev.showAs || 'Scheduled'}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="section-card" style={{flex:1}}>
          <div className="section-header">
            <h2>Recent Emails</h2>
            <button>View Inbox</button>
          </div>
          <ul className="email-list">
            {emails.map(email => (
              <li className="email-item" key={email.id}>
                <div className="email-info">
                  <span className="email-sender">{email.from?.emailAddress?.name}</span>
                  <span className="email-subject">{email.subject}</span>
                </div>
                <div className="email-meta">
                  <span className="email-time">{email.receivedDateTime?.slice(11,16)}</span>
                  {email.importance === 'high' && <span className="email-priority">High</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="section-card">
        <div className="section-header">
          <h2>Recent Files & Documents</h2>
          <div className="files-section-footer">
            <button disabled title="Coming soon">Browse OneDrive</button>
          </div>
        </div>
        <div className="files-list">
          {files.map(file => (
            <div className="file-card" key={file.id}>
              <div className="file-title">{file.name}</div>
              <div className="file-meta">Modified {file.lastModifiedDateTime?.slice(0,10)}</div>
              <div className="file-shared">{file.createdBy?.user?.displayName ? `Shared by ${file.createdBy.user.displayName}` : ''}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
