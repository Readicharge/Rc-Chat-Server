import Product from "../models/productModel.js";
import { v2 as cloudinary } from "cloudinary";

// Create a new product
const createProduct = async (req, res) => {
  try {

    const {img} = req.body;
    if (img) {
        const uploadedResponse = await cloudinary.uploader.upload(img);
        img = uploadedResponse.secure_url;
    }
    const newProduct = new Product({...req.body,images:[img]});
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(deletedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a list of all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific product by ID
const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove a product by ID
const removeProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const removedProduct = await Product.findByIdAndRemove(productId);

    if (!removedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(removedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Update The product 
const updateProduct = async (req, res) => {
    try {
      const { productId } = req.params;
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { $set: req.body },
        { new: true }
      );
  
      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

export {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  removeProduct,
  updateProduct
};
