import React from "react";
import '../../App.css'

const NodesPanel = ({ onDragStart }) => {
  const nodeTypesList = [
    { type: "textNode", label: "Message", description: "Send Message", icon: "💬" },
    // add more node types later
  ];

  return (
    <div className="nodes-panel">
      <h3>Nodes Panel</h3>
      {nodeTypesList.map((nodeType) => (
        <div
          key={nodeType.type}
          className="node-type"
          onDragStart={(event) => onDragStart(event, nodeType.type)}
          draggable
        >
          <span className="node-icon">{nodeType.icon}</span>
          <div className="node-info">
            <div className="node-label">{nodeType.label}</div>
            <div className="node-description">{nodeType.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NodesPanel;
