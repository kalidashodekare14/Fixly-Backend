"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reviewController_1 = require("./reviewController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post('/', authMiddleware_1.authMiddleware, reviewController_1.createReviewController);
router.get('/', authMiddleware_1.authMiddleware, reviewController_1.getMyReviewsController);
router.put('/:reviewId', authMiddleware_1.authMiddleware, reviewController_1.updateReviewController);
exports.default = router;
