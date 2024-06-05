import React from "react";
import ListAlt from "@mui/icons-material/ListAlt";
import IconButton from "@mui/material/IconButton";
import { ICellRendererParams } from "ag-grid-enterprise";

interface IViewOrderBookCellRendererParams extends ICellRendererParams {
  onClick: (coin: string) => void;
}

const ViewOrderBookCellRenderer = ({
  data,
  onClick,
}: IViewOrderBookCellRendererParams) => {
  return (
    <span>
      <IconButton
        onClick={() => onClick(data.coin)}
        style={{ marginLeft: "20px", color: "white" }}
        size="small"
      >
        <ListAlt />
      </IconButton>
    </span>
  );
};

export default ViewOrderBookCellRenderer;
