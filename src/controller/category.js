const slugify = require("slugify");
const Category = require('../models/category');


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
            children: createcategories(categories,cate._id)
        });
    }

    return categoryList


}

exports.addCategory = (req,res)=>{

    const categoryOBJ = {
        name:req.body.name,
        slug:slugify(req.body.name)
    }

    if(req.body.parentId){
        categoryOBJ.parentId = req.body.parentId
    }

    const cat = new Category(categoryOBJ)
    cat.save((error,category)=>{
        if(error) return res.status(400).json({error})
        if(category) return res.status(201).json({category})

    })
}

exports.getCategory = (req,res)=>{
    Category.find({}).exec((error,categories)=>{
        if(error) return res.status(400).json({error})
        if(categories) {
            const categoryList = createcategories(categories)
            return res.status(201).json({categoryList})
        }
    })
}