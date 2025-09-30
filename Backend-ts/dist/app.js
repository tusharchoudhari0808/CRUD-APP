"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userRouter_1 = __importDefault(require("./router/userRouter"));
const adminRouter_1 = __importDefault(require("./router/adminRouter"));
const app = (0, express_1.default)();
const port = process.env.PORT;
//  Allow frontend to send cookies
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true, //
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use("/api/users", userRouter_1.default);
app.use("/api/admin", adminRouter_1.default);
app.listen(port, () => {
    console.log(` Server running on http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map