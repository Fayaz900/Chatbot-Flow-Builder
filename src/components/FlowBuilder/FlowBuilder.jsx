import React, { useState, useCallback, useRef } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
} from "reactflow";
import "reactflow/dist/style.css";
import { toast } from "react-toastify";

import nodeTypes from "./nodes";        
import NodesPanel from "./NodesPanel";    
import SettingsPanel from "./SettingsPanel"; 
import "../../App.css";                   

// Initial empty state for nodes and edges
const initialNodes = [];
const initialEdges = [];

const FlowBuilder = () => {
  const reactFlowWrapper = useRef(null); 
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes); 
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges); 
  const [reactFlowInstance, setReactFlowInstance] = useState(null);    
  const [selectedNodeId, setSelectedNodeId] = useState(null);          

  // Get the full node object for the currently selected node
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  const onConnect = useCallback(
    (params) => {
      const existingConnection = edges.find((edge) => edge.source === params.source);
      if (existingConnection) {
        toast.warning("A source handle can only have one connection.");
        return;
      }
      setEdges((eds) => addEdge(params, eds));
    },
    [edges, setEdges]
  );

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      // Get position relative to flow canvas
      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const position = reactFlowInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      // Create new node
      const newNode = {
        id: `node-${Date.now()}`,
        type,
        position,
        data: { label: type === "textNode" ? "New Message" : "New Node" },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  /** Allow dropping by preventing default */
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  /** When a node is clicked, set it as the active selection */
  const onNodeClick = useCallback((_, node) => {
    setSelectedNodeId(node.id);
  }, []);

  const updateNodeText = useCallback(
    (nodeId, text) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId ? { ...node, data: { ...node.data, label: text } } : node
        )
      );
    },
    [setNodes]
  );

  /** Clear node selection (when closing settings panel) */
  const clearSelection = useCallback(() => setSelectedNodeId(null), []);

  const saveFlow = useCallback(() => {
    if (nodes.length > 1) {
      // Find nodes without incoming edges
      const nodesWithNoIncomingEdges = nodes.filter(
        (node) => !edges.some((edge) => edge.target === node.id)
      );
      if (nodesWithNoIncomingEdges.length > 1) {
        toast.error("Error: More than one node has empty target handles. Please connect all nodes properly.");
        return;
      }
    }
    console.log("Flow saved successfully!", { nodes, edges });
    toast.success("Flow saved successfully!");
  }, [nodes, edges]);

  return (
    <div className="flow-builder">
      <div className="flow-header">
        <h1>Chatbot Flow Builder</h1>
        <button className="save-button" onClick={saveFlow}>Save Flow</button>
      </div>

      {/* Main Canvas + Side Panels */}
      <div className="flow-container">
        <ReactFlowProvider>
          {/* Canvas (Flow editor) */}
          <div className="reactflow-wrapper" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}   // Custom nodes go here
              fitView
            >
              <Controls />
              <Background variant="dots" gap={12} size={1} />
            </ReactFlow>
          </div>

          {/* Right-side panel: show Settings if node selected, else Node types */}
          <div className="panels-container">
            {selectedNode ? (
              <SettingsPanel
                selectedNode={selectedNode}
                updateNodeText={updateNodeText}
                clearSelection={clearSelection}
              />
            ) : (
              <NodesPanel onDragStart={onDragStart} />
            )}
          </div>
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default FlowBuilder;
