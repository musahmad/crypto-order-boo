import React, { useCallback, useState } from "react";
import moment from "moment";
import { AgGridReact } from "ag-grid-react";
import { Box, Grid, Typography } from "@mui/material";
import { ColDef } from "ag-grid-community";
import { OrderBookData } from "../types";
import useWebSocket from "../hooks/useWebsocket";
import "./css/ag-grid-theme-builder.css";

interface OrderBookProps {
  selectedCoin: string;
  selectedExchange: string;
}

const OrderBook: React.FC<OrderBookProps> = ({
  selectedCoin,
  selectedExchange,
}) => {
  const [orderBook, setOrderBook] = useState<OrderBookData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const handleMessage = useCallback(
    (data: OrderBookData) => {
      if (data.coin === selectedCoin && data.exchange === selectedExchange) {
        setOrderBook(data);
        setLoading(false);
      }
    },
    [selectedCoin, selectedExchange],
  );

  useWebSocket("wss://mock.lo.tech:8443/ws/orderbook", handleMessage);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!orderBook) {
    return <p>No data available</p>;
  }

  const formatTimestamp = (timestamp: number) => {
    const date: moment.Moment = moment(timestamp * 1000);
    return date.format("HH.mm.ss.SSS");
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

  const bidsRowData = orderBook.bids.map((bid) => ({
    timestamp: formatTimestamp(orderBook.timestamp),
    price: bid[0],
    quantity: bid[1],
  }));

  const asksRowData = orderBook.asks.map((ask) => ({
    timestamp: formatTimestamp(orderBook.timestamp),
    price: ask[0],
    quantity: ask[1],
  }));

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
            className="ag-theme-alpine"
            style={{ height: 270, width: "100%" }}
          >
            <AgGridReact columnDefs={bidsColumnDefs} rowData={bidsRowData} />
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
            className="ag-theme-alpine"
            style={{ height: 270, width: "100%" }}
          >
            <AgGridReact columnDefs={asksColumnDefs} rowData={asksRowData} />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default OrderBook;
