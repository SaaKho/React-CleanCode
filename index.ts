import express, { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3000;

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

app.use(express.json());

// Function to generate JWT token
const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: "1h" });
};

// const authMiddleware = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const token = req.header("Authorization")?.replace("Bearer ", "");

//   if (!token) {
//     return res
//       .status(401)
//       .json({ message: "Access denied. No token provided." });
//   }

//   try {
//     const decoded = jwt.verify(token, SECRET_KEY);
//     (req as any).user = decoded;
//     next(); // Continue to the next middleware or route handler
//   } catch (error) {
//     res.status(401).json({ message: "Invalid token." });
//   }
// };

// GET API - Welcome Route
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to my To Do App");
});

// POST API to Register a User
app.post("/api/users/register", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields (name, email, password) are required.",
    });
  }
  try {
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
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

// POST API to Login a User and Generate JWT
app.post("/api/users/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
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
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// PUT API to Update a User
app.put("/api/users/update/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  if (!name && !email && !password) {
    return res.status(400).json({
      message:
        "At least one field (name, email, password) is required to update.",
    });
  }

  try {
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
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

// DELETE API to Delete a User
app.delete("/api/users/delete/:id", async (req: Request, res: Response) => {
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
});

app.post("/api/todos/newtodo", async (req: Request, res: Response) => {
  const { title, description, status } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      message: "Title and description are required.",
    });
  }

  try {
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
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

app.get("/api/users/getAllUsers", async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/todos/getAllTodo", async (req: Request, res: Response) => {
  try {
    const todos = await prisma.todo.findMany();
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.put("/api/todos/update/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  if (!title && !description && status === undefined) {
    return res.status(400).json({
      message:
        "At least one field (title, description, status) is required to update.",
    });
  }

  try {
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
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

// DELETE API to Delete a Todo
app.delete("/api/todos/delete/:id", async (req: Request, res: Response) => {
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
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
