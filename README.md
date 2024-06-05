# CryptX

CryptX is a Crypto order book viewer using the lo.tech WebSocket

## Usage

To start the React application, run the following:

```bash
npm start
```

## Technology choices

I made use of the following front-end technologies to complete this project:

1. React/Typescript:

    - Component based architecture promotes reusability of code
    - Performance: Usage of virtual DOM enhances performance and allows for streaming real time data
    - Type Safety
    - Scalability

2. Material UI:
    
    - Pre built components that are well maintained and documented

3. AGGrid:

    - High performance: AGGrid is the go to grid for high frequency updates, I have made use of particular features such as `.applyTransactionAsync()` which allows for efficient updating of the grid by applying update transactions in batches to relieve pressure on the browser
    - AGGrid has many features built in that allow you to visualise information clearly and quickly. I have demonstrated a few in this project, namely sparklines, built-in sorting, value change animations and custom cell components

    
## Assumptions

- Data from the WebSocket provided will be of consistent shape, with bids and asks provided together for a given timestamp, coin and exchange. If the format of the data changes, we would need to change some of the front end logic
- For this initial solution, I have hardcoded the exchanges for the ExchangeSelector component, assuming there is only Exchange X and Y. If further exchanges were to be added, I would update this dynamically, possibly using a dropdown if there were too many to fit in tabs.
- I am allowed to use AI to create the logo :)

## Ideas for improvement

- Implement multiple order books - this would involve allowing multiple selection on the ExchangeView AGGrid, maybe with checkboxes and reusing the OrderBook component. Although the current solution does allow you to compare activity across multiple coins in an exchange through the ExchangeView, especially with the sparkline grids
- On the backend, we could consider using Socket.IO to ensure automatic reconnection and event based communication. We could have handlers for each exchange/coin which would be easier and more efficient to subscribe to on the front end. 


