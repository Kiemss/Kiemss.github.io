export enum Rarity {
  Consumer = 'consumer',
  Industrial = 'industrial',
  MilSpec = 'mil_spec',
  Restricted = 'restricted',
  Classified = 'classified',
  Covert = 'covert',
  Special = 'special'
}

export const RarityColors: Record<Rarity, string> = {
  [Rarity.Consumer]: '#b0c3d9',
  [Rarity.Industrial]: '#5e98d9',
  [Rarity.MilSpec]: '#4b69ff',
  [Rarity.Restricted]: '#8847ff',
  [Rarity.Classified]: '#d32ce6',
  [Rarity.Covert]: '#eb4b4b',
  [Rarity.Special]: '#e4ae39'
};

export const RarityNames: Record<Rarity, string> = {
  [Rarity.Consumer]: '消费级',
  [Rarity.Industrial]: '工业级',
  [Rarity.MilSpec]: '军规级',
  [Rarity.Restricted]: '受限',
  [Rarity.Classified]: '保密',
  [Rarity.Covert]: '隐秘',
  [Rarity.Special]: '特殊物品'
};

export const RarityOrder: Rarity[] = [
  Rarity.Consumer,
  Rarity.Industrial,
  Rarity.MilSpec,
  Rarity.Restricted,
  Rarity.Classified,
  Rarity.Covert,
  Rarity.Special
];
