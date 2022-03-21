const shortid = require("shortid");
const slugify = require("slugify");
const Category = require('../models/category');


function createcategories(categories, parentId = null) {
    const categoryList = [];
    let category;
    if (parentId == null) {
        category = categories.filter(cat => cat.parentId == undefined)
    } else {
        category = categories.filter(cat => cat.parentId == parentId)
    }

    for (let cate of category) {
        categoryList.push({
            _id: cate._id,
            name: cate.name,
            slug: cate.slug,
            type: cate.type,
            parentId: cate.parentId,
           
            children: createcategories(categories, cate._id)
        });
    }

    return categoryList


}

exports.addCategory = (req, res) => {

    const categoryOBJ = {
        name: req.body.name,
        slug: `${slugify(req.body.name)}-${shortid.generate()}`,
        type: req.body.type
    }

    if (req.file) {
        categoryOBJ.categoryImage = process.env.API + req.file.filename
    }

    if (req.body.parentId) {
        categoryOBJ.parentId = req.body.parentId
    }

    const cat = new Category(categoryOBJ)
    cat.save((error, category) => {
        if (error) return res.status(400).json({ error })
        if (category) return res.status(201).json({ category })

    })
}

exports.getCategory = (req, res) => {
    Category.find({}).exec((error, categories) => {
        if (error) return res.status(400).json({ error })
        if (categories) {
            const categoryList = createcategories(categories)
            return res.status(201).json({ categoryList })
        }
    })
}



exports.updateCategory = async (req, res) => {
    const { _id, name, parentId, type } = req.body;
    const updatedCategories = [];
    if (name instanceof Array) {
        for (let i = 0; i < name.length; i++) {
            const category = {
                name: name[i],
                type: type[i]
            };
            if (parentId[i] !== "") {
                category.parentId = parentId[i]
            }

            const updatedCategory = await Category.findByIdAndUpdate({ _id:_id[i] }, category, { new: true })
            updatedCategories.push(updatedCategory)
         
        }

        return res.status(201).json({ updateCategories:updatedCategories});
    } else {

        const category = {
            name, type
        }
        if (parentId !== "") {
            category.parentId = parentId
        }
        const updatedCategory = Category.findByIdAndUpdate({ _id }, category, { new: true })
        return res.status(201).json({ updatedCategory });
    }

}


exports.deleteCategories = async (req,res)=>{
    
    const {ids} = req.body.payload;
    const deletedItems = [];
    for(let i = 0; i < ids.length; i++){
        const deleteCategory = await Category.findOneAndDelete({_id:ids[i]._id});
        deletedItems.push(deleteCategory)
    }
if(deletedItems.length == ids.length){
    return res.status(201).json({message : 'Categories removed'})
}else{
    return res.status(400).json({message : 'Somthing went wrong'})
}
    
}