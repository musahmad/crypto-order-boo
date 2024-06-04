import React, { useCallback, useRef, useState } from "react";
import moment from "moment";
import { AgGridReact } from "ag-grid-react";
import { Box, Grid, Typography } from "@mui/material";
import { ColDef } from "ag-grid-community";
import { OrderBookData } from "../types";
import useWebSocket from "../hooks/useWebsocket";
import "./css/ag-grid-order-book-theme.css";
import { GridApi } from "ag-grid-enterprise";

interface OrderBookProps {
  selectedCoin: string;
  selectedExchange: string;
}

const OrderBook: React.FC<OrderBookProps> = ({
  selectedCoin,
  selectedExchange,
}) => {
  const [loading, setLoading] = useState<boolean>(true);

  const formatTimestamp = (timestamp: number) => {
    const date: moment.Moment = moment(timestamp * 1000);
    return date.format("HH.mm.ss.SSS");
  };

  const bidsGridApiRef = useRef<GridApi | null>(null);
  const asksGridApiRef = useRef<GridApi | null>(null);

  const handleMessage = useCallback(
    (data: OrderBookData) => {
      if (data.coin === selectedCoin && data.exchange === selectedExchange) {
        setLoading(false);

        const bidsRowData = data.bids.map((bid, idx) => ({
          index: idx,
          timestamp: formatTimestamp(data.timestamp),
          price: bid[0],
          quantity: bid[1],
        }));

        const asksRowData = data.asks.map((ask, idx) => ({
          index: idx,
          timestamp: formatTimestamp(data.timestamp),
          price: ask[0],
          quantity: ask[1],
        }));

        if (asksGridApiRef.current && bidsGridApiRef.current) {
          bidsGridApiRef.current.applyTransactionAsync({ update: bidsRowData });
          asksGridApiRef.current.applyTransactionAsync({ update: asksRowData });
        }
      }
    },
    [selectedCoin, selectedExchange],
  );

  useWebSocket("wss://mock.lo.tech:8443/ws/orderbook", handleMessage);

  if (loading) {
    return <p>Loading...</p>;
  }

  const onBidsGridReady = (params: any) => {
    bidsGridApiRef.current = params.api;
  };

  const onAsksGridReady = (params: any) => {
    asksGridApiRef.current = params.api;
  };

  const bidsColumnDefs: ColDef[] = [
    { headerName: "Price", field: "price" },
    { headerName: "Quantity", field: "quantity" },
    { headerName: "Time", field: "timestamp" },
  ];

  const asksColumnDefs: ColDef[] = [
    { headerName: "Price", field: "price" },
    { headerName: "Quantity", field: "quantity" },
    { headerName: "Time", field: "timestamp" },
  ];

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Box
            sx={{
              textAlign: "center",
              color: "#fff",
              backgroundColor: "#2f486f",
              borderRadius: 1,
              marginBlockEnd: 0.5,
            }}
          >
            <Typography
              variant="overline"
              fontSize={15}
              gutterBottom
              fontWeight={600}
            >
              Bids
            </Typography>
          </Box>

          <div
            className="ag-theme-order-book"
            style={{ height: 275, width: "100%" }}
          >
            <AgGridReact
              columnDefs={bidsColumnDefs}
              defaultColDef={{ flex: 1 }}
              onGridReady={onBidsGridReady}
              getRowId={(params) => params.data.index}
              rowData={Array.from({ length: 5 }, (_, i) => ({ index: i }))}
            />
          </div>
        </Grid>
        <Grid item xs={6}>
          <Box
            sx={{
              textAlign: "center",
              color: "#fff",
              backgroundColor: "#2f486f",
              borderRadius: 1,
              marginBlockEnd: 0.5,
            }}
          >
            <Typography
              variant="overline"
              fontSize={15}
              gutterBottom
              fontWeight={600}
            >
              Asks
            </Typography>
          </Box>

          <div
            className="ag-theme-order-book"
            style={{ height: 275, width: "100%" }}
          >
            <AgGridReact
              columnDefs={asksColumnDefs}
              defaultColDef={{ flex: 1 }}
              onGridReady={onAsksGridReady}
              getRowId={(params) => params.data.index}
              rowData={Array.from({ length: 5 }, (_, i) => ({ index: i }))}
            />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default OrderBook;
