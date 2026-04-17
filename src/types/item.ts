import { Rarity } from './rarity';

export type ItemType = 'weapon' | 'knife' | 'gloves' | 'other';

export interface CaseItem {
  id: string;
  name: string;
  type: ItemType;
  image: string;
  inspectImage: string;
  rarity: Rarity;
  probability: number;
  price: number;
  collection?: string;
}

export interface InventoryItem extends CaseItem {
  obtainedAt: Date;
  caseId: string;
  caseName: string;
}

export interface HistoryRecord {
  id: string;
  caseId: string;
  caseName: string;
  item: CaseItem;
  timestamp: Date;
}
