// ExchangeView.tsx
import React, { useEffect, useRef } from "react";
import { GridApi, ModuleRegistry } from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { SparklinesModule } from "@ag-grid-enterprise/sparklines";

import ViewOrderBookCellRenderer from "./ViewOrderBookCellRenderer";
import { OrderBookData } from "../types";
import "./css/ag-grid-exchange-theme.css";

ModuleRegistry.registerModules([SparklinesModule]);

interface ExchangeViewProps {
  selectedExchange: string;
  onCoinSelect: (coin: string) => void;
  data: OrderBookData | undefined;
}
const ExchangeView: React.FC<ExchangeViewProps> = ({
  selectedExchange,
  onCoinSelect,
  data,
}) => {
  const exchangeGridApiRef = useRef<GridApi | null>(null);
  useEffect(() => {
    if (exchangeGridApiRef.current) {
      exchangeGridApiRef.current.setGridOption("rowData", []);
    }
  }, [selectedExchange]);

  useEffect(() => {
    if (exchangeGridApiRef.current && data) {
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
  }, [data]);

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
      sort: "asc",
    },
    {
      headerName: "Bid Timeline",
      field: "bidTimeline",
      cellRenderer: "agSparklineCellRenderer",
    },
    { headerName: "Latest Bid", field: "latestBid", sortable: true },
    {
      headerName: "Highest Bid",
      field: "highestBid",
      enableCellChangeFlash: true,
      sortable: true,
    },
    {
      headerName: "Ask Timeline",
      field: "askTimeline",
      cellRenderer: "agSparklineCellRenderer",
    },
    { headerName: "Latest Ask", field: "latestAsk", sortable: true },
    {
      headerName: "Lowest Ask",
      field: "lowestAsk",
      enableCellChangeFlash: true,
      sortable: true,
    },
    {
      headerName: "Order Book",
      field: "coin",
      cellRenderer: ViewOrderBookCellRenderer,
      cellRendererParams: {
        onClick: onCoinSelect,
      },
    },
  ];

  return (
    <div style={{ marginTop: 20, marginBottom: 60 }}>
      <div className="ag-theme-exchange" style={{ height: 305, width: "100%" }}>
        <AgGridReact
          columnDefs={columnDefs}
          rowHeight={50}
          onGridReady={onExchangeGridReady}
          defaultColDef={{ flex: 1 }}
          getRowId={(params) => params.data.coin}
        />
      </div>
    </div>
  );
};

export default ExchangeView;
