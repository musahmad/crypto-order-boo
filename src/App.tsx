import React, { useEffect, useState } from "react";
import { Container } from "@mui/material";
import ExchangeSelector from "./components/ExchangeSelector";
import OrderBook from "./components/OrderBook";
import ExchangeView from "./components/ExchangeView";
import { OrderBookData } from "./types";

const exchanges = ["ExchangeX", "ExchangeY"];

function App() {
  const [selectedCoin, setSelectedCoin] = useState<string>();
  const [selectedExchange, setSelectedExchange] = useState<string>(
    exchanges[0],
  );

  const [orderBook, setOrderBook] = useState<OrderBookData>();

  useEffect(() => {
    const ws = new WebSocket("wss://mock.lo.tech:8443/ws/orderbook");
    
    ws.onopen = () => {
      console.log("Connected to WebSocket");
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.exchange === selectedExchange) {
        setOrderBook(data);
      }
    };
    
    ws.onclose = () => {
      console.log("Disconnected from WebSocket");
      setSelectedCoin(undefined);
    };
    
    return () => {
      ws.close();
    };
  }, [selectedExchange]);
  
  return (
    <Container>
      <div
        style={{ display: "flex", justifyContent: "center" }}
      >
        <img src="/logo.png" width={150} alt="logo" />
      </div>
      <ExchangeSelector
        selectedExchange={selectedExchange}
        setExchange={setSelectedExchange}
        exchanges={exchanges}
      />
      <ExchangeView
        selectedExchange={selectedExchange}
        onCoinSelect={setSelectedCoin}
        data={orderBook}
      />
      {selectedCoin && (
        <OrderBook
          selectedCoin={selectedCoin}
          data={orderBook}
        />
      )}
    </Container>
  );
}

export default App;
