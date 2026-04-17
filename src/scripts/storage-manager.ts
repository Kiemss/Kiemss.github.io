import type { Case, CaseConfig } from '@/types/case';
import type { AppStorage, UserData, UserSettings, EconomyData } from '@/types/user';
import type { InventoryItem, HistoryRecord } from '@/types/item';
import defaultCases from '@/data/default-cases.json';

const STORAGE_KEY = 'cs2_lottery_data';

export class StorageManager {
  private static instance: StorageManager;
  private data: AppStorage;

  private constructor() {
    this.data = this.loadFromStorage();
  }

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  private loadFromStorage(): AppStorage {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load from storage:', error);
    }

    return this.getDefaultData();
  }

  private getDefaultData(): AppStorage {
    return {
      admin: {
        cases: defaultCases.cases as Case[],
        lastModified: new Date()
      },
      user: {
        balance: 100,
        inventory: [],
        history: [],
        settings: {
          soundEnabled: true,
          animationEnabled: true,
          initialBalance: 100
        },
        economy: {
          balance: 100,
          initialBalance: 100,
          totalSpent: 0,
          totalEarned: 0,
          profitLoss: 0,
          loanAmount: 0,
          transactions: []
        }
      }
    };
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (error) {
      console.error('Failed to save to storage:', error);
    }
  }

  getCases(): Case[] {
    return this.data.admin.cases;
  }

  setCases(cases: Case[]): void {
    this.data.admin.cases = cases;
    this.data.admin.lastModified = new Date();
    this.saveToStorage();
  }

  addCase(caseItem: Case): void {
    this.data.admin.cases.push(caseItem);
    this.data.admin.lastModified = new Date();
    this.saveToStorage();
  }

  updateCase(id: string, caseItem: Case): void {
    const index = this.data.admin.cases.findIndex(c => c.id === id);
    if (index !== -1) {
      this.data.admin.cases[index] = caseItem;
      this.data.admin.lastModified = new Date();
      this.saveToStorage();
    }
  }

  deleteCase(id: string): void {
    this.data.admin.cases = this.data.admin.cases.filter(c => c.id !== id);
    this.data.admin.lastModified = new Date();
    this.saveToStorage();
  }

  getUserData(): UserData {
    return this.data.user;
  }

  updateBalance(amount: number): void {
    this.data.user.balance = amount;
    this.data.user.economy.balance = amount;
    this.saveToStorage();
  }

  addToInventory(item: InventoryItem): void {
    this.data.user.inventory.push(item);
    this.saveToStorage();
  }

  addHistory(record: HistoryRecord): void {
    this.data.user.history.push(record);
    this.saveToStorage();
  }

  updateSettings(settings: Partial<UserSettings>): void {
    this.data.user.settings = { ...this.data.user.settings, ...settings };
    this.saveToStorage();
  }

  updateEconomy(economy: Partial<EconomyData>): void {
    this.data.user.economy = { ...this.data.user.economy, ...economy };
    this.saveToStorage();
  }

  exportConfig(): CaseConfig {
    return {
      cases: this.data.admin.cases,
      version: '1.0.0',
      lastModified: this.data.admin.lastModified
    };
  }

  importConfig(config: CaseConfig): void {
    this.data.admin.cases = config.cases;
    this.data.admin.lastModified = config.lastModified;
    this.saveToStorage();
  }

  resetToDefault(): void {
    this.data = this.getDefaultData();
    this.saveToStorage();
  }

  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.data = this.getDefaultData();
  }
}
