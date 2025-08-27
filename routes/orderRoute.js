import express from 'express'
import {  placeGuestOrder, trackOrder, placeOrder, allOrders, userOrders, updateStatus , } from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'


const orderRouter = express.Router()

//  admin features 

orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)



// Guest user order
orderRouter.post("/place-guest", placeGuestOrder);

// Public tracking route
orderRouter.get("/track/:trackingId", trackOrder);

//  payment features

orderRouter.post('/place',authUser, placeOrder)


// User Feature

orderRouter.post('/userorders', authUser, userOrders)

export default orderRouter;