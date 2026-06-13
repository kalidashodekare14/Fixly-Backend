"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("./adminController");
const router = express_1.default.Router();
router.get('/overview', adminController_1.adminOverviewInfoController);
router.get('/manage_user', adminController_1.usersManageController);
router.put('/:id/status_change', adminController_1.userStatusChangeController);
router.get('/manage_requests', adminController_1.requestsManageController);
router.get('/manage_payments', adminController_1.paymentsManageController);
router.get('/manage_reviews', adminController_1.reviewsManageController);
router.post('/categories', adminController_1.createCategoriesController);
exports.default = router;
