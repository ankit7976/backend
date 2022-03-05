const express = require('express');
const mongoose = require('mongoose');
const env = require('dotenv')
const bodyParser = require('body-parser')
const app = express();



const userRoutes = require('./routes/auth')

// Envorment Varibles 
env.config()

// Mongodb connection
mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.clayf.mongodb.net/${process.env.MONGO_DATABASE_NAME}?retryWrites=true&w=majority`,{
    useNewUrlParser : true,
    useUnifiedTopology:true
}).then(()=> console.log('Database connected succesfuly'))



app.use(bodyParser())
app.use('/api',userRoutes)


app.listen(process.env.PORT, ()=>{
    console.log(`Development Server is runing on port ${process.env.PORT}`)
});