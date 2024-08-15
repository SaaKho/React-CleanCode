import http from "http";
const PORT = 8080; //Can be done using a .env file and that we can add that in a .gitignore file to avoid pushing them to the
//git repo

//Commonly what happens is that you dont res.end a html tag you read from a file so lets try doing that using a fs module
//There are multiple ways to import the fs module
//Asynchronously and also using Promises currently i am doing it using a Promise
import fs from "fs/promises";
import url from "url";
import path from "path";
import { error } from "console";

//Lets create our own file and dir name variables
const __filename = url.fileURLToPath(import.meta.url); //simply turns file url to path
const __dirname = path.dirname(__filename);
// console.log(__dirname, __filename);

//Usually while using Common js you need to make sure that you know the filepath and directory path
// you have access to variables in such as
// __dirname
// __filename
//But using ES modules we dont have access to these so we wukk gave to make our own

const server = http.createServer(async (req, res) => {
  //Lets create a router that checks for the type of API request such as GET,POST PUT and DELETE
  try {
    if (req.method === "GET") {
      let filePath;
      if (req.url == "/") {
        filePath = path.join(__dirname, "public", "index.html");
        //The problem in the if conditions is that we are repeating it a lot of time
        //and hardly anyone writes html directly as response so lets import or use the files we have created
        // res.writeHead(200, { "Content-Type": "text/html" });
        // res.end("<h1>Homepage</h1>");
      } else if (req.url === "/about") {
        filePath = path.join(__dirname, "public", "about.html");
        // res.writeHead(200, { "Content-Type": "text/html" });
        // res.end("<h1>About Us</h1>");
      } else {
        throw new error("File Not Found");
        // res.writeHead(404, { "Content-Type": "text/html" });
        // res.end("<h1>Page Not Found</h1>");
      }
      const data = await fs.readFile(filePath);
      res.setHeader("Content-Type", "text/html");
      res.write(data);
      res.end();
    } else {
      throw new Error("Method not allowed");
    }
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Server Error");
  }

  //Lets create a little router for ourselves. Using Express or some other framework we can do this easily but in
  //Nodejs we need to set it up manually so below is the code for it
  //This routing is only testing for the URL and not the type of API requests such as GET or POST
  //We will create that as well

  // if (req.url == "/") {
  //   res.writeHead(200, { "Content-Type": "text/html" });
  //   res.end("<h1>Homepage</h1>");
  // } else if (req.url === "/about") {
  //   res.writeHead(200, { "Content-Type": "text/html" });
  //   res.end("<h1>About Us</h1>");
  // } else {
  //   res.writeHead(404, { "Content-Type": "text/html" });
  //   res.end("<h1>Page Not Found</h1>");
  // }

  // res.write('Hello I hope this is working');
  // res.end();
  // console.log(req.url);
  // console.log(req.method);

  // res.writeHead(200, { "Content-Type": "text/html" });
  // res.write("<h1>Hello I hope this is working</h1>");
  // res.setHeader("Content-Type", "text/html");
  // res.statusCode(404);
  // console.log(object);
  // res.end();
});

server.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});
