import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

// App Config
const app = express();
const port = process.env.PORT || 4000;

// Connect Database & Cloudinary (Error Handling Added)
connectDB()
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.error('MongoDB Connection Error:', err));

connectCloudinary()
    .then(() => console.log('Cloudinary Connected'))
    .catch((err) => console.error('Cloudinary Connection Error:', err));

// Middlewares
app.use(express.json());
app.use(cors({
    origin: ["https://insaffbd.com"],
<<<<<<< HEAD
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
=======
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: false
>>>>>>> bce7bff (new update)
}));

// API Endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)


// Root Route
app.get('/', (req, res) => {
    res.send( 'API is Working');
});

// Error Handling (Handles unexpected server crashes)
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Promise Rejection:', reason);
});

// Start Server
<<<<<<< HEAD
app.listen(port, "0.0.0.0", () => console.log(`Server started on port: ${port}`));
=======
app.listen(port, () => console.log(`Server started on port: ${port}`));





// import express from 'express';
// import cors from 'cors';
// import 'dotenv/config';
// import connectDB from './config/mongodb.js';
// import connectCloudinary from './config/cloudinary.js';
// import userRouter from './routes/userRoute.js';
// import productRouter from './routes/productRoute.js';
// import cartRouter from './routes/cartRoute.js';
// import orderRouter from './routes/orderRoute.js';

// // App Config
// const app = express();
// const port = process.env.PORT || 4000;

// // Connect Database & Cloudinary
// connectDB(process.env.MONGODB_URL)
//     .then(() => console.log('✅ MongoDB Connected'))
//     .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// connectCloudinary({
//     cloud_name: process.env.CLOUDINARY_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_SECRET_KEY
// })
//     .then(() => console.log('✅ Cloudinary Connected'))
//     .catch((err) => console.error('❌ Cloudinary Connection Error:', err));

// // Middlewares
// app.use(express.json());

// // --- CORS FIX ---
// // '*' + credentials একসাথে চলে না। তাই ALLOWED_ORIGINS ব্যবহার করব।
// const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
//     .split(',')
//     .map(o => o.trim())
//     .filter(Boolean);

// app.use(cors({
//     origin: (origin, cb) => {
//         if (!origin) return cb(null, true); // server-to-server or Postman
//         if (allowedOrigins.includes(origin)) return cb(null, true);
//         return cb(new Error(`CORS blocked for origin: ${origin}`));
//     },
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     credentials: true
// }));

// // API Endpoints
// app.use('/api/user', userRouter);
// app.use('/api/product', productRouter);
// app.use('/api/cart', cartRouter);
// app.use('/api/order', orderRouter);

// // Health & Root Routes
// app.get('/health', (req, res) => {
//     res.status(200).json({ status: 'ok', uptime: process.uptime() });
// });

// app.get('/', (req, res) => {
//     res.status(200).json({ message: 'API is Working' });
// });

// // Error Handling (uncaught/unhandled)
// process.on('uncaughtException', (err) => {
//     console.error('Uncaught Exception:', err);
//     process.exit(1);
// });

// process.on('unhandledRejection', (reason) => {
//     console.error('Unhandled Promise Rejection:', reason);
// });

// // Start Server
// app.listen(port, () => console.log(`🚀 Server started on port: ${port}`));


>>>>>>> bce7bff (new update)
