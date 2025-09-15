import { Handle, Position } from "reactflow";
import '../../../App.css'

const TextNode = ({ data, selected }) => {
  return (
    <div className={`text-node ${selected ? "selected" : ""}`}>
      <Handle type="target" position={Position.Left} className="target-handle" />
      <div className="node-content">
        <div className="node-header">
          <span className="node-icon">💬</span>
          <span className="node-title">Send Message</span>
        </div>
        <div className="node-message">{data.label}</div>
      </div>
      <Handle type="source" position={Position.Right} className="source-handle" />
    </div>
  );
};

export default TextNode;
