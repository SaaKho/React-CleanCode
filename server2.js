import { createServer } from "http";
const PORT = 9000;

const users = [
  { id: 1, name: "John" },
  { id: 2, name: "Doe" },
  { id: 3, name: "Jane" },
  { id: 4, name: "Thomas" },
  { id: 5, name: "Shelby" },
];

//Lets create a Logging Middleware for ourself which shows the request method and the url
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

//We can clean our code up as well
//We are seeing the application/json multiple times in our code so we can simply make it a middleware
//JSON Middleware
const jsonMiddleware = (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
};

//GET user Handler  GET api/users
const getUsersHandler = (req, res) => {
  res.write(JSON.stringify(users));
  res.end();
};

//Get User by ID handler GET /api/users/:id
const getUserByIdHandler = (req, res) => {
  const id = req.url.split("/")[3];
  const user = users.find((user) => {
    return user.id === parseInt(id);
  });
  if (user) {
    res.write(JSON.stringify(user));
  } else {
    res.statusCode = 404;
    res.write(JSON.stringify({ message: "User not found" }));
  }
  res.end();
};

//Route Handler for a POST /api/users
const createUserHandler = (req, res) => {
  let body = "";

  //listen for data
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    const newUser = JSON.parse(body); //Turning JSON to Js object
    users.push(newUser);
    res.statusCode = 201;
    res.write(JSON.stringify(newUser));
    res.end();
  });
};

//Not Found handler
const notFoundHandler = (req, res) => {
  res.statusCode = 404;
  res.write(JSON.stringify({ message: "Route not found" }));
  res.end();
};

//This is how a RESTful API is made using core Node js
//When you use some library or framework such as Express writing API is way easier
//Writing the BE code is too easy in that
// const server = createServer((req, res) => {
//   if (req.url === "/api/users" && req.method == "GET") {
//     res.setHeader("Content-Type", "application/json");
//     res.write(JSON.stringify(users));
//     res.end();
//   } else if (req.url.match() && req.method == "GET") {
//     res.setHeader("Content-Type", "application/json");
//     const id = req.url.split("/")[3];
//     const user = users.find((user) => {
//       return user.id === parseInt(id);
//     });
//     res.setHeader("Content-Type", "application/json");
//     if (user) {
//       // res.setHeader("Content-Type", "application/json");
//       res.write(JSON.stringify(user));
//       // res.end();
//     } else {
//       // res.setHeader("Content-Type", "application/json");
//       res.statusCode = 404;
//       res.write(JSON.stringify({ message: "User not found" }));
//       // res.end();
//     }
//     res.end();
//   } else {
//     res.setHeader("Content-Type", "application/json");
//     res.statusCode = 404;
//     res.write(JSON.stringify({ message: "Route not found" }));
//     res.end();
//   }
// });

// const server = createServer((req, res) => {
//   logger(req, res, () => {
//     if (req.url === "/api/users" && req.method == "GET") {
//       res.setHeader("Content-Type", "application/json");
//       res.write(JSON.stringify(users));
//       res.end();
//     } else if (req.url.match() && req.method == "GET") {
//       res.setHeader("Content-Type", "application/json");
//       const id = req.url.split("/")[3];
//       const user = users.find((user) => {
//         return user.id === parseInt(id);
//       });
//       res.setHeader("Content-Type", "application/json");
//       if (user) {
//         // res.setHeader("Content-Type", "application/json");
//         res.write(JSON.stringify(user));
//         // res.end();
//       } else {
//         // res.setHeader("Content-Type", "application/json");
//         res.statusCode = 404;
//         res.write(JSON.stringify({ message: "User not found" }));
//         // res.end();
//       }
//       res.end();
//     } else {
//       res.setHeader("Content-Type", "application/json");
//       res.statusCode = 404;
//       res.write(JSON.stringify({ message: "Route not found" }));
//       res.end();
//     }
//   });
// });
const server = createServer((req, res) => {
  logger(req, res, () => {
    jsonMiddleware(req, res, () => {
      if (req.url === "/api/users" && req.method === "GET") {
        getUsersHandler(req, res);
      } else if (/^\/api\/users\/\d+$/.test(req.url) && req.method === "GET") {
        getUserByIdHandler(req, res);
      } else if (req.url === "/api/users" && req.method === "POST") {
        createUserHandler(req, res);
      } else {
        notFoundHandler(req, res);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server Listening on port ${PORT}`);
});
