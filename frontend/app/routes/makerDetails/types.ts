import type { MakerInfoDetailed, BalanceInfo, MakerStatus } from "../../api";

export type Tab = "dashboard" | "wallet" | "swaps" | "logs" | "settings";

export interface MakerCoreData {
  id: string;
  info: MakerInfoDetailed | null;
  status: MakerStatus | null;
  balances: BalanceInfo | null;
  torAddress: string | null;
  dataDir: string | null;
  loading: boolean;
  isRunning: boolean;
}

export function btcUsd(btc: string): string {
  return `$${(parseFloat(btc) * 95000).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}`;
}
