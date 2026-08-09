import { Router } from 'express'
import auth from '../middleware/auth.js'
import { createProductController, deleteProductDetails, getProductByCategory, getProductByCategoryAndSubCategory, getProductController, getProductDetails, searchProduct, seedProductsController, updateAllProductSizesController, updateProductDetails, bulkDeleteProductsController, bulkPublishProductsController } from '../controllers/product.controller.js'
import { admin } from '../middleware/Admin.js'

const productRouter = Router()

productRouter.get('/seed', seedProductsController)
productRouter.post('/seed', seedProductsController)
productRouter.post('/update-all-sizes', updateAllProductSizesController)
productRouter.get('/update-all-sizes', updateAllProductSizesController)
productRouter.post("/create",auth,admin,createProductController)
productRouter.post('/get',getProductController)
productRouter.post("/get-product-by-category",getProductByCategory)
productRouter.post('/get-pruduct-by-category-and-subcategory',getProductByCategoryAndSubCategory)
productRouter.post('/get-product-details',getProductDetails)

//update product
productRouter.put('/update-product-details',auth,admin,updateProductDetails)
productRouter.post('/bulk-publish',auth,admin,bulkPublishProductsController)

//delete product
productRouter.delete('/delete-product',auth,admin,deleteProductDetails)
productRouter.post('/bulk-delete',auth,admin,bulkDeleteProductsController)

//search product 
productRouter.post('/search-product',searchProduct)

export default productRouter