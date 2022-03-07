const Cart = require('./../models/cart')

exports.addToCart = (req,res)=>{

    Cart.findOne({user:req.user._id}).exec((error,cart)=>{
        if(error) res.status(400).json({error});
        if(cart){
            // if cart already exits then update cart by quantity


            const product = req.body.cartItems.product;
            const item = cart.cartItems.find(c=>c.product == product);
            let condtion, update;

            if(item){
                condtion = {"user":req.user._id, "cartItems.product" : product};
                update = {
                    "$set": {
                        "cartItems.$" : {
                            ...req.body.cartItems,
                            quantity : item.quantity + req.body.cartItems.quantity
                        }
                    }
                }
            
            }else{

                condtion = {user:req.user._id};
                update = {
                    "$push": {
                        "cartItems" : req.body.cartItems
                    }
                }
            
            }


            Cart.findOneAndUpdate(condtion,update)
            .exec((error,_cart)=>{
                if(error) res.status(400).json({error});
                if(_cart) res.status(400).json({cart:_cart});
            })

     
        }else{
            
            const cart = new Cart({
                user:req.user._id,
                cartItems : [req.body.cartItems]
            })
        
            cart.save((err,cart)=>{
                if(err) res.status(400).json({err});
                if(cart) res.status(201).json({cart})
            })
        }
    })
   


}