const express = require('express');
const mongoose = require('mongoose');
const env = require('dotenv')
const app = express();



const userRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin/auth');
const categoryRoutes = require('./routes/category');
const ProductRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');

// Envorment Varibles 
env.config()

// Mongodb connection
mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.clayf.mongodb.net/${process.env.MONGO_DATABASE_NAME}?retryWrites=true&w=majority`,{
    useNewUrlParser : true,
    useUnifiedTopology:true
}).then(()=> console.log('Database connected succesfuly'))




app.use(express.json());
app.use('/api',userRoutes)
app.use('/api',adminRoutes)
app.use('/api',categoryRoutes)
app.use('/api',ProductRoutes)
app.use('/api',cartRoutes)



app.listen(process.env.PORT, ()=>{
    console.log(`Development Server is runing on port ${process.env.PORT}`)
});