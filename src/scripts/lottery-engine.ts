import type { CaseItem } from '@/types/item';
import { Rarity, RarityColors, RarityNames } from '@/types/rarity';

export class LotteryEngine {
  draw(items: CaseItem[]): CaseItem {
    const random = Math.random() * 100;
    let cumulative = 0;
    
    for (const item of items) {
      cumulative += item.probability;
      if (random <= cumulative) {
        return item;
      }
    }
    
    return items[items.length - 1];
  }

  validateProbabilities(items: CaseItem[]): boolean {
    const total = items.reduce((sum, item) => sum + item.probability, 0);
    return Math.abs(total - 100) < 0.01;
  }

  generateWheelItems(items: CaseItem[], count: number = 50): CaseItem[] {
    const wheelItems: CaseItem[] = [];
    
    for (let i = 0; i < count; i++) {
      wheelItems.push(this.draw(items));
    }
    
    const winningIndex = Math.floor(count / 2);
    wheelItems[winningIndex] = this.draw(items);
    
    return wheelItems;
  }

  getRarityColor(rarity: Rarity): string {
    return RarityColors[rarity];
  }

  getRarityName(rarity: Rarity): string {
    return RarityNames[rarity];
  }

  calculateWinProbability(items: CaseItem[], minPrice: number): number {
    const valuableItems = items.filter(item => item.price >= minPrice);
    return valuableItems.reduce((sum, item) => sum + item.probability, 0);
  }

  calculateExpectedValue(items: CaseItem[]): number {
    return items.reduce((sum, item) => sum + (item.price * item.probability / 100), 0);
  }
}
