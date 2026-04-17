import { StorageManager } from './storage-manager';
import type { InventoryItem, HistoryRecord } from '@/types/item';
import type { Transaction } from '@/types/user';

export class EconomySystem {
  private storage: StorageManager;

  constructor() {
    this.storage = StorageManager.getInstance();
  }

  getBalance(): number {
    return this.storage.getUserData().balance;
  }

  canAfford(amount: number): boolean {
    return this.storage.getUserData().balance >= amount;
  }

  spend(amount: number, description: string, caseId?: string): boolean {
    const userData = this.storage.getUserData();
    
    userData.balance -= amount;
    userData.economy.balance = userData.balance;
    userData.economy.totalSpent += amount;
    userData.economy.profitLoss = userData.economy.totalEarned - userData.economy.totalSpent;
    
    const transaction: Transaction = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'open_case',
      amount: -amount,
      timestamp: new Date(),
      description,
      caseId
    };
    
    userData.economy.transactions.push(transaction);
    
    this.storage.updateBalance(userData.balance);
    this.storage.updateEconomy(userData.economy);
    
    return true;
  }

  earn(amount: number, description: string, itemId?: string): void {
    const userData = this.storage.getUserData();
    
    userData.balance += amount;
    userData.economy.balance = userData.balance;
    userData.economy.totalEarned += amount;
    userData.economy.profitLoss = userData.economy.totalEarned - userData.economy.totalSpent;
    
    const transaction: Transaction = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'sell_item',
      amount,
      timestamp: new Date(),
      description,
      itemId
    };
    
    userData.economy.transactions.push(transaction);
    
    this.storage.updateBalance(userData.balance);
    this.storage.updateEconomy(userData.economy);
  }

  loan(amount: number): void {
    const userData = this.storage.getUserData();
    
    userData.balance += amount;
    userData.economy.balance = userData.balance;
    userData.economy.loanAmount += amount;
    
    const transaction: Transaction = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'loan',
      amount,
      timestamp: new Date(),
      description: `借贷 $${amount.toFixed(2)}`
    };
    
    userData.economy.transactions.push(transaction);
    
    this.storage.updateBalance(userData.balance);
    this.storage.updateEconomy(userData.economy);
  }

  reset(): void {
    const userData = this.storage.getUserData();
    const initialBalance = userData.settings.initialBalance;
    
    userData.balance = initialBalance;
    userData.economy = {
      balance: initialBalance,
      initialBalance,
      totalSpent: 0,
      totalEarned: 0,
      profitLoss: 0,
      loanAmount: 0,
      transactions: []
    };
    
    const transaction: Transaction = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'reset',
      amount: 0,
      timestamp: new Date(),
      description: '余额重置'
    };
    
    userData.economy.transactions.push(transaction);
    
    this.storage.updateBalance(userData.balance);
    this.storage.updateEconomy(userData.economy);
  }

  addToInventory(item: InventoryItem): void {
    this.storage.addToInventory(item);
  }

  addHistory(record: HistoryRecord): void {
    this.storage.addHistory(record);
  }

  getProfitLoss(): number {
    return this.storage.getUserData().economy.profitLoss;
  }

  getTransactions(): Transaction[] {
    return this.storage.getUserData().economy.transactions;
  }
}
