const Cart = require('./../models/cart')

exports.addToCart = (req,res)=>{
   
    const cart = new Cart({
        user:req.user._id,
        cartItems : req.body.cartItems
    })

    cart.save((err,cart)=>{
        if(err) res.status(400).json({err});
        if(cart) res.status(201).json({cart})
    })

}