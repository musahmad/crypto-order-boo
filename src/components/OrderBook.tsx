import React, { useEffect, useRef } from "react";
import moment from "moment";
import { AgGridReact } from "ag-grid-react";
import { Box, Grid, Typography } from "@mui/material";
import { ColDef } from "ag-grid-community";
import { OrderBookData } from "../types";
import "./css/ag-grid-order-book-theme.css";
import { GridApi } from "ag-grid-enterprise";

interface OrderBookProps {
  selectedCoin: string;
  data: OrderBookData | undefined;
}

const OrderBook: React.FC<OrderBookProps> = ({
  selectedCoin,
  data,
}) => {
  const formatTimestamp = (timestamp: number) => {
    const date: moment.Moment = moment(timestamp * 1000);
    return date.format("HH.mm.ss.SSS");
  };

  const bidsGridApiRef = useRef<GridApi | null>(null);
  const asksGridApiRef = useRef<GridApi | null>(null);

  useEffect(() => {
    if (data && data.coin === selectedCoin) {
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
        const isPopulated = asksGridApiRef.current.getRowNode("0");
        if (isPopulated) {
          bidsGridApiRef.current.applyTransactionAsync({ update: bidsRowData });
          asksGridApiRef.current.applyTransactionAsync({ update: asksRowData });
        } else {
          bidsGridApiRef.current.applyTransaction({ add: bidsRowData });
          asksGridApiRef.current.applyTransaction({ add: asksRowData });
        }
      }
    }
  }, [data, selectedCoin]);

  const onBidsGridReady = (params: any) => {
    bidsGridApiRef.current = params.api;
  };

  const onAsksGridReady = (params: any) => {
    asksGridApiRef.current = params.api;
  };

  const columnDefs: ColDef[] = [
    { headerName: "Price", field: "price" },
    { headerName: "Quantity", field: "quantity" },
    { headerName: "Time", field: "timestamp" },
  ];

  return (
    <div style={{ paddingLeft: 80, paddingRight: 80 }}>
      <Box
        sx={{
          textAlign: "center",
          color: "#fff",
          backgroundColor: "#2f486f",
          borderRadius: 2,
          marginBlockEnd: 0.5,
        }}
      >
        <Typography
          variant="overline"
          fontSize={15}
          gutterBottom
          fontWeight={600}
        >
          {selectedCoin}
        </Typography>
      </Box>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Box
            sx={{
              textAlign: "center",
              color: "#fff",
              backgroundColor: "#1d2632",
              borderRadius: 2,
              marginBlockEnd: 0.5,
            }}
          >
            <Typography fontSize={15} fontWeight={600}>
              Bids
            </Typography>
          </Box>

          <div
            className="ag-theme-order-book"
            style={{ height: 185, width: "100%" }}
          >
            <AgGridReact
              columnDefs={columnDefs}
              headerHeight={30}
              rowHeight={30}
              defaultColDef={{ flex: 1 }}
              onGridReady={onBidsGridReady}
              getRowId={(params) => params.data.index}
            />
          </div>
        </Grid>
        <Grid item xs={6}>
          <Box
            sx={{
              textAlign: "center",
              color: "#fff",
              backgroundColor: "#1d2632",
              borderRadius: 2,
              marginBlockEnd: 0.5,
            }}
          >
            <Typography fontSize={15} fontWeight={600}>
              Asks
            </Typography>
          </Box>

          <div
            className="ag-theme-order-book"
            style={{ height: 185, width: "100%" }}
          >
            <AgGridReact
              columnDefs={columnDefs}
              headerHeight={30}
              rowHeight={30}
              defaultColDef={{ flex: 1 }}
              onGridReady={onAsksGridReady}
              getRowId={(params) => params.data.index}
            />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default OrderBook;
