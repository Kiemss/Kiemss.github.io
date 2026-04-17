import type { Case } from '@/types/case';
import type { CaseItem } from '@/types/item';
import { StorageManager } from './storage-manager';

export class AdminManager {
  private storage: StorageManager;

  constructor() {
    this.storage = StorageManager.getInstance();
  }

  generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  createCase(name: string, price: number, keyPrice: number, image: string): Case {
    return {
      id: this.generateId(),
      name,
      price,
      keyPrice,
      image,
      items: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  createItem(
    name: string,
    type: CaseItem['type'],
    image: string,
    inspectImage: string,
    rarity: CaseItem['rarity'],
    probability: number,
    price: number,
    collection?: string
  ): CaseItem {
    return {
      id: this.generateId(),
      name,
      type,
      image,
      inspectImage,
      rarity,
      probability,
      price,
      collection
    };
  }

  validateProbabilities(items: CaseItem[]): boolean {
    const total = items.reduce((sum, item) => sum + item.probability, 0);
    return Math.abs(total - 100) < 0.01;
  }

  addCase(caseItem: Case): void {
    this.storage.addCase(caseItem);
  }

  updateCase(id: string, caseItem: Case): void {
    this.storage.updateCase(id, caseItem);
  }

  deleteCase(id: string): void {
    this.storage.deleteCase(id);
  }

  getCases(): Case[] {
    return this.storage.getCases();
  }

  addItemToCase(caseId: string, item: CaseItem): boolean {
    const cases = this.storage.getCases();
    const caseIndex = cases.findIndex(c => c.id === caseId);
    
    if (caseIndex === -1) return false;

    cases[caseIndex].items.push(item);
    cases[caseIndex].updatedAt = new Date();
    this.storage.setCases(cases);
    return true;
  }

  updateItemInCase(caseId: string, itemId: string, item: CaseItem): boolean {
    const cases = this.storage.getCases();
    const caseIndex = cases.findIndex(c => c.id === caseId);
    
    if (caseIndex === -1) return false;

    const itemIndex = cases[caseIndex].items.findIndex(i => i.id === itemId);
    if (itemIndex === -1) return false;

    cases[caseIndex].items[itemIndex] = item;
    cases[caseIndex].updatedAt = new Date();
    this.storage.setCases(cases);
    return true;
  }

  deleteItemFromCase(caseId: string, itemId: string): boolean {
    const cases = this.storage.getCases();
    const caseIndex = cases.findIndex(c => c.id === caseId);
    
    if (caseIndex === -1) return false;

    cases[caseIndex].items = cases[caseIndex].items.filter(i => i.id !== itemId);
    cases[caseIndex].updatedAt = new Date();
    this.storage.setCases(cases);
    return true;
  }

  exportConfig(): string {
    const config = this.storage.exportConfig();
    return JSON.stringify(config, null, 2);
  }

  importConfig(jsonString: string): boolean {
    try {
      const config = JSON.parse(jsonString);
      this.storage.importConfig(config);
      return true;
    } catch (error) {
      console.error('Failed to import config:', error);
      return false;
    }
  }

  resetToDefault(): void {
    this.storage.resetToDefault();
  }

  imageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
