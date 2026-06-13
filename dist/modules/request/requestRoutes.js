"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// internal imports
const requestController_1 = require("./requestController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const multerStorage_1 = require("../../config/multerStorage");
// Define routes
router.get('/user_overivew', authMiddleware_1.authMiddleware, requestController_1.overviewInfoController);
router.post('/', authMiddleware_1.authMiddleware, multerStorage_1.upload.single('image'), requestController_1.createRequestController);
router.get('/', authMiddleware_1.authMiddleware, requestController_1.getRequestController);
router.put('/', authMiddleware_1.authMiddleware, multerStorage_1.upload.single('image'), requestController_1.updateRequestController);
router.delete('/', authMiddleware_1.authMiddleware, requestController_1.deleteRequestController);
router.get('/open_requests', authMiddleware_1.authMiddleware, requestController_1.viewOpenRequestController);
router.get('/selected_offer', authMiddleware_1.authMiddleware, requestController_1.viewSelectedOfferForRequestController);
// accept offer and get offers for request
router.get('/:requestId/selected_provider', authMiddleware_1.authMiddleware, requestController_1.getSelectedProviderController);
router.get('/:requestId/offers', authMiddleware_1.authMiddleware, requestController_1.getOffersForRequestController);
router.put('/offers/:offerId/accept', authMiddleware_1.authMiddleware, requestController_1.acceptOfferController);
router.post('/ssl_payment', authMiddleware_1.authMiddleware, requestController_1.sslcommerzPaymentController);
router.post('/payment_success', requestController_1.paymentSuccessController);
router.post('/payments_fail', requestController_1.paymentFailController);
router.post('/payments_cancel', requestController_1.paymentCancelController);
// payment history
router.get('/my-payments', authMiddleware_1.authMiddleware, requestController_1.getMyPaymentHistoryController);
exports.default = router;
