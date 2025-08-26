
import React, { useEffect, useState } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { loginRequest } from '../msalConfig';
import { getGraphClient } from '../services/graph';
import { Link } from 'react-router-dom';
import AIAssistant from '../components/AIAssistant';

export default function Dashboard() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [emails, setEmails] = useState([]);
  const [events, setEvents] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCopilot, setShowCopilot] = useState(false);

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
      <div className="dashboard-loading" style={{display:'flex',justifyContent:'center',alignItems:'center',height:'60vh'}}>
        <div className="loader" style={{border:'4px solid #f3f3f3',borderRadius:'50%',borderTop:'4px solid #2563eb',width:40,height:40,animation:'spin 1s linear infinite'}}></div>
        <style>{`@keyframes spin {0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}`}</style>
        <span style={{marginLeft:16,fontSize:18,color:'#888'}}>Loading your workspace...</span>
      </div>
    );
  }

  return (
    <div className="dashboard-main" style={{background:'#f8f9fa',minHeight:'100vh',padding:'0 0 40px 0',position:'relative'}}>
      {/* Navigation Bar */}
      <nav style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'#fff',padding:'18px 40px',boxShadow:'0 2px 8px rgba(0,0,0,0.04)',marginBottom:32}}>
        <div style={{display:'flex',alignItems:'center',gap:24}}>
          <a href="https://github.com/365Evergreen/aivana-be-your-dog" style={{fontWeight:700,fontSize:22,color:'#2563eb',textDecoration:'none',letterSpacing:'-1px'}}>Be Your Dog</a>
          <Link to="/dashboard" style={{color:'#222',textDecoration:'none',fontWeight:500}}>Dashboard</Link>
          <Link to="/calendar" style={{color:'#222',textDecoration:'none',fontWeight:500}}>Calendar</Link>
          <Link to="/email" style={{color:'#222',textDecoration:'none',fontWeight:500}}>Email</Link>
          <Link to="/files" style={{color:'#222',textDecoration:'none',fontWeight:500}}>Files</Link>
          <Link to="/admin" style={{color:'#222',textDecoration:'none',fontWeight:500}}>Admin</Link>
        </div>
        <div style={{fontSize:15,color:'#888'}}>Brisbane time: {getBrisbaneTime()}</div>
      </nav>
      {/* Header */}
      <div style={{maxWidth:1200,margin:'0 auto',padding:'0 24px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:32}}>
          <div>
            <h1 style={{fontWeight:700,fontSize:36,marginBottom:8,letterSpacing:'-1px',color:'#222'}}>Good morning!</h1>
            <p style={{fontSize:18,color:'#666',margin:0}}>Here's what's happening with your Microsoft 365 workspace today.</p>
          </div>
        </div>
        {/* Widgets Row */}
        <div style={{display:'flex',gap:24,marginBottom:32}}>
          <div style={{flex:1,background:'#fff',borderRadius:16,boxShadow:'0 2px 8px rgba(0,0,0,0.04)',padding:24,display:'flex',flexDirection:'column',alignItems:'flex-start'}}>
            <div style={{fontSize:32,marginBottom:8,background:'#e8f0fe',color:'#2563eb',borderRadius:8,padding:'8px 12px'}}>📧</div>
            <div style={{fontWeight:600,fontSize:18,marginBottom:4}}>Unread Emails</div>
            <div style={{fontSize:28,fontWeight:700,marginBottom:2}}>{emails.length}</div>
            <div style={{color:'#888',fontSize:15}}>{emails[0]?.subject || ''}</div>
          </div>
          <div style={{flex:1,background:'#fff',borderRadius:16,boxShadow:'0 2px 8px rgba(0,0,0,0.04)',padding:24,display:'flex',flexDirection:'column',alignItems:'flex-start'}}>
            <div style={{fontSize:32,marginBottom:8,background:'#e6f4ea',color:'#22c55e',borderRadius:8,padding:'8px 12px'}}>📅</div>
            <div style={{fontWeight:600,fontSize:18,marginBottom:4}}>Today's Meetings</div>
            <div style={{fontSize:28,fontWeight:700,marginBottom:2}}>{events.length}</div>
            <div style={{color:'#888',fontSize:15}}>{events[0]?.subject || ''}</div>
          </div>
          <div style={{flex:1,background:'#fff',borderRadius:16,boxShadow:'0 2px 8px rgba(0,0,0,0.04)',padding:24,display:'flex',flexDirection:'column',alignItems:'flex-start'}}>
            <div style={{fontSize:32,marginBottom:8,background:'#f3e8ff',color:'#a259ec',borderRadius:8,padding:'8px 12px'}}>📄</div>
            <div style={{fontWeight:600,fontSize:18,marginBottom:4}}>Recent Files</div>
            <div style={{fontSize:28,fontWeight:700,marginBottom:2}}>{files.length}</div>
            <div style={{color:'#888',fontSize:15}}>{files[0]?.name || ''}</div>
          </div>
          <div style={{flex:1,background:'#fff',borderRadius:16,boxShadow:'0 2px 8px rgba(0,0,0,0.04)',padding:24,display:'flex',flexDirection:'column',alignItems:'flex-start'}}>
            <div style={{fontSize:32,marginBottom:8,background:'#fff7e6',color:'#f59e42',borderRadius:8,padding:'8px 12px'}}>👥</div>
            <div style={{fontWeight:600,fontSize:18,marginBottom:4}}>Team Updates</div>
            <div style={{fontSize:28,fontWeight:700,marginBottom:2}}>-</div>
            <div style={{color:'#888',fontSize:15}}>-</div>
          </div>
        </div>
        {/* Main Sections */}
        <div style={{display:'flex',gap:24,marginBottom:32}}>
          <div style={{flex:2,background:'#fff',borderRadius:16,boxShadow:'0 2px 8px rgba(0,0,0,0.04)',padding:24}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
              <h2 style={{fontWeight:700,fontSize:22,margin:0}}>Today's Schedule</h2>
              <Link to="/calendar" style={{color:'#2563eb',fontWeight:500,textDecoration:'none'}}>View All</Link>
            </div>
            <ul style={{listStyle:'none',padding:0,margin:0}}>
              {events.map(ev => (
                <li key={ev.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid #f0f0f0'}}>
                  <div>
                    <span style={{fontWeight:600,fontSize:16}}>{ev.subject}</span>
                    <span style={{marginLeft:12,color:'#888',fontSize:14}}>{ev.start?.dateTime?.slice(11,16)} · {ev.attendees?.length || 0} attendees</span>
                  </div>
                  <span style={{color:'#2563eb',fontWeight:500,fontSize:14}}>{ev.showAs || 'Scheduled'}</span>
                </li>
              ))}
            </ul>
          </div>
          <div style={{flex:1,background:'#fff',borderRadius:16,boxShadow:'0 2px 8px rgba(0,0,0,0.04)',padding:24}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
              <h2 style={{fontWeight:700,fontSize:22,margin:0}}>Recent Emails</h2>
              <Link to="/email" style={{color:'#2563eb',fontWeight:500,textDecoration:'none'}}>View Inbox</Link>
            </div>
            <ul style={{listStyle:'none',padding:0,margin:0}}>
              {emails.map(email => (
                <li key={email.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid #f0f0f0'}}>
                  <div>
                    <span style={{fontWeight:600,fontSize:16}}>{email.from?.emailAddress?.name}</span>
                    <span style={{marginLeft:12,color:'#888',fontSize:14}}>{email.subject}</span>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span style={{color:'#888',fontSize:13}}>{email.receivedDateTime?.slice(11,16)}</span>
                    {email.importance === 'high' && <span style={{color:'#f43f5e',fontWeight:600,fontSize:13}}>High</span>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Files Section */}
        <div style={{background:'#fff',borderRadius:16,boxShadow:'0 2px 8px rgba(0,0,0,0.04)',padding:24}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
            <h2 style={{fontWeight:700,fontSize:22,margin:0}}>Recent Files & Documents</h2>
            <button disabled title="Coming soon" style={{background:'#eee',color:'#aaa',border:'none',borderRadius:6,padding:'8px 18px',fontWeight:500,cursor:'not-allowed'}}>Browse OneDrive</button>
          </div>
          <div style={{display:'flex',gap:24,flexWrap:'wrap'}}>
            {files.map(file => (
              <div key={file.id} style={{flex:'0 0 220px',background:'#f8f9fa',borderRadius:10,padding:16,marginBottom:16,boxShadow:'0 1px 4px rgba(0,0,0,0.03)'}}>
                <div style={{fontWeight:600,fontSize:16,marginBottom:6}}>{file.name}</div>
                <div style={{color:'#888',fontSize:13,marginBottom:4}}>Modified {file.lastModifiedDateTime?.slice(0,10)}</div>
                <div style={{color:'#2563eb',fontSize:13}}>{file.createdBy?.user?.displayName ? `Shared by ${file.createdBy.user.displayName}` : ''}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Copilot Floating Button */}
      <button
        onClick={() => setShowCopilot(true)}
        style={{position:'fixed',bottom:32,right:32,zIndex:1000,background:'#2563eb',color:'#fff',border:'none',borderRadius:'50%',width:64,height:64,boxShadow:'0 4px 16px rgba(37,99,235,0.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:32,cursor:'pointer'}}
        aria-label="Open Copilot Assistant"
      >
        <span role="img" aria-label="Copilot">🤖</span>
      </button>
      {/* Copilot Modal */}
      {showCopilot && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.25)',zIndex:1100,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',borderRadius:16,boxShadow:'0 8px 32px rgba(0,0,0,0.18)',padding:0,maxWidth:520,width:'90vw',maxHeight:'90vh',display:'flex',flexDirection:'column',overflow:'hidden',position:'relative'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'18px 24px',borderBottom:'1px solid #f0f0f0',background:'#f8f9fa'}}>
              <span style={{fontWeight:700,fontSize:20,color:'#2563eb'}}>Copilot Assistant</span>
              <button onClick={() => setShowCopilot(false)} style={{background:'none',border:'none',fontSize:22,cursor:'pointer',color:'#888'}} aria-label="Close">×</button>
            </div>
            <div style={{flex:1,overflow:'auto',padding:24}}>
              <AIAssistant />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
