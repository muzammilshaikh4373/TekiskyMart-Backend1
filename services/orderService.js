import Order from "../models/orderModel.js";

import ProductModel from "../models/productModel.js";

import { getOneProduactService } from "./adminServices.js";

let saveOrder = async (data) => {
  try {
    
    for(let i=0;i<data.products.length;i++){
      let product=await  getOneProduactService(data.products[i].product)
      console.log(product,"product for order");
      product.availableStockQty-=parseInt(data.products[i].quantity,10) 
      console.log(product.availableStockQty);
      await ProductModel.updateOne({"_id":data.products[i].product},{ $set: { availableStockQty: product.availableStockQty } })
    }
    let order = new Order({...data,status:"order"});
    let result = await order.save();
    if (result) {
      return 'successfull';

    }

  } catch (error) {
    console.error("Error adding order:", error);
    throw new Error("Failed to add order");
  }
  console.log(req);
};

let getAllOrders = async () => {
  try {
    let allOrders = await Order.find();
    console.log(allOrders);
    return allOrders;
  } catch (err) {
    console.error('Error in fetching orders:', err);
    throw new Error('Error in fetching orders');
  }
};

let getOrderById = async (id) => {
  try {
    console.log(id);
    let order = await Order.findById(id);
    return order;
  } catch (err) {
    console.error('Error in fetching order:', err);
    throw new Error('Error in fetching order');

  }
};

let deleteOrderById = async (id) => {
  try {
    //console.log(req.params.id);
    let orderDeleted = await Order.findByIdAndDelete(id);
    return orderDeleted;
  } catch (err) {
    console.error('Error in deleting the  orders:', err);
    throw new Error('Error in deleting orders');
  }
};

let updateOrderById = async (id, updateData) => {
  try {
    // console.log(req.params.id);
    let orderUpdated = await Order.findByIdAndUpdate(id, updateData, { new: true });
    return orderUpdated;
  } catch (err) {
    console.error('Error in updating the  order:', err);
    throw new Error('Error in fetching order');
  }
};


export { saveOrder, getAllOrders, getOrderById, deleteOrderById, updateOrderById };
