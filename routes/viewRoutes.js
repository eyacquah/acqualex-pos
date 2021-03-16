const express = require("express");

const viewsController = require("../controllers/viewsController");
// const authController = require("../controllers/authController");

const router = express.Router();

router.use(viewsController.getLoginTemplate);
// router.use(authController.protect);

router.get("/", viewsController.getIndex);

// Categories
router.get("/categories/all", viewsController.getCategoryList);
router.get("/categories/add", viewsController.getCategoryForm);
router.get("/categories/:slug/delete", viewsController.confirmDeleteCategory);

// Products
router.get("/products/add", viewsController.createProductForm);
router.get("/categories/:slug/:id", viewsController.getProductList);
router.get("/products/:slug/delete", viewsController.confirmDeleteProduct);
router.get("/products/:slug", viewsController.updateProductForm);

// Customers
router.get("/customers/all", viewsController.getAllCustomers);
router.get("/customers/add", viewsController.getCreateCustomerForm);
router.get("/customers/:slug", viewsController.getCustomerUpdateForm);

// Branches
router.get("/branches/all", viewsController.getAllBranches);
router.get("/branches/add", viewsController.getCreateBranchForm);
router.get(
  "/branches/:slug/products/add",
  viewsController.getBranchProductForm
);
router.get("/branches/:slug", viewsController.getBranchDetail);

// Orders
router.get("/orders/add", viewsController.getOrderForm);
router.get("/orders/all", viewsController.getAllOrders);
router.get("/orders/:id/refund", viewsController.createRefund);
router.get("/orders/:id/invoice", viewsController.getOrderInvoice);
router.get("/orders/:id", viewsController.getOrderDetail);

module.exports = router;
