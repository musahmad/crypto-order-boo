import React, { useEffect, useState } from 'react';
import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { OrderBookData } from '../types';
import moment from 'moment';

interface OrderBookProps {
  selectedCoin: string;
  selectedExchange: string;
}

const OrderBook: React.FC<OrderBookProps> = ({ selectedCoin, selectedExchange }) => {
  const [orderBook, setOrderBook] = useState<OrderBookData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log('Effect triggered with coin:', selectedCoin, 'and exchange:', selectedExchange);
    const ws = new WebSocket('wss://mock.lo.tech:8443/ws/orderbook');

    ws.onopen = () => {
      console.log('Connected to WebSocket');
    };

    ws.onmessage = (event) => {
      const data: OrderBookData = JSON.parse(event.data);
      if (data.coin === selectedCoin && data.exchange === selectedExchange) {
        setOrderBook(data);
        setLoading(false);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket');
    };

    return () => {
      ws.close();
    };
  }, [selectedCoin, selectedExchange]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!orderBook) {
    return <p>No data available</p>;
  }

  const formatTimestamp = (timestamp: number) => {
    const date: moment.Moment = moment(timestamp * 1000);
    return date.format("HH.mm.ss.SSS")
  }

  return (
    <div>
      <h2>Order Book for {selectedCoin} on {selectedExchange}</h2>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <h3>Bids</h3>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Price</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderBook.bids.map((bid, index) => (
                  <TableRow key={index}>
                    <TableCell>{bid[0]}</TableCell>
                    <TableCell>{bid[1]}</TableCell>
                    <TableCell>{formatTimestamp(orderBook.timestamp)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={6}>
          <h3>Asks</h3>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Price</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderBook.asks.map((ask, index) => (
                  <TableRow key={index}>
                    <TableCell>{ask[0]}</TableCell>
                    <TableCell>{ask[1]}</TableCell>
                    <TableCell>{formatTimestamp(orderBook.timestamp)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </div>
  );
};

export default OrderBook;
