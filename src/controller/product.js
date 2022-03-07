const  slugify = require('slugify');
const Product = require('../models/product');


exports.createProduct = (req,res)=>{
    
const {
    name,
    price,
    description,
    offer,
    category,
    quantity
    } = req.body;

let productPictures = [];
if(req.files.length > 0){
    productPictures = req.files.map(file => {
        return {img : file.filename}
    })
}

const product = new Product({ name:name, slug:slugify(name), price,quantity, description,offer, 
    productPictures, category,
    createdBy:req.user._id
});

product.save((err,product)=>{
    if(err) return res.status(400).json({ err});
    if(product) return res.status(201).json({product})
})


}