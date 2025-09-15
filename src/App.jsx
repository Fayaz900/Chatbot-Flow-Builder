import React from "react";
import FlowBuilder from "./components/FlowBuilder/FlowBuilder";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  return (
    <div className="App">
      <FlowBuilder />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

export default App;
