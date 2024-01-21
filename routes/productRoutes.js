import express from "express";
const router = express.Router();
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    removeProduct,
    updateProduct
} from "../controllers/productController.js";


router.post('/product', createProduct);
router.delete('/product/:productId', deleteProduct);
router.get('/products', getAllProducts);
router.get('/product/:productId', getProductById);
router.delete('/product/:productId', removeProduct);
router.put("/product/:productId", updateProduct);

export default router;