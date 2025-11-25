import React, { useState, useEffect } from 'react';

function Options() {
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    // Restores API key from chrome.storage.
    // global chrome
    chrome.storage.sync.get({
      apiKey: ''
    }, (items) => {
      setApiKey(items.apiKey);
    });
  }, []);

  const saveOptions = () => {
    chrome.storage.sync.set({
      apiKey: apiKey
    }, () => {
      // Update status to let user know options were saved.
      setStatus('Options saved.');
      setTimeout(() => {
        setStatus('');
      }, 750);
    });
  };

  return (
    <div>
      <h2>Settings</h2>
      <label htmlFor="apiKey">Gemini API Key:</label>
      <input 
        type="password" 
        id="apiKey" 
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="Enter your API key" 
      />
      <button onClick={saveOptions}>Save</button>
      <div id="status">{status}</div>
    </div>
  );
}

export default Options;
