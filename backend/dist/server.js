"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./config/swagger"));
const path_1 = __importDefault(require("path"));
const security_1 = require("./middleware/security");
const security_2 = require("./config/security");
const performance_1 = require("./utils/performance");
const auth_1 = __importDefault(require("./routes/auth"));
const blog_1 = __importDefault(require("./routes/blog"));
const projects_1 = __importDefault(require("./routes/projects"));
const career_1 = __importDefault(require("./routes/career"));
const contact_1 = __importDefault(require("./routes/contact"));
const testimonials_1 = __importDefault(require("./routes/testimonials"));
const categories_1 = __importDefault(require("./routes/categories"));
const timeEntries_1 = __importDefault(require("./routes/timeEntries"));
const employees_1 = __importDefault(require("./routes/employees"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3002;
app.use(security_1.securityHeaders);
app.use((0, cors_1.default)(security_2.securityConfig.cors));
if (security_2.securityConfig.monitoring.performanceEnabled) {
    app.use(security_1.requestLogger);
}
app.use(performance_1.performanceMiddleware);
if (security_2.securityConfig.monitoring.securityEnabled) {
    app.use(security_1.securityMonitoring);
}
app.use('/api/', security_1.generalRateLimit);
app.use('/api/auth/', security_1.authRateLimit);
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, morgan_1.default)('combined'));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
app.get('/api/performance', (req, res) => {
    try {
        const stats = (0, performance_1.getPerformanceStats)();
        res.json({
            success: true,
            data: stats,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get performance stats'
        });
    }
});
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Tasami API Documentation'
}));
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'Backend is working!',
        timestamp: new Date().toISOString()
    });
});
app.use('/api/auth', auth_1.default);
app.use('/api/blog', blog_1.default);
app.use('/api/projects', projects_1.default);
app.use('/api/career', career_1.default);
app.use('/api/contact', contact_1.default);
app.use('/api/testimonials', testimonials_1.default);
app.use('/api/categories', categories_1.default);
app.use('/api/time-entries', timeEntries_1.default);
app.use('/api/employees', employees_1.default);
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
    console.log(`📝 Available endpoints:`);
    console.log(`   - POST /api/auth/register`);
    console.log(`   - POST /api/auth/login`);
    console.log(`   - GET  /api/blog/articles`);
    console.log(`   - GET  /api/projects`);
    console.log(`   - GET  /api/career/jobs`);
    console.log(`   - POST /api/contact/messages`);
    console.log(`   - POST /api/time-entries (Employee)`);
    console.log(`   - GET  /api/time-entries (Employee)`);
    console.log(`   - GET  /api/employees (Admin)`);
    console.log(`   - POST /api/employees (Admin)`);
});
exports.default = app;
//# sourceMappingURL=server.js.map