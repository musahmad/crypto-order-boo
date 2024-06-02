export type Order = [number, number];

export interface OrderBookData {
  timestamp: number;
  exchange: string;
  coin: string;
  bids: Order[];
  asks: Order[];
}
