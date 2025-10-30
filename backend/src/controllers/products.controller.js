const { get } = require("mongoose");
const productModel = require("../models/product.model")



async function getProducts(req, res) {
    try {
        
        const products = await productModel.find()
        return res.status(200).json({ 
            message : "Products fetched successfully",
            products })
        
    }catch(err){ 
        return res.status(500).json({ message: "Internal server error" });
}
}

async function createProduct(req,res){
    const {title,description,price:{amount,currency},category,images,brand} = req.body
    try{
        const product = await productModel.create({
            title,
            description,
            price : {amount,currency},
            category,
            images,
            brand
        })
        return res.status(201).json({message : "Product created successfully", product})
    }catch(err){
        return res.status(500).json({ message: "Internal server error" });
    }
}

 async function getCategoryProduct(req,res){
    const {category} = req.params
    try{
        const product = await productModel.find({category})
        if(!product){
            return res.status(404).json({message : "Product not found"})
        }
        return res.status(200).json({message : "Product fetched successfully", product})
    }catch(err){
        return res.status(500).json({ message: "Internal server error" });
    }}

async function getFeaturedProducts(req, res) {
    try {
        // Get 1 product from each category
        const categories = ['electronics', 'fashion', 'shoes', 'home-kitchen', 'watches'];
        const featuredProducts = [];
        
        for (const category of categories) {
            const products = await productModel.find({ category }).limit(1);
            featuredProducts.push(...products);
        }
        
        return res.status(200).json({
            message: "Featured products fetched successfully",
            products: featuredProducts
        });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function bulkUploadProducts (req, res)  {
  try {
    const productsArray = req.body; // expecting array of objects

    if (!Array.isArray(productsArray)) {
      return res.status(400).json({ message: "Data must be an array of products" });
    }

    const result = await productModel.insertMany(productsArray);
    res.status(201).json({
      message: "Bulk products uploaded successfully",
      count: result.length,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ message: "Error uploading products", error: error.message });
  }
};


module.exports = {
    getProducts,createProduct,getCategoryProduct,bulkUploadProducts,getFeaturedProducts
}