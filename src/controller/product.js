const slugify = require('slugify');
const Category = require('../models/category');
const Product = require('../models/product');


exports.createProduct = (req, res) => {

    const {
        name,
        price,
        description,
        offer,
        category,
        quantity
    } = req.body;

    let productPictures = [];
    if (req.files.length > 0) {
        productPictures = req.files.map(file => {
            return { img: file.filename }
        })
    }

    const product = new Product({
        name: name, slug: slugify(name), price, quantity, description, offer,
        productPictures, category,
        createdBy: req.user._id
    });

    product.save((err, product) => {
        if (err) return res.status(400).json({ err });
        if (product) return res.status(201).json({ product })
    })


}


exports.getProductBySlug = (req, res) => {
    const { slug } = req.params;
    Category.findOne({ slug: slug }).select('_id type').exec((err, category) => {
        if (err) res.status(400).json({ err: err })

        if (category) {
            Product.find({ category: category._id }).exec((error, products) => {
                if (error) res.status(400).json({ error: error })
                if (category.type) {
                    if (products.length > 0) {
                        res.status(201).json({
                            products,
                            productByPrice: {
                                under5K: products.filter(product => product.price <= 5000),
                                under10K: products.filter(product => product.price > 5000 && product.price <= 10000),
                                under15K: products.filter(product => product.price > 10000 && product.price <= 15000),
                                under20K: products.filter(product => product.price > 15000 && product.price <= 20000),
                                under30K: products.filter(product => product.price > 20000 && product.price <= 30000),
                            }

                        })
                    }
                } else {
                    res.status(201).json({products})
                }

            }

            )
        }
    }
    )
}



exports.getProductDetailsById = (req, res) => {
    const { productId } = req.params;
    console.log(req.params)
    if (productId) {
        Product.findOne({ _id: productId })
            .exec((error, product) => {
                if (error) return res.status(400).json({ error: error })
                if (product) {
                    res.status(201).json({ product })
                }
            })
    } else {
        return res.status(400).json({ error: 'Params Required' })
    }
}


exports.getAllProductAap = async (req,res)=>{
  
    
    const product = await Product.find({})
    .select('_id name price quantity slug description productPictures category')
    .exec();
    const Category = findOne({_id:product.category}) .select('name').exec();

    product.category = Category.name
    res.status(201).json({
         
        product,
        
    })
}