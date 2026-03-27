import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  /** Primary message, e.g. "Loading maker data" */
  message: string;
  /** Optional secondary detail, e.g. "Fetching wallet balance…" */
  detail?: string;
  /** Show as full-page centered (default) or inline */
  inline?: boolean;
}

export default function LoadingState({
  message,
  detail,
  inline,
}: LoadingStateProps) {
  const content = (
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
      <div className="text-center">
        <p className="text-gray-300 text-sm font-medium">{message}</p>
        {detail && (
          <p className="text-gray-500 text-xs mt-1 animate-pulse">{detail}</p>
        )}
      </div>
    </div>
  );

  if (inline) return content;

  return <div className="flex items-center justify-center h-64">{content}</div>;
}
