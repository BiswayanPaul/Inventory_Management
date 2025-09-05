import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express();
const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : [];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}))

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello!');
});


// Import and use your routes here
import userRouter from "./routes/user.routes";
import productRouter from "./routes/product.routes"


app.use("/api/v1/users", userRouter);
app.use("/api/v1/product", productRouter)


export default app;