import dotenv from 'dotenv';
dotenv.config({ path: './.env' });


import connectDB from "./config/db";
import app from "./server";




connectDB()
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server is running on port ${process.env.PORT || 5000}`);
        });
    })
    .catch((error) => {
        console.error("Failed to connect to the database:", error);
    });