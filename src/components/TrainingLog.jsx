import React from 'react';
import './TrainingLog.css';

const TrainingLog = ({ logs }) => {
  if (!logs || logs.length === 0) {
    return null;
  }

  const renderLogLine = (line) => {
    // Check if line contains step information
    if (line.includes("Step") && line.includes("loss")) {
      const stepMatch = line.match(/Step (\d+):/);
      const lossMatch = line.match(/'loss': ([\d.]+)/);
      const lrMatch = line.match(/'learning_rate': ([\d.]+)/);
      
      if (stepMatch && lossMatch) {
        return (
          <div className="log-step">
            <span className="step-number">Step {stepMatch[1]}</span>
            <span className="step-loss">Loss: {lossMatch[1]}</span>
            {lrMatch && <span className="step-lr">LR: {lrMatch[1]}</span>}
          </div>
        );
      }
    }

    // Check if line contains final results
    if (line.includes("=== KẾT QUẢ CUỐI CÙNG ===")) {
      return <div className="log-section-title">{line}</div>;
    }

    // Check if line contains training information
    if (line.includes("Train runtime") || 
        line.includes("Train samples per second") || 
        line.includes("Train steps per second") || 
        line.includes("Train loss")) {
      const [key, value] = line.split(": ");
      return (
        <div className="log-result">
          <span className="result-key">{key}</span>
          <span className="result-value">{value}</span>
        </div>
      );
    }

    // Regular log line
    return <div className="log-line">{line}</div>;
  };

  return (
    <div className="training-log-container">
      <div className="training-log-header">
        <h2>Training Log</h2>
        <div className="log-stats">
          <span>Total Steps: {logs.filter(line => line.includes("Step")).length}</span>
        </div>
      </div>
      <div className="training-log-content">
        {logs.map((line, index) => (
          <div key={index} className="log-entry">
            {renderLogLine(line)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingLog; 
