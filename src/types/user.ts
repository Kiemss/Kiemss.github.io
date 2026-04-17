import { InventoryItem, HistoryRecord } from './item';

export interface UserSettings {
  soundEnabled: boolean;
  animationEnabled: boolean;
  initialBalance: number;
}

export interface Transaction {
  id: string;
  type: 'open_case' | 'sell_item' | 'loan' | 'reset' | 'deposit';
  amount: number;
  timestamp: Date;
  description: string;
  itemId?: string;
  caseId?: string;
}

export interface EconomyData {
  balance: number;
  initialBalance: number;
  totalSpent: number;
  totalEarned: number;
  profitLoss: number;
  loanAmount: number;
  transactions: Transaction[];
}

export interface UserData {
  balance: number;
  inventory: InventoryItem[];
  history: HistoryRecord[];
  settings: UserSettings;
  economy: EconomyData;
}

export interface AppStorage {
  admin: {
    cases: import('./case').Case[];
    lastModified: Date;
  };
  user: UserData;
}
