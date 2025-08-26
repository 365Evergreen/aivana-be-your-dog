
import React from 'react';

export default function Dashboard() {
  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>Good morning, John!</h1>
          <p>Here's what's happening with your Microsoft 365 workspace today.</p>
        </div>
        <div className="last-updated">Last updated: 18:13:21</div>
      </div>
      <div className="dashboard-widgets">
        <div className="widget-card">
          <div className="widget-icon" style={{background:'#e8f0fe', color:'#2563eb'}}>
            <span role="img" aria-label="email">📧</span>
          </div>
          <div className="widget-title">Unread Emails</div>
          <div className="widget-value">12</div>
          <div className="widget-sub">+3 from yesterday</div>
        </div>
        <div className="widget-card">
          <div className="widget-icon" style={{background:'#e6f4ea', color:'#22c55e'}}>
            <span role="img" aria-label="calendar">📅</span>
          </div>
          <div className="widget-title">Today's Meetings</div>
          <div className="widget-value">4</div>
          <div className="widget-sub">Next in 2 hours</div>
        </div>
        <div className="widget-card">
          <div className="widget-icon" style={{background:'#f3e8ff', color:'#a259ec'}}>
            <span role="img" aria-label="files">📄</span>
          </div>
          <div className="widget-title">Recent Files</div>
          <div className="widget-value">8</div>
          <div className="widget-sub">3 shared today</div>
        </div>
        <div className="widget-card">
          <div className="widget-icon" style={{background:'#fff7e6', color:'#f59e42'}}>
            <span role="img" aria-label="team">👥</span>
          </div>
          <div className="widget-title">Team Updates</div>
          <div className="widget-value">15</div>
          <div className="widget-sub">5 new mentions</div>
        </div>
      </div>
      <div className="dashboard-sections">
        <div className="section-card" style={{flex:2}}>
          <div className="section-header">
            <h2>Today's Schedule</h2>
            <button>View All</button>
          </div>
          <ul className="schedule-list">
            <li className="schedule-item">
              <div className="schedule-info">
                <span className="schedule-title">Weekly Team Standup</span>
                <span className="schedule-meta">10:00 AM · 8 attendees</span>
              </div>
              <span className="schedule-status">Upcoming</span>
            </li>
            <li className="schedule-item">
              <div className="schedule-info">
                <span className="schedule-title">Project Review</span>
                <span className="schedule-meta">2:00 PM · 4 attendees</span>
              </div>
              <span className="schedule-status">Upcoming</span>
            </li>
            <li className="schedule-item">
              <div className="schedule-info">
                <span className="schedule-title">Client Presentation</span>
                <span className="schedule-meta">4:30 PM · 12 attendees</span>
              </div>
              <span className="schedule-status">Upcoming</span>
            </li>
          </ul>
        </div>
        <div className="section-card" style={{flex:1}}>
          <div className="section-header">
            <h2>Recent Emails</h2>
            <button>View Inbox</button>
          </div>
          <ul className="email-list">
            <li className="email-item">
              <div className="email-info">
                <span className="email-sender">Sarah Johnson</span>
                <span className="email-subject">Q4 Budget Review</span>
              </div>
              <div className="email-meta">
                <span className="email-time">9:30 AM</span>
                <span className="email-priority">High</span>
              </div>
            </li>
            <li className="email-item">
              <div className="email-info">
                <span className="email-sender">Marketing Team</span>
                <span className="email-subject">Campaign Performance Update</span>
              </div>
              <div className="email-meta">
                <span className="email-time">8:45 AM</span>
              </div>
            </li>
            <li className="email-item">
              <div className="email-info">
                <span className="email-sender">IT Support</span>
                <span className="email-subject">System Maintenance Notice</span>
              </div>
              <div className="email-meta">
                <span className="email-time">8:20 AM</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className="section-card">
        <div className="section-header">
          <h2>Recent Files & Documents</h2>
          <div className="files-section-footer">
            <button>Browse OneDrive</button>
          </div>
        </div>
        <div className="files-list">
          <div className="file-card">
            <div className="file-title">Q4_Financial_Report.xlsx</div>
            <div className="file-meta">Modified 2 hours ago</div>
            <div className="file-shared">Shared by Finance Team</div>
          </div>
          <div className="file-card">
            <div className="file-title">Product_Roadmap_2024.pptx</div>
            <div className="file-meta">Modified 4 hours ago</div>
            <div className="file-shared">Shared by Product Team</div>
          </div>
          <div className="file-card">
            <div className="file-title">Meeting_Notes_Dec15.docx</div>
            <div className="file-meta">Modified 1 day ago</div>
            <div className="file-shared">Shared by You</div>
          </div>
        </div>
      </div>
    </div>
  );
}
