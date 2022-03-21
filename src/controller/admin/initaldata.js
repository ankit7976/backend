
const Category = require('../../models/category')
const Product = require('../../models/product')



function createcategories(categories, parentId = null){
    const categoryList = [];
    let category;
    if(parentId == null){
        category = categories.filter(cat => cat.parentId == undefined)
    }else{
        category = categories.filter(cat => cat.parentId == parentId)
    }

    for(let cate of category){
        categoryList.push({
            _id:cate._id,
            name: cate.name,
            slug:cate.slug,
            type: cate.type,
            parentId:cate.parentId,
            children: createcategories(categories,cate._id)
        });
    }

    return categoryList


}

exports.initalData = async (req,res)=>{
    const categories = await Category.find({}).exec();
    const product = await Product.find({})
    .select('_id name price quantity slug description productPictures category').populate({path:'category', select : '_id name'}).exec();

    res.status(201).json({
        categories:createcategories(categories),
        product
    })
}