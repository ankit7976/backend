const  slugify = require('slugify');
const Category = require('../models/category');
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


exports.getProductBySlug = (req,res)=>{
    const {slug} = req.params;
    Category.findOne({slug:slug}).select('_id').exec((err,category)=>{
        if(err) res.status(400).json({err:err})
        
         if(category){
              Product.find({category:category._id}).exec((error,products)=>{
                if(error) res.status(400).json({error:error})
                if(products.length > 0) {
                res.status(201).json({
                products,
                productByPrice: {
                    under5K: products.filter(product=> product.price <= 5000),
                    under10K: products.filter(product=> product.price > 5000 && product.price <= 10000),
                    under15K: products.filter(product=> product.price > 10000 && product.price <= 15000),
                    under20K: products.filter(product=> product.price > 15000 && product.price <= 20000),
                    under30K: products.filter(product=> product.price > 20000 && product.price <= 30000),
                }    
                
                })
                }
              })
          }
    })
}