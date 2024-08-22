"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";
app.use(express_1.default.json());
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long"),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long"),
});
const todoSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    description: zod_1.z.string().min(1, "Description is required"),
    status: zod_1.z.boolean().optional(),
});
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ id: userId }, SECRET_KEY, { expiresIn: "1h" });
};
app.get("/", (req, res) => {
    res.send("Welcome to my To Do App");
});
app.post("/api/users/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        registerSchema.parse(req.body);
        const { name, email, password } = req.body;
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = yield prisma.user.create({
            data: {
                userid: (0, uuid_1.v4)(),
                name,
                email,
                password: hashedPassword,
            },
        });
        res.status(201).json(user);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ message: error.errors });
        }
        console.error(error);
        res.status(400).json({ message: error.message });
    }
}));
app.post("/api/users/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        loginSchema.parse(req.body);
        const { email, password } = req.body;
        const user = yield prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials." });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials." });
        }
        const token = generateToken(user.userid);
        res.status(200).json({ message: "Login successful", token });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ message: error.errors });
        }
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
app.put("/api/users/update/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        registerSchema.partial().parse(req.body);
        const { id } = req.params;
        const { name, email, password } = req.body;
        const user = yield prisma.user.update({
            where: { userid: id },
            data: {
                name,
                email,
                password,
            },
        });
        res.status(200).json(user);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ message: error.errors });
        }
        console.error(error);
        res.status(400).json({ message: error.message });
    }
}));
app.delete("/api/users/delete/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.user.delete({
            where: { userid: id },
        });
        res.status(200).json({ message: "User deleted successfully." });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
}));
app.post("/api/todos/newtodo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        todoSchema.parse(req.body);
        const { title, description, status } = req.body;
        const todo = yield prisma.todo.create({
            data: {
                tid: (0, uuid_1.v4)(),
                title,
                description,
                status: status || false,
            },
        });
        res.status(201).json(todo);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ message: error.errors });
        }
        console.error(error);
        res.status(400).json({ message: error.message });
    }
}));
app.get("/api/users/getAllUsers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany();
        res.json(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
app.get("/api/todos/getAllTodo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todos = yield prisma.todo.findMany();
        res.json(todos);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
app.put("/api/todos/update/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        todoSchema.partial().parse(req.body);
        const { id } = req.params;
        const { title, description, status } = req.body;
        const todo = yield prisma.todo.update({
            where: { tid: id },
            data: {
                title,
                description,
                status,
            },
        });
        res.status(200).json(todo);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ message: error.errors });
        }
        console.error(error);
        res.status(400).json({ message: error.message });
    }
}));
app.delete("/api/todos/delete/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.todo.delete({
            where: { tid: id },
        });
        res.status(200).json({ message: "Todo deleted successfully." });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
}));
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map