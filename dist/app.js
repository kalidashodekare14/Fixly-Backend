"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// External dependencies
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// Internal dependencies
const authRoutes_1 = __importDefault(require("./modules/auth/authRoutes"));
const userRoutes_1 = __importDefault(require("./modules/user/userRoutes"));
const providerRoutes_1 = __importDefault(require("./modules/provider/providerRoutes"));
const requestRoutes_1 = __importDefault(require("./modules/request/requestRoutes"));
const publicRoutes_1 = __importDefault(require("./modules/public/publicRoutes"));
const adminRoutes_1 = __importDefault(require("./modules/admin/adminRoutes"));
const reviewRoutes_1 = __importDefault(require("./modules/review/reviewRoutes"));
// Initialize Express app
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: '*',
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/', (_req, res) => {
    res.json({ message: 'Fixly API is running' });
});
// Routes
app.use('/api/public', publicRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
app.use('/api/user', userRoutes_1.default);
app.use('/api/provider', providerRoutes_1.default);
app.use('/api/request', requestRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/review', reviewRoutes_1.default);
// Global error handler
app.use((err, _req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});
// Routes not found handler
app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
exports.default = app;
