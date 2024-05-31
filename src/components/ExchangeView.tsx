// ExchangeView.tsx
import React, { useState, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ColDef } from 'ag-grid-community';
import { SparklinesModule } from "@ag-grid-enterprise/sparklines";


import useWebSocket from '../hooks/useWebsocket';
import { OrderBookData } from '../types';
import { ModuleRegistry } from 'ag-grid-enterprise';

ModuleRegistry.registerModules([SparklinesModule]);


interface StockData {
  coin: string;
  latestBid: number;
  highestBid: number;
  bidTimeline: number[];
  latestAsk: number;
  lowestAsk: number;
  askTimeline: number[];
}

const ExchangeView: React.FC = () => {
  const [coins, setCoins] = useState<Record<string, StockData>>({});

  const handleMessage = useCallback((data: OrderBookData) => {
    setCoins((prevCoins) => {
      const latestBidPrice = data.bids.length > 0 ? data.bids[0][0] : 0; // Latest highest bid price
      const highestBidPrice = Math.max(
        ...data.bids.map((bid) => bid[0]), // Extract bid prices and find the maximum
        prevCoins[data.coin]?.highestBid || 0 // Compare with previous highest price
      );
      const latestAskPrice = data.asks.length > 0 ? data.asks[0][0] : Infinity; // Latest highest bid price
      const lowestAskPrice = Math.min(
        ...data.asks.map((bid) => bid[0]), // Extract bid prices and find the maximum
        prevCoins[data.coin]?.lowestAsk || Infinity // Compare with previous highest price
      );
      
      const coin = prevCoins[data.coin] || { coin: data.coin, latestBid: 0, highestBid: 0, bidTimeline: [], latestAsk: 0, lowestAsk: 0, askTimeline: [] };
      
      const updatedCoin = {
        ...coin,
        latestBid: latestBidPrice,
        highestBid: highestBidPrice,
        bidTimeline: [...coin.bidTimeline, latestBidPrice].slice(-20),
        latestAsk: latestAskPrice,
        lowestBid: lowestAskPrice,
        askTimeline: [...coin.askTimeline, latestAskPrice].slice(-20), 
      };
    
      return { ...prevCoins, [data.coin]: updatedCoin };
    });
  }, []);
  

  useWebSocket('wss://mock.lo.tech:8443/ws/orderbook', handleMessage);

  const columnDefs: ColDef[] = [
    { headerName: 'Stock', field: 'coin' },
    { headerName: 'Latest Bid', field: 'latestBid' },
    { headerName: 'Latest Ask', field: 'latestAsk' },
    { headerName: 'Highest Bid', field: 'highestBid' },
    { headerName: 'Lowest Ask', field: 'lowestAsk' },
    {
      headerName: 'Bid Timeline',
      field: 'bidTimeline',
      cellRenderer: 'agSparklineCellRenderer',
      cellRendererParams: {
        sparklineOptions: {
          type: 'column',
          bar: {
            fill: '#ff4b4b',
            stroke: '#ff4b4b',
          },
        },
      },
    },
    {
      headerName: 'Ask Timeline',
      field: 'askTimeline',
      cellRenderer: 'agSparklineCellRenderer',
      cellRendererParams: {
        sparklineOptions: {
          type: 'column',
          bar: {
            fill: '#ff4b4b',
            stroke: '#ff4b4b',
          },
        },
      },
    },
  ];

  const rowData = Object.values(coins);

  return (
    <div style={{ marginTop: 20, marginBottom: 20 }}>
      <div className="ag-theme-alpine" style={{ height: 300, width: '100%' }}>
        <AgGridReact columnDefs={columnDefs} rowData={rowData} />
      </div>
    </div>
  );
};

export default ExchangeView;
