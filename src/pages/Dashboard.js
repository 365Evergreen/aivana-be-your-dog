import React, { useEffect, useState } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { loginRequest } from '../msalConfig';
import { Client } from '@microsoft/microsoft-graph-client';
import { Link } from 'react-router-dom';
import AIAssistant from '../components/AIAssistant';
import { Stack } from '@fluentui/react';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import DynamicSharePointForm from '../components/common/DynamicSharePointForm';

export default function Dashboard() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [emails, setEmails] = useState([]);
  const [events, setEvents] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCopilot, setShowCopilot] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated && accounts.length > 0) {
        setLoading(true);
        try {
          const account = accounts[0];
          const response = await instance.acquireTokenSilent({
            ...loginRequest,
            account,
          });
          const accessToken = response.accessToken;

          const graphClient = Client.init({
            authProvider: (done) => {
              done(null, accessToken);
            },
          });

          // Fetch emails
          const mailRes = await graphClient.api('/me/mailfolders/inbox/messages').top(5).get();
          setEmails(mailRes.value || []);

          // Fetch calendar events
          const eventsRes = await graphClient.api('/me/events').top(5).get();
          setEvents(eventsRes.value || []);

          // Fetch files
          const filesRes = await graphClient.api('/me/drive/root/children').top(5).get();
          setFiles(filesRes.value || []);
        } catch (e) {
          // handle error
        }
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated, accounts, instance]);

  // (Removed unused getBrisbaneTime helper)
  if (loading) {
    return (
      <div className="dashboard-loading" style={{display:'flex',justifyContent:'center',alignItems:'center',height:'60vh'}}>
        <div className="loader" style={{border:'4px solid var(--fluent-surface)',borderRadius:'50%',borderTop:'4px solid var(--fluent-primary)',width:40,height:40,animation:'spin 1s linear infinite'}}></div>
        <style>{`@keyframes spin {0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}`}</style>
        <span style={{marginLeft:16,fontSize:18,color:'var(--fluent-muted)'}}>Loading your workspace...</span>
      </div>
    );
  }

  return (
    <div className="dashboard-main" style={{minHeight:'100vh',padding:'0 0 40px 0',position:'relative'}}>
      {/* Top navigation removed — simplified header */}
      {/* Header */}
      <div style={{maxWidth:1200,margin:'0 auto',padding:'0 24px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:32}}>
          <div>
            <h1 style={{fontWeight:700,fontSize:36,marginBottom:8,letterSpacing:'-1px'}}>Good morning!</h1>
            <p style={{fontSize:18,margin:0}}>Here's what's happening with your Microsoft 365 workspace today.</p>
          </div>
        </div>
        {/* Widgets Row */}
        <Stack horizontal tokens={{ childrenGap: 24 }} styles={{ root: { marginBottom: 32 } }}>
          <div className="widget-card">
            <div className="widget-icon">📧</div>
            <div className="widget-title">Unread Emails</div>
            <div className="widget-value">{emails.length}</div>
            <div className="widget-sub">{emails[0]?.subject || ''}</div>
          </div>
          <div className="widget-card">
            <div className="widget-icon">📅</div>
            <div className="widget-title">Today's Meetings</div>
            <div className="widget-value">{events.length}</div>
            <div className="widget-sub">{events[0]?.subject || ''}</div>
          </div>
          <div className="widget-card">
            <div className="widget-icon">📄</div>
            <div className="widget-title">Recent Files</div>
            <div className="widget-value">{files.length}</div>
            <div className="widget-sub">{files[0]?.name || ''}</div>
          </div>
          <div className="widget-card">
            <div className="widget-icon">👥</div>
            <div className="widget-title">Team Updates</div>
            <div className="widget-value">-</div>
            <div className="widget-sub">-</div>
          </div>
          <div
            className="config-card"
            style={{ textDecoration: 'none', cursor: 'pointer' }}
            onClick={() => setShowExpenseModal(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setShowExpenseModal(true); } }}
          >
            <div className="widget-card" style={{ cursor: 'pointer' }}>
              <div className="widget-icon">💸</div>
              <div className="widget-title">Submit Expense</div>
              <div className="widget-sub" style={{ fontSize: 13, marginTop: 6 }}>Expenses form</div>
              <div style={{ marginTop: 10, color: 'var(--fluent-muted)', fontSize: 14 }}>Open the expenses form to submit a new expense report.</div>
            </div>
          </div>
        </Stack>
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
            <Button disabled className="btn-disabled" title="Coming soon">Browse OneDrive</Button>
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
      <Button
        variant="primary"
        onClick={() => setShowCopilot(true)}
        ariaLabel="Open Copilot Assistant"
        className="copilot-fab"
      >
        <span role="img" aria-label="Copilot">🤖</span>
      </Button>
      {/* Copilot Modal */}
      {showCopilot && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.25)',zIndex:1100,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',borderRadius:16,boxShadow:'0 8px 32px rgba(0,0,0,0.18)',padding:0,maxWidth:520,width:'90vw',maxHeight:'90vh',display:'flex',flexDirection:'column',overflow:'hidden',position:'relative'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'18px 24px',borderBottom:'1px solid #f0f0f0',background:'#f8f9fa'}}>
              <span style={{fontWeight:700,fontSize:20,color:'#2563eb'}}>Copilot Assistant</span>
              <Button onClick={() => setShowCopilot(false)} className="modal-close" ariaLabel="Close">×</Button>
            </div>
            <div style={{flex:1,overflow:'auto',padding:24}}>
              <AIAssistant />
            </div>
          </div>
        </div>
      )}
      {/* Expenses Modal */}
      <Modal open={showExpenseModal} onClose={() => setShowExpenseModal(false)}>
        <div style={{width:'min(900px,95vw)',maxHeight:'90vh',overflow:'auto'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'18px 24px',borderBottom:'1px solid #f0f0f0',background:'#f8f9fa'}}>
            <span style={{fontWeight:700,fontSize:20,color:'#2563eb'}}>Submit Expense</span>
            <Button onClick={() => setShowExpenseModal(false)} className="modal-close" ariaLabel="Close">×</Button>
          </div>
          <div style={{padding:24}}>
            <DynamicSharePointForm onSaved={() => setShowExpenseModal(false)} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
