import { useEffect, useRef } from "react";

export interface LogEntry {
  text: string;
  type?: "system" | "success" | "warning" | "normal";
}

interface TerminalFeedbackProps {
  logs: LogEntry[];
}

export function TerminalFeedback({ logs }: TerminalFeedbackProps) {
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new logs are added
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="terminal-panel">
      <div className="terminal-header">
        <span className="terminal-dot" />
        <span className="terminal-title">Console Telemetria v1.0.7</span>
      </div>
      <div className="terminal-body" ref={terminalBodyRef}>
        {logs.map((log, index) => {
          if (!log) return null;
          return (
            <div className="terminal-log-line" key={index}>
              <span className="terminal-prompt">&gt;</span>
              <span className={`terminal-log-text ${log.type || "normal"}`}>
                {log.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
