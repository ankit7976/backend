 
const Cart = require('./../models/cart')

function runUpdate(condtion,update){
    return new Promise((resolve,reject)=>{
        Cart.findOneAndUpdate(condtion,update,{upsert:true})
        .then(result => resolve())
        .catch(err=> reject(err))
    });
}

exports.addItemToCart = (req, res) => {

    Cart.findOne({ user: req.user._id }).exec((error, cart) => {
        if (error) res.status(400).json({ error });
        if (cart) {
            // if cart already exits then update cart by quantity
            let promiseArray = [];
            req.body.cartItems.forEach((cartItem) => {
                const product = cartItem.product;
                const item = cart.cartItems.find((c) => c.product == product);
                let condtion, update;

                if (item) {
                    condtion = { user: req.user._id, "cartItems.product": product };
                    update = {
                        $set: {
                            "cartItems.$":  cartItem
                        }
                    }

                } else {

                    condtion = { user: req.user._id };
                    update = {
                        $push: {
                            cartItems: cartItem
                        }
                    }

                }

                promiseArray.push(runUpdate(condtion,update))
                // Cart.findOneAndUpdate(condtion, update)
                // .exec((error, _cart) => {
                //     if (error) res.status(400).json({ error });
                //     if (_cart) res.status(400).json({ cart: _cart });
                // })

            });

            Promise.all(promiseArray)
            .then(response => res.status(201).json({response}))
            .catch(error => res.status(400).json({error}))

        } else {

            const cart = new Cart({
                user: req.user._id,
                cartItems: req.body.cartItems
            })

            cart.save((err, cart) => {
                if (err) res.status(400).json({ err });
                if (cart) res.status(201).json({ cart })
            })
        }
    })

}


exports.getCartItems = (req,res)=>{
    Cart.findOne({user:req.user._id})
    .populate('cartItems.product','_id name price productPictures')
    .exec((error,cart)=>{
        if(error) return res.status(400).json({error});
        if(cart){
            let cartItems = {}
            cart.cartItems.forEach((item,index)=>{
                cartItems[item.product._id.toString()] = {
                    _id:item.product._id.toString(),
                    name:item.product.name,
                    img:item.product.productPictures[0].img,
                    price:item.product.price,
                    qty:item.quantity
                }
            })
            res.status(201).json({cartItems})
        }
    })
}



// new update remove cart items
exports.removeCartItems = (req, res) => {
    const { productId } = req.body.payload;
    if (productId) {
      Cart.update(
        { user: req.user._id },
        {
          $pull: {
            cartItems: {
              product: productId,
            },
          },
        }
      ).exec((error, result) => {
        if (error) return res.status(400).json({ error });
        if (result) {
          res.status(202).json({ result });
        }
      });
    }
  };