const express = require('express');
const mongoose = require('mongoose');
const env = require('dotenv')
const cors = require('cors')
const app = express();
const path = require('path') 


const userRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin/auth');
const categoryRoutes = require('./routes/category');
const ProductRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const initalDataRoutes = require('./routes/admin/initalData');
const pageRoutes = require('./routes/admin/page');
const addressRoutes = require('./routes/address')
// Envorment Varibles 
env.config()

// Mongodb connection
mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.clayf.mongodb.net/${process.env.MONGO_DATABASE_NAME}?retryWrites=true&w=majority`,{
    useNewUrlParser : true,
    useUnifiedTopology:true
}).then(()=> console.log('Database connected succesfuly'))



app.use(cors());
app.use(express.json());
app.use('/public',express.static(path.join(__dirname, 'uploads')));
app.use('/api',userRoutes);
app.use('/api',adminRoutes);
app.use('/api',categoryRoutes);
app.use('/api',ProductRoutes);
app.use('/api',cartRoutes);
app.use('/api',initalDataRoutes);
app.use('/api',pageRoutes);
app.use('/api',addressRoutes);



app.listen(process.env.PORT, ()=>{
    console.log(`Development Server is runing on port ${process.env.PORT}`)
});