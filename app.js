import express from "express"
import dotenv from "dotenv"
dotenv.config()
import { dbConnect } from "./db/dbConnect.js"
import orderRoute from "./routers/orderRouter.js";
import adminRoutes from "./routers/adminRoutes.js"
dotenv.config();
const app=express()
let dburl=process.env.DBURL
let dbname=process.env.DBNAME
const port =process.env.PORT
dbConnect(dburl,dbname)
app.use(express.json())



 app.use("/order",orderRoute)
//app.use("/product",productRoute)

app.use("/admin", adminRoutes)

app.listen(port, () => {
    console.log(`server started at port number  ${port}`)
})
