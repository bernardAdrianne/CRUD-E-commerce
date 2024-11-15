import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';

import adminRoutes from './routes/admin route/admin.route.js';
import productRoutes from "./routes/admin route/product.route.js";
import categoryRoutes from './routes/admin route/admin.category.route.js'
import viewUsers from './routes/admin route/admin.user.route.js'

import userRoutes from './routes/user route/user.route.js'; 
import userProductBrowsingController from './routes/user route/user.product.browsing.route.js';
import userCartController from './routes/user route/user.cart.route.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


//Admin routes
app.use("/oroastko/admin", adminRoutes);
app.use("/oroastko/admin/products", productRoutes);
app.use("/oroastko/admin/category", categoryRoutes);
app.use("/oroastko/admin/mycustomer", viewUsers);

//Admin login render
app.get('/oroastko/admin/login', (req, res) => {
    res.render('adminLogin');
})

//User routes
app.use("/oroastko/user", userRoutes);
app.use("/oroastko/user/products", userProductBrowsingController);
app.use("/oroastko/user/cart", userCartController);

//User login render
app.get('/oroastko/user/login', (req, res) => {
    res.render('userLogin');
});


app.listen(5000, () =>  {
    connectDB();
    console.log("Server started at http://localhost:5000");
}); 

