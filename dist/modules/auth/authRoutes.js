"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const authController_1 = require("./authController");
router.post('/register', authController_1.signUpController);
router.post('/login', authController_1.loginController);
router.post('/google', authController_1.googleLoginController);
exports.default = router;
