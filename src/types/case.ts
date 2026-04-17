import { CaseItem } from './item';

export interface Case {
  id: string;
  name: string;
  image: string;
  price: number;
  keyPrice: number;
  items: CaseItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CaseConfig {
  cases: Case[];
  version: string;
  lastModified: Date;
}
