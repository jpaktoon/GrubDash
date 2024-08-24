# Project description: GrubDash
You've been hired as a backend developer for a new startup called GrubDash! As another developer works on the design and frontend experience, you have been tasked with setting up an API and building out specific routes so that the frontend developers can demo some initial design ideas for the big bosses.

# Tasks
In the src/dishes/dishes.controller.js file, add handlers and middleware functions to create, read, update, and list dishes. Note that dishes cannot be deleted.

In the src/dishes/dishes.router.js file, add two routes: /dishes and /dishes/:dishId. Attach the handlers (create, read, update, and list) exported from src/dishes/dishes.controller.js.

In the src/orders/orders.controller.js file, add handlers and middleware functions to create, read, update, delete, and list orders.

In the src/orders/orders.router.js file, add two routes: /orders and /orders/:orderId. Attach the handlers (create, read, update, delete, and list) exported from src/orders/orders.controller.js.

Any time you need to assign a new id to an order or dish, use the nextId function exported from src/utils/nextId.js.

## Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies: `npm install`

## Usage

1. Start the development server: `npm start`
2. Open your web browser and visit: `http://localhost:5000`

## Test
1. Run: `npm test`