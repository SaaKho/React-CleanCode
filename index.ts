const express = require("express");
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// POST API to register a user
// app.post("/api/users/register", async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     const user = await prisma.user.create({
//       data: {
//         name,
//         email,
//         password, 
//       },
//     });
//     res.status(201).json(user);
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ message: error.message });
//   }
// });

// app.post("/api/users/register", async (req, res) => {
//   console.log(req.body); 

//   const { name, email, password } = req.body;

//   if (!name || !email || !password) {
//     return res.status(400).json({ message: "All fields (name, email, password) are required." });
//   }

//   try {
//     const user = await prisma.user.create({
//       data: {
//         name,
//         email,
//         password,
//       },
//     });
//     res.status(201).json(user);
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ message: error.message });
//   }
// });


//Post API to register a user
app.post("/api/users/register", async (req, res) => {
  console.log(req.body); // Log the incoming request body

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields (name, email, password) are required." });
  }

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

//



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
