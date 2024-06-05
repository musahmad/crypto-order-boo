import React from "react";
import { Tab, Tabs } from "@mui/material";

interface ExchangeSelectorProps {
  selectedExchange: string;
  setExchange: (exchange: string) => void;
  exchanges: string[];
}

const ExchangeSelector: React.FC<ExchangeSelectorProps> = ({
  selectedExchange,
  setExchange,
  exchanges,
}) => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Tabs
        value={selectedExchange}
        onChange={(event, value) => setExchange(value)}
      >
        {exchanges.map((value) => (
          <Tab label={value} value={value} sx={{ color: "white" }} />
        ))}
      </Tabs>
    </div>
  );
};

export default ExchangeSelector;
