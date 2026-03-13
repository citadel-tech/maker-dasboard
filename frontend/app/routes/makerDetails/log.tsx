import { useState, useEffect, useRef } from "react";
import { monitoring, streamLogs } from "../../api";

interface Props {
  id: string;
}

export default function Logs({ id }: Props) {
  const [logs, setLogs] = useState<string[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [dataDir, setDataDir] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const initialLoadedRef = useRef(false);

  useEffect(() => {
    // Fetch data dir for log path hint
    monitoring
      .dataDir(id)
      .then(setDataDir)
      .catch(() => {});

    // Create a token to invalidate stale requests
    const requestToken = { isValid: true };
    const bufferedLines: string[] = [];

    // Start streaming first and buffer incoming lines
    const stop = streamLogs(id, (line) => {
      if (requestToken.isValid) {
        bufferedLines.push(line);
        if (initialLoadedRef.current) {
          setLogs((prev) => [...prev, line].slice(-100));
        }
      }
    });
    setStreaming(true);

    // Then fetch historical lines and merge with buffered lines
    monitoring
      .logs(id, 100)
      .then((initialLines) => {
        if (requestToken.isValid) {
          // Merge initial lines with buffered lines, capping at 100
          const merged = [...initialLines, ...bufferedLines].slice(-100);
          setLogs(merged);
          initialLoadedRef.current = true;
        }
      })
      .catch(() => {});

    return () => {
      // Invalidate token to prevent stale updates
      requestToken.isValid = false;
      stop();
      setStreaming(false);
    };
  }, [id]);

  // Auto-scroll to bottom on new lines
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const logPath = dataDir ? `${dataDir}/maker-${id}.log` : null;

  function copyPath() {
    if (!logPath) return;
    navigator.clipboard
      .writeText(logPath)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  }

  return (
    <div className="space-y-4">
      {/* Log file path */}

      {/* Log viewer */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold">Logs</h3>
            <span className="text-xs text-gray-500">last 100 lines</span>
          </div>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              streaming
                ? "bg-green-900 text-green-300"
                : "bg-gray-800 text-gray-400"
            }`}
          >
            {streaming ? "● Live" : "Static"}
          </span>
        </div>
        <div className="bg-black rounded-lg p-4 font-mono text-xs sm:text-sm space-y-0.5 max-h-[32rem] overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-gray-500">No logs yet…</div>
          ) : (
            logs.map((line, i) => (
              <div
                key={i}
                className="text-gray-300 leading-5 whitespace-pre-wrap break-all"
              >
                {line}
              </div>
            ))
          )}
          <div ref={logsEndRef} />
        </div>
      </div>

      {logPath && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs text-gray-500 mb-0.5">Log file</p>
            <p className="text-xs font-mono text-gray-300 truncate">
              {logPath}
            </p>
          </div>
          <button
            type="button"
            onClick={copyPath}
            className="shrink-0 text-xs px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-all"
          >
            {copied ? "Copied!" : "Copy path"}
          </button>
        </div>
      )}
    </div>
  );
}
