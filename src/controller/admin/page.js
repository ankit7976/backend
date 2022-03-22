const Page = require('../../models/page')

exports.createPage = (req, res) => {
    const { banners, products } = req.files;
    if (banners.length > 0) {
        req.body.banners = banners.map((banner, index) => ({
            img: `${process.env.API}${banner.filename}`,
            navigateTo: `/bannerClicked?categoryId=${req.body.category}&type:${req.body.type}`
        }));
    }

    if (products.length > 0) {
        req.body.products = products.map((product, index) => ({
            img: `${process.env.API}${product.filename}`,
            navigateTo: `/bannerClicked?categoryId=${req.body.category}&type:${req.body.type}`
        }));
    }

    req.body.createdBy = req.user._id;

    Page.findOneAndUpdate({ category: req.body.category })
        .exec((error, page) => {
            if (error) return res.status(400).json({ error })
            if (page) {
                Page.findByIdAndUpdate({ category: req.body.category }, req.body)
                    .exec((error, updatedPage) => {
                        if (error) return res.status(400).json({ error })
                        if (updatedPage) return res.status(201).json({ updatedPage });
                    })
            } else {

                const page = new Page(req.body)
                page.save((error, page) => {
                    if (error) res.status(400).json({ error })
                    if (page) res.status(201).json({ page })
                })
            }
        })

}



exports.getPage = (req,res)=>{
    const {category,type} = req.params;
    if(type === 'page'){
        Page.findOne({category:category})
        .exec((err,page)=>{
            if (err) return res.status(400).json({ err })
            if (page) return res.status(201).json({ page });
        })
    }
}