import React, { useState, useEffect } from 'react';
import { getKeywordsFromLLM } from './gemini';

function Popup() {
  const [roles, setRoles] = useState([]);
  const [currentRole, setCurrentRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [keywords, setKeywords] = useState({});
  const [status, setStatus] = useState('');
  const [showAddRole, setShowAddRole] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [editingKeyword, setEditingKeyword] = useState(null); // { name: string, count: number }

  // Load roles from storage on initial render
  useEffect(() => {
    chrome.storage.local.get(['roles'], (result) => {
      const storedRoles = result.roles || ['Software Engineer', 'Data Analyst', 'Product Manager', 'DevOps Engineer'];
      setRoles(storedRoles);
      if (!result.roles) {
        chrome.storage.local.set({ roles: storedRoles });
      }
    });
  }, []);

  // Load keywords when the current role changes
  useEffect(() => {
    if (currentRole) {
      chrome.storage.local.get(['roleKeywords'], (result) => {
        const roleKeywords = result.roleKeywords || {};
        const currentKeywords = roleKeywords[currentRole] || {};
        
        // Sort the keywords by count
        const sortedKeywords = Object.entries(currentKeywords)
          .sort(([, a], [, b]) => b - a)
          .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

        setKeywords(sortedKeywords);
      });
    } else {
      setKeywords({});
    }
  }, [currentRole]);

  const handleAnalyze = async () => {
    if (!currentRole) {
      alert('Please select a role!');
      return;
    }
    if (!jobDescription) {
      alert('Please paste a job description!');
      return;
    }

    chrome.storage.sync.get(['apiKey'], async (result) => {
      const apiKey = result.apiKey;
      if (!apiKey) {
        alert('Please set your Gemini API key in the extension options.');
        return;
      }

      setStatus('Analyzing...');
      try {
        const newKeywords = await getKeywordsFromLLM(jobDescription, apiKey);
        if (Object.keys(newKeywords).length === 0) {
          setStatus('No new technical keywords found.');
          return;
        }

        chrome.storage.local.get(['roleKeywords'], (res) => {
          const roleKeywords = res.roleKeywords || {};
          const existingKeywords = roleKeywords[currentRole] || {};
          
          const merged = { ...existingKeywords };
          Object.entries(newKeywords).forEach(([keyword, count]) => {
            const lowerKeyword = keyword.toLowerCase();
            if (merged[lowerKeyword]) {
              merged[lowerKeyword] += count;
            } else {
              merged[lowerKeyword] = count;
            }
          });

          const sortedKeywords = Object.entries(merged)
            .sort(([, a], [, b]) => b - a)
            .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

          roleKeywords[currentRole] = sortedKeywords;
          chrome.storage.local.set({ roleKeywords }, () => {
            setKeywords(sortedKeywords);
            setStatus('Analysis complete!');
            setJobDescription('');
          });
        });
      } catch (error) {
        setStatus(`Error: ${error.message}`);
      }
    });
  };

  const handleSaveNewRole = () => {
    if (newRole && !roles.includes(newRole)) {
      const updatedRoles = [...roles, newRole];
      setRoles(updatedRoles);
      chrome.storage.local.set({ roles: updatedRoles }, () => {
        setCurrentRole(newRole);
        setShowAddRole(false);
        setNewRole('');
      });
    } else if (roles.includes(newRole)) {
      alert('Role already exists!');
    }
  };
  
  const handleDeleteKeyword = (keywordToDelete) => {
    if (window.confirm(`Are you sure you want to delete "${keywordToDelete}"?`)) {
      const updatedKeywords = { ...keywords };
      delete updatedKeywords[keywordToDelete];
      
      chrome.storage.local.get(['roleKeywords'], (result) => {
        const roleKeywords = result.roleKeywords || {};
        roleKeywords[currentRole] = updatedKeywords;
        chrome.storage.local.set({ roleKeywords }, () => {
          setKeywords(updatedKeywords);
        });
      });
    }
  };

  const handleSaveEditedKeyword = (originalName, newName, newCount) => {
    const updatedKeywords = { ...keywords };
    delete updatedKeywords[originalName];

    if (updatedKeywords[newName]) {
        updatedKeywords[newName] += newCount;
    } else {
        updatedKeywords[newName] = newCount;
    }
    
    const sortedKeywords = Object.entries(updatedKeywords)
        .sort(([, a], [, b]) => b - a)
        .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

    chrome.storage.local.get(['roleKeywords'], (result) => {
        const roleKeywords = result.roleKeywords || {};
        roleKeywords[currentRole] = sortedKeywords;
        chrome.storage.local.set({ roleKeywords }, () => {
            setKeywords(sortedKeywords);
            setEditingKeyword(null);
        });
    });
  };


  return (
    <div>
      <h2>Job Keywords Tracker</h2>

      <button onClick={() => setShowAddRole(!showAddRole)} className="secondary">
        + Add New Role
      </button>

      {showAddRole && (
        <div className="add-role-form active">
          <label htmlFor="newRole">New Role Title:</label>
          <input
            type="text"
            id="newRole"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            placeholder="e.g., Software Engineer"
          />
          <button onClick={handleSaveNewRole}>Save Role</button>
          <button onClick={() => setShowAddRole(false)} className="secondary">
            Cancel
          </button>
        </div>
      )}

      <label htmlFor="role">Select Role:</label>
      <select id="role" value={currentRole} onChange={(e) => setCurrentRole(e.target.value)}>
        <option value="">-- Select a role --</option>
        {roles.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>

      <label htmlFor="jobDescription">Job Description:</label>
      <textarea
        id="jobDescription"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste the job description here..."
      ></textarea>

      <button onClick={handleAnalyze}>Analyze Keywords</button>
      <div style={{ marginTop: '10px', color: '#333' }}>{status}</div>

      {Object.keys(keywords).length > 0 && (
        <div className="keywords">
          <h3>Extracted Keywords</h3>
          <div>
            {Object.entries(keywords).map(([keyword, count]) => (
              <div key={keyword} className="keyword-item">
                <div className="keyword-info">
                  <span className="keyword-name">{keyword}</span>
                  <span className="keyword-count">{count} occurrence{count > 1 ? 's' : ''}</span>
                </div>
                <div className="keyword-actions">
                  <button onClick={() => setEditingKeyword({ name: keyword, count: count })} className="edit-btn secondary">Edit</button>
                  <button onClick={() => handleDeleteKeyword(keyword)} className="delete-btn secondary">Delete</button>
                </div>
              </div>
            ))}
          </div>
          {editingKeyword && (
            <EditForm 
              keyword={editingKeyword} 
              onSave={handleSaveEditedKeyword}
              onCancel={() => setEditingKeyword(null)} 
            />
          )}
        </div>
      )}
    </div>
  );
}

function EditForm({ keyword, onSave, onCancel }) {
    const [name, setName] = useState(keyword.name);
    const [count, setCount] = useState(keyword.count);

    const handleSave = () => {
        if (!name || isNaN(count) || count < 1) {
            alert('Invalid name or count.');
            return;
        }
        onSave(keyword.name, name.trim().toLowerCase(), parseInt(count, 10));
    };

    return (
        <div className="edit-form active">
            <h4>Edit Keyword</h4>
            <label htmlFor="editKeywordName">Name:</label>
            <input 
                type="text" 
                id="editKeywordName" 
                value={name}
                onChange={(e) => setName(e.target.value)} 
            />
            <label htmlFor="editKeywordCount">Count:</label>
            <input 
                type="number" 
                id="editKeywordCount" 
                min="1"
                value={count}
                onChange={(e) => setCount(e.target.value)}
            />
            <button onClick={handleSave}>Save</button>
            <button onClick={onCancel} className="secondary">Cancel</button>
        </div>
    );
}

export default Popup;
