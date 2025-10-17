const express = require("express")
require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT
const authRouter = require('./routes/authRouter')
const bookRouter = require('./routes/bookRouter')
const categoryRouter = require('./routes/categoryRouter')


const sequelize = require("./data/db")


const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));


app.use("/uploads", express.static("uploads"));



app.use('/auth', authRouter);
app.use('/book', bookRouter);
app.use('/category', categoryRouter);


app.use("/api/v1/auth", authRouter);
app.use("/api/v1/book", bookRouter);



sequelize.sync().then(() => console.log("Database ready!"));


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});