"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Auth Middleware
const authMiddleware_1 = require("../../middlewares/authMiddleware");
// Controllers
const userController_1 = require("./userController");
const multerStorage_1 = require("../../config/multerStorage");
// Routes
router.get('/me', authMiddleware_1.authMiddleware, userController_1.getMyProfileController);
router.get('/', authMiddleware_1.authMiddleware, userController_1.userInfoController);
router.put('/', authMiddleware_1.authMiddleware, multerStorage_1.upload.single('image'), userController_1.updateUserInfoController);
exports.default = router;
