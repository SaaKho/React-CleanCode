import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { authMiddleware } from "./middleware";

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3000;

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

app.use(express.json());

// Zod Schemas for validation
const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const todoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.boolean().optional(),
});

// Function to generate JWT token
const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: "1h" });
};

//---------------------API For Users-------------------------------
// GET API - Welcome Route
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to my To Do App");
});

// GET API to Get All Users
app.get("/api/users/getAllUsers", async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST API to Register a User
app.post("/api/users/register", async (req: Request, res: Response) => {
  try {
    registerSchema.parse(req.body); // Validate input using Zod

    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    const user = await prisma.user.create({
      data: {
        userid: uuidv4(), // Generate UUID for userid
        name,
        email,
        password: hashedPassword, // Store hashed password
      },
    });
    res.status(201).json(user);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors });
    }
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

// POST API to Login a User and Generate JWT
app.post("/api/users/login", async (req: Request, res: Response) => {
  try {
    loginSchema.parse(req.body); // Validate input using Zod

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = generateToken(user.userid);
    res.status(200).json({ message: "Login successful", token });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors });
    }
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// PUT API to Update a User
app.put(
  "/api/users/update/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      registerSchema.partial().parse(req.body); // Validate input using Zod

      const { id } = req.params;
      const { name, email, password } = req.body;

      const user = await prisma.user.update({
        where: { userid: id }, // UUID is a string, no need to convert to Number
        data: {
          name,
          email,
          password,
        },
      });
      res.status(200).json(user);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      console.error(error);
      res.status(400).json({ message: error.message });
    }
  }
);

// DELETE API to Delete a User
app.delete(
  "/api/users/delete/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    // Apply middleware
    const { id } = req.params;

    try {
      await prisma.user.delete({
        where: { userid: id }, // UUID is a string, no need to convert to Number
      });
      res.status(200).json({ message: "User deleted successfully." });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ message: error.message });
    }
  }
);

//---------------------------------API For Todos--------------------------------
// GET API to Get All Todos
app.get(
  "/api/todos/getAllTodo",
  authMiddleware,
  async (req: Request, res: Response) => {
    // Apply middleware
    try {
      const todos = await prisma.todo.findMany();
      res.json(todos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// POST API to Create a New Todo
app.post(
  "/api/todos/newtodo",
  authMiddleware,
  async (req: Request, res: Response) => {
    // Apply middleware
    try {
      todoSchema.parse(req.body); // Validate input using Zod

      const { title, description, status } = req.body;

      const todo = await prisma.todo.create({
        data: {
          tid: uuidv4(), // Generate UUID for tid
          title,
          description,
          status: status || false, // Default to false if not provided
        },
      });
      res.status(201).json(todo);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      console.error(error);
      res.status(400).json({ message: error.message });
    }
  }
);

// PUT API to Update a Todo
app.put(
  "/api/todos/update/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    // Apply middleware
    try {
      todoSchema.partial().parse(req.body); // Validate input using Zod

      const { id } = req.params;
      const { title, description, status } = req.body;

      const todo = await prisma.todo.update({
        where: { tid: id }, // UUID is a string, no need to convert to Number
        data: {
          title,
          description,
          status,
        },
      });
      res.status(200).json(todo);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      console.error(error);
      res.status(400).json({ message: error.message });
    }
  }
);

// DELETE API to Delete a Todo
app.delete(
  "/api/todos/delete/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    // Apply middleware
    const { id } = req.params;

    try {
      await prisma.todo.delete({
        where: { tid: id }, // UUID is a string, no need to convert to Number
      });
      res.status(200).json({ message: "Todo deleted successfully." });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ message: error.message });
    }
  }
);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
