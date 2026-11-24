import type { GatheringBox, IndividualTray } from './data/store';

export type StoreItem = GatheringBox | IndividualTray;

export interface CartLine {
  key: string;
  productId: string;
  seasoning: string;
  qty: number;
}
