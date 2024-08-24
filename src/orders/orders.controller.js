const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName] && data[propertyName] !== "") {
      return next();
    }
    next({
      status: 400,
      message: `Order must include a ${propertyName}`,
    });
  };
}

function validDish(req, res, next) {
  const { data: { dishes } = {} } = req.body;
  if (Array.isArray(dishes) && dishes.length !== 0) {
    return next();
  } else {
    return next({
      status: 400,
      message: `Order must include at least one dish`,
    });
  }
}

function validQuantity(req, res, next) {
  const { data: { dishes } = {} } = req.body;
  dishes.forEach((dish, index) => {
    const quantity = dish.quantity;
    if (!quantity || quantity < 1 || Number(quantity) !== quantity) {
      next({
        status: 400,
        message: `Dish ${index} must have a quantity that is an integer greater than 0`,
      });
    }
  });
  next();
}

function orderExists(req, res, next) {
  const { orderId } = req.params;
  const foundOrder = orders.find((order) => order.id === orderId);
  if (foundOrder) {
    res.locals.order = foundOrder;
    return next();
  } else {
    return next({
      status: 404,
      message: `Order does not exist: ${req.params.orderId}`,
    });
  }
}

function matchOrderId(req, res, next) {
  const { orderId } = req.params;
  const { data: { id } = {} } = req.body;
  if (id && id !== orderId) {
    return next({
      status: 400,
      message: `Order id does not match route id. Order: ${id}, Route: ${orderId}`,
    });
  } else {
    next();
  }
}

function validStatus(req, res, next) {
  const { data: { status } = {} } = req.body;
  if (
    !status ||
    (status !== "pending" &&
      status !== "preparing" &&
      status !== "out-for-delivery")
  ) {
    return next({
      status: 400,
      message: `Order must have a status of pending, preparing, out-for-delivery, delivered`,
    });
  } else if (status === "delivered") {
    return next({
      status: 400,
      message: `A delivered order cannot be changed`,
    });
  }
  next();
}

function validDelete(req, res, next) {
  const order = res.locals.order;
  if (order.status === "pending") {
    return next();
  } else {
    return next({
      status: 400,
      message: `An order cannot be deleted unless it is pending`,
    });
  }
}

// respond with a list of all existing order data.
function list(req, res) {
  res.json({ data: orders });
}

// save the order and respond with the newly created order.
function create(req, res) {
  const { data: { deliverTo, mobileNumber, dishes, status } = {} } = req.body;
  const newOrder = {
    id: nextId(),
    deliverTo,
    mobileNumber,
    dishes,
    status,
  };
  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
}

// respond with the order where id === :orderId
function read(req, res) {
  res.json({ data: res.locals.order });
}

// update the order where id === :orderId
function update(req, res) {
  const foundOrder = res.locals.order;
  const { data: { deliverTo, mobileNumber, dishes } = {} } = req.body;
  foundOrder.deliverTo = deliverTo;
  foundOrder.mobileNumber = mobileNumber;
  foundOrder.dishes = dishes;
  res.json({ data: foundOrder });
}

// delete the order and return a 204 where id === :orderId
function destroy(req, res) {
  const order = res.locals.order;
  const index = orders.findIndex(
    (orderNum) => orderNum.id === Number(order.id)
  );
  orders.splice(index, 1);
  res.sendStatus(204);
}

module.exports = {
  list,
  create: [
    bodyDataHas("deliverTo"),
    bodyDataHas("mobileNumber"),
    bodyDataHas("dishes"),
    validDish,
    validQuantity,
    create,
  ],
  read: [orderExists, read],
  update: [
    orderExists,
    bodyDataHas("deliverTo"),
    bodyDataHas("mobileNumber"),
    bodyDataHas("dishes"),
    validDish,
    validQuantity,
    validStatus,
    matchOrderId,
    update,
  ],
  delete: [orderExists, validDelete, destroy],
};
