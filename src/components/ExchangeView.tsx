// ExchangeView.tsx
import React, { useState, useCallback, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { SparklinesModule } from "@ag-grid-enterprise/sparklines";

import useWebSocket from "../hooks/useWebsocket";
import { OrderBookData } from "../types";
import { ModuleRegistry } from "ag-grid-enterprise";
import "./css/ag-grid-exchange-theme.css"

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

interface ExchangeViewProps {
  selectedExchange: string;
}
const ExchangeView: React.FC<ExchangeViewProps> = ({ selectedExchange }) => {
  const [coins, setCoins] = useState<Record<string, StockData>>({});

  useEffect(() => {
    setCoins({});
  }, [selectedExchange]);

  const handleMessage = useCallback(
    (data: OrderBookData) => {
      if (data.exchange !== selectedExchange) {
        return;
      }

      setCoins((prevCoins) => {
        const latestBidPrice = data.bids.length > 0 ? data.bids[0][0] : 0; // Latest highest bid price
        const highestBidPrice = Math.max(
          ...data.bids.map((bid) => bid[0]), // Extract bid prices and find the maximum
          prevCoins[data.coin]?.highestBid || 0, // Compare with previous highest price
        );
        const latestAskPrice =
          data.asks.length > 0 ? data.asks[0][0] : Infinity; // Latest highest bid price
        const lowestAskPrice = Math.min(
          ...data.asks.map((bid) => bid[0]), // Extract bid prices and find the maximum
          prevCoins[data.coin]?.lowestAsk || Infinity, // Compare with previous highest price
        );

        const coin = prevCoins[data.coin] || {
          coin: data.coin,
          latestBid: 0,
          highestBid: 0,
          bidTimeline: [],
          latestAsk: 0,
          lowestAsk: Infinity,
          askTimeline: [],
        };

        const updatedCoin = {
          ...coin,
          latestBid: latestBidPrice,
          highestBid: highestBidPrice,
          bidTimeline: [...coin.bidTimeline, latestBidPrice * 1000].slice(-20),
          latestAsk: latestAskPrice,
          lowestAsk: lowestAskPrice,
          askTimeline: [...coin.askTimeline, latestAskPrice * 1000].slice(-20),
        };

        return { ...prevCoins, [data.coin]: updatedCoin };
      });
    },
    [selectedExchange],
  );

  useWebSocket("wss://mock.lo.tech:8443/ws/orderbook", handleMessage);

  const columnDefs: ColDef[] = [
    {
      headerName: "Stock",
      field: "coin",
      cellStyle: {
        fontWeight: "bold",
        backgroundColor: "#2f486f",
        color: "#fff",
      },
      },
    {
      headerName: "Bid Timeline",
      field: "bidTimeline",
      cellRenderer: "agSparklineCellRenderer",
      cellRendererParams: {
        sparklineOptions: {},
      },
    },
    { headerName: "Latest Bid", field: "latestBid", },
    { headerName: "Highest Bid", field: "highestBid", },
    {
      headerName: "Ask Timeline",
      field: "askTimeline",
      cellRenderer: "agSparklineCellRenderer",
      // cellRendererParams: {
        //   sparklineOptions: {
          //     type: "column",
          //     bar: {
            //       fill: "#ff4b4b",
            //       stroke: "#ff4b4b",
            //     },
            //   },
            // },
          },
          { headerName: "Latest Ask", field: "latestAsk", },
          { headerName: "Lowest Ask", field: "lowestAsk", },
  ];

  const rowData = Object.values(coins);

  return (
    <div style={{ marginTop: 20, marginBottom: 20 }}>
      <div className="ag-theme-exchange" style={{ height: 318, width: "100%" }}>
        <AgGridReact columnDefs={columnDefs} rowData={rowData} defaultColDef={{ flex: 1}}/>
      </div>
    </div>
  );
};

export default ExchangeView;
