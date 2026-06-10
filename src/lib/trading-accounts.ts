export type TradingAccount = {
  accountId: string;
  login: string | number;
  password: string;
  server: string;
  platform: "mt4" | "mt5";
  planId: string;
  name: string;
  createdAt: string;
};

const KEY = (userId: string) => `fp_accounts_${userId}`;

export function getAccounts(userId: string): TradingAccount[] {
  try {
    const raw = localStorage.getItem(KEY(userId));
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveAccount(userId: string, account: TradingAccount) {
  const existing = getAccounts(userId);
  const updated = [account, ...existing.filter(a => a.accountId !== account.accountId)];
  localStorage.setItem(KEY(userId), JSON.stringify(updated));
}

export function removeAccount(userId: string, accountId: string) {
  const existing = getAccounts(userId);
  localStorage.setItem(KEY(userId), JSON.stringify(existing.filter(a => a.accountId !== accountId)));
}
