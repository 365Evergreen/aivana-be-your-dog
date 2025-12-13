import React, { useState } from 'react';
import Button from '../components/common/Button';
import '../assets/styles/AdminPages.css';

// Sample initial pages data
const initialPages = [
  {
    id: 1,
    title: 'Partner Portal Home',
    description: 'Main landing page for the Partner Portal',
    status: 'published',
    templateType: 'landing template',
    lastUpdated: '2023-06-10',
    updatedBy: 'System Admin',
    audience: 'public'
  },
  {
    id: 2,
    title: 'Contract Templates Library',
    description: 'Collection of contract templates and resources',
    status: 'draft',
    templateType: 'library template',
    lastUpdated: '2023-05-10',
    updatedBy: 'Content Team',
    audience: 'partners'
  },
  {
    id: 3,
    title: 'Getting Started Guide',
    description: 'Comprehensive guide for new partners',
    status: 'published',
    templateType: 'article template',
    lastUpdated: '2023-08-09',
    updatedBy: 'Content Team',
    audience: 'partners'
  }
];

export default function AdminPagesPage() {
  const [pages, setPages] = useState(initialPages);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleCreatePage = () => {
    setCurrentPage({
      id: Date.now(), // Simple ID generation
      title: '',
      description: '',
      status: 'draft',
      templateType: 'article template',
      lastUpdated: new Date().toISOString().split('T')[0],
      updatedBy: 'Current User',
      audience: 'public'
    });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEditPage = (page) => {
    setCurrentPage(page);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDeletePage = (pageId) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      setPages(pages.filter(page => page.id !== pageId));
    }
  };

  const handleSavePage = (pageData) => {
    if (isEditing) {
      setPages(pages.map(page => 
        page.id === pageData.id ? pageData : page
      ));
    } else {
      setPages([...pages, pageData]);
    }
    setShowForm(false);
  };

  return (
    <div className="admin-pages-container">
      <div className="admin-pages-header">
        <h1>Page Manager</h1>
        <p>Create and manage site pages</p>
        <Button variant="primary" className="create-page-button" onClick={handleCreatePage} icon={<span>+</span>}>Create Page</Button>
      </div>

      {showForm ? (
        <PageForm 
          page={currentPage} 
          isEditing={isEditing}
          onSave={handleSavePage}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <div className="pages-grid">
          {pages.map(page => (
            <PageCard 
              key={page.id} 
              page={page} 
              onEdit={handleEditPage}
              onDelete={handleDeletePage}
            />
          ))}
        </div>
      )}

      <div className="component-gallery">
        <h2>Component Gallery</h2>
        <p>Browse and preview available components for your pages</p>
        <div className="component-placeholder"></div>
      </div>
    </div>
  );
}

// Page Card Component
function PageCard({ page, onEdit, onDelete }) {
  return (
    <div className="page-card">
      <h3>{page.title}</h3>
      <p className="page-description">{page.description}</p>
      
      <div className="page-status">
        <span className={`status-badge ${page.status}`}>
          {page.status}
        </span>
        <span className="audience-badge">
          {page.audience}
        </span>
      </div>
      
      <div className="page-meta">
        <p><span>By:</span> {page.updatedBy}</p>
        <p><span>Updated:</span> {page.lastUpdated}</p>
        <p><span>Type:</span> {page.templateType}</p>
      </div>
      
      <div className="page-actions">
        <Button className="view-button">View</Button>
        <Button className="edit-button" onClick={() => onEdit(page)}>Edit</Button>
        <Button className="delete-button" onClick={() => onDelete(page.id)}>Delete</Button>
      </div>
    </div>
  );
}

// Page Form Component
function PageForm({ page, isEditing, onSave, onCancel }) {
  const [formData, setFormData] = useState(page);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      lastUpdated: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="page-form">
      <h2>{isEditing ? 'Edit Page' : 'Create New Page'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Page Title</label>
          <input 
            type="text" 
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea 
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select 
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="audience">Audience</label>
            <select 
              id="audience"
              name="audience"
              value={formData.audience}
              onChange={handleChange}
            >
              <option value="public">Public</option>
              <option value="partners">Partners</option>
              <option value="internal">Internal</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="templateType">Template Type</label>
            <select 
              id="templateType"
              name="templateType"
              value={formData.templateType}
              onChange={handleChange}
            >
              <option value="article template">Article</option>
              <option value="landing template">Landing Page</option>
              <option value="library template">Library</option>
            </select>
          </div>
        </div>
        
        <div className="form-actions">
          <Button type="button" className="cancel-button" onClick={onCancel}>Cancel</Button>
          <Button type="submit" className="save-button" variant="primary">{isEditing ? 'Update Page' : 'Create Page'}</Button>
        </div>
      </form>
    </div>
  );
}