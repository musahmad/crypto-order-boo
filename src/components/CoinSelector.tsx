import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

interface CoinSelectorProps {
  selectedCoin: string;
  selectedExchange: string;
  onCoinChange: (event: SelectChangeEvent<string>) => void;
  onExchangeChange: (event: SelectChangeEvent<string>) => void;
  coins: string[];
  exchanges: string[];
}

const CoinSelector: React.FC<CoinSelectorProps> = ({
  selectedCoin,
  selectedExchange,
  onCoinChange,
  onExchangeChange,
  coins,
  exchanges,
}) => {
  return (
    <div>
      <FormControl>
        <InputLabel id="coin-label">Coin</InputLabel>
        <Select
          labelId="coin-label"
          value={selectedCoin}
          label="Coin"
          onChange={onCoinChange}
        >
          {coins.map((coin) => (
            <MenuItem key={coin} value={coin}>
              {coin}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel id="exchange-label">Exchange</InputLabel>
        <Select
          labelId="exchange-label"
          value={selectedExchange}
          label="Exchange"
          onChange={onExchangeChange}
        >
          {exchanges.map((exchange) => (
            <MenuItem key={exchange} value={exchange}>
              {exchange}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default CoinSelector;
