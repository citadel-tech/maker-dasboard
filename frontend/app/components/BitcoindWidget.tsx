import { useEffect, useState } from "react";
import { bitcoind, type BitcoindStatusInfo } from "../api.ts";

export default function BitcoindWidget() {
  const [status, setStatus] = useState<BitcoindStatusInfo>({
    running: false,
    managed: false,
  });
  const [network, setNetwork] = useState<"regtest" | "signet">("regtest");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchStatus() {
    try {
      const s = await bitcoind.status();
      setStatus(s);
    } catch {
      // silently ignore poll failures
    }
  }

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5_000);
    return () => clearInterval(interval);
  }, []);

  async function toggle() {
    setPending(true);
    setError(null);
    try {
      if (status.running) {
        const s = await bitcoind.stop();
        setStatus(s);
      } else {
        const s = await bitcoind.start({ network });
        setStatus(s);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {error && (
        <span className="text-xs text-red-400 max-w-48 truncate" title={error}>
          {error}
        </span>
      )}

      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-lg">
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${
            status.running
              ? "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)] animate-pulse"
              : "bg-gray-600"
          }`}
        />
        <span className="text-xs text-gray-400">
          {status.running ? (status.network ?? "running") : "bitcoind"}
        </span>
      </div>

      {!status.running && (
        <select
          value={network}
          onChange={(e) => setNetwork(e.target.value as "regtest" | "signet")}
          disabled={pending}
          className="px-2 py-1.5 bg-gray-900 border border-gray-800 rounded-lg text-xs text-gray-300 focus:outline-none focus:border-orange-500 disabled:opacity-50"
        >
          <option value="regtest">regtest</option>
          <option value="signet">signet</option>
        </select>
      )}

      {(!status.running || status.managed) && (
        <button
          disabled={pending}
          onClick={toggle}
          className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-150 active:scale-[0.97] ${
            pending
              ? "border-gray-700 text-gray-600 cursor-not-allowed"
              : status.running
                ? "border-red-800 text-red-400 hover:bg-red-900/30"
                : "border-orange-800 text-orange-400 hover:bg-orange-900/20"
          }`}
        >
          {pending ? "…" : status.running ? "Stop" : "Start"}
        </button>
      )}
    </div>
  );
}
