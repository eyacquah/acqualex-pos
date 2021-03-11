const express = require("express");

const productController = require("../controllers/productController");

const router = express.Router();

router
  .route("/")
  .get(productController.getAllProducts)
  .post(productController.createProduct);

router.route("/search").get(productController.getSearchData);
router.route("/update-many").patch(productController.updateMultipleProducts);

router
  .route("/:id")
  .get(productController.getProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
