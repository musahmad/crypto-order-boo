import React, { useState } from "react";
import { Container } from "@mui/material";
import CoinSelector from "./components/CoinSelector";
import OrderBook from "./components/OrderBook";
import { SelectChangeEvent } from "@mui/material/Select";
import ExchangeView from "./components/ExchangeView";

const coins = ["BTC/USD", "ETH/USD", "LTC/USD", "XRP/USD", "DOGE/USD"];
const exchanges = ["ExchangeX", "ExchangeY"];

function App() {
  const [selectedCoin, setSelectedCoin] = useState<string>(coins[0]);
  const [selectedExchange, setSelectedExchange] = useState<string>(
    exchanges[0],
  );

  const handleCoinChange = (event: SelectChangeEvent<string>) => {
    setSelectedCoin(event.target.value);
  };

  const handleExchangeChange = (event: SelectChangeEvent<string>) => {
    setSelectedExchange(event.target.value);
  };

  return (
    <Container>
      <h1>Crypto Order Book</h1>
      <CoinSelector
        selectedCoin={selectedCoin}
        selectedExchange={selectedExchange}
        onCoinChange={handleCoinChange}
        onExchangeChange={handleExchangeChange}
        coins={coins}
        exchanges={exchanges}
      />
      <ExchangeView selectedExchange={selectedExchange} />
      <OrderBook
        selectedCoin={selectedCoin}
        selectedExchange={selectedExchange}
      />
    </Container>
  );
}

export default App;
