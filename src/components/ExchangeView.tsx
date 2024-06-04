// ExchangeView.tsx
import React, { useState, useCallback, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { SparklinesModule } from "@ag-grid-enterprise/sparklines";

import useWebSocket from "../hooks/useWebsocket";
import { OrderBookData } from "../types";
import { GridApi, ModuleRegistry } from "ag-grid-enterprise";
import "./css/ag-grid-exchange-theme.css";

ModuleRegistry.registerModules([SparklinesModule]);

interface ExchangeViewProps {
  selectedExchange: string;
}
const ExchangeView: React.FC<ExchangeViewProps> = ({ selectedExchange }) => {
  const exchangeGridApiRef = useRef<GridApi | null>(null);

  const handleMessage = useCallback(
    (data: OrderBookData) => {
      if (data.exchange !== selectedExchange) {
        return;
      }

      if (exchangeGridApiRef.current) {
        const currentRow = exchangeGridApiRef.current.getRowNode(data.coin);

        const newRow = {
          coin: data.coin,
          latestBid: data.bids[0][0],
          latestAsk: data.asks[0][0],
          highestBid: Math.max(
            currentRow?.data.highestBid || 0,
            ...data.bids.map((bid) => bid[0]),
          ),
          lowestAsk: Math.min(
            currentRow?.data.lowestAsk || Infinity,
            ...data.asks.map((ask) => ask[0]),
          ),
          bidTimeline: [
            ...(currentRow?.data.bidTimeline || []),
            data.bids[0][0],
          ].slice(-50),
          askTimeline: [
            ...(currentRow?.data.askTimeline || []),
            data.asks[0][0],
          ].slice(-50),
        };

        if (currentRow) {
          exchangeGridApiRef.current.applyTransactionAsync({
            update: [newRow],
          });
        } else {
          exchangeGridApiRef.current.applyTransaction({ add: [newRow] });
        }
      }
    },
    [selectedExchange],
  );

  useWebSocket("wss://mock.lo.tech:8443/ws/orderbook", handleMessage);

  const onExchangeGridReady = (params: any) => {
    exchangeGridApiRef.current = params.api;
  };

  const columnDefs: ColDef[] = [
    {
      headerName: "Coin",
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
    },
    { headerName: "Latest Bid", field: "latestBid" },
    { headerName: "Highest Bid", field: "highestBid" },
    {
      headerName: "Ask Timeline",
      field: "askTimeline",
      cellRenderer: "agSparklineCellRenderer",
    },
    { headerName: "Latest Ask", field: "latestAsk" },
    { headerName: "Lowest Ask", field: "lowestAsk" },
  ];

  return (
    <div style={{ marginTop: 20, marginBottom: 20 }}>
      <div className="ag-theme-exchange" style={{ height: 275, width: "100%" }}>
        <AgGridReact
          columnDefs={columnDefs}
          onGridReady={onExchangeGridReady}
          defaultColDef={{ flex: 1 }}
          getRowId={(params) => params.data.coin}
        />
      </div>
    </div>
  );
};

export default ExchangeView;
