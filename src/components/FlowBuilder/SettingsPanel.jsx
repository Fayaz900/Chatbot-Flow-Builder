import React from "react";
import '../../App.css'

const SettingsPanel = ({ selectedNode, updateNodeText, clearSelection }) => {
  if (!selectedNode) return null;

  return (
    <div className="settings-panel">
      <div className="settings-header">
        <h3>Node Settings</h3>
        <button className="close-button" onClick={clearSelection}>×</button>
      </div>

      <div className="settings-content">
        <div className="setting-group">
          <label htmlFor="node-text">Message</label>
          <textarea
            id="node-text"
            value={selectedNode.data.label}
            onChange={(e) => updateNodeText(selectedNode.id, e.target.value)}
            placeholder="Enter message text"
            rows={3}
          />
        </div>

        <div className="node-info-display">
          <h4>Node Information</h4>
          <p><strong>Type:</strong> {selectedNode.type}</p>
          <p><strong>ID:</strong> {selectedNode.id}</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
