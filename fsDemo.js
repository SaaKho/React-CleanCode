// import fs from "fs";
//For the promise ver sion of the file system
import fs from "fs/promises";

//readFile() - callback
// fs.readFile("./someFile.txt", "utf-8", (err, data) => {
//   if (err) throw error;
//   console.log(data);
// });

//readFileSync()- synchronous version
//Use when there is a small file and non blocking way to manage your work
// fs.readFileSync("./someFile.txt", "utf-8");
// console.log(data);

//We can use this way to manage the Promises way of the fs module
// fs.readFile("./someFile.txt", "utf-8")
//   .then((data) => console.log(data))
//   .catch((err) => console.log(err));

//The Async Await way of reading the file

const readFile = async () => {
  try {
    const data = await fs.readFile("./someFile.txt", "utf-8");
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

//writeFile using Async Await

const writeFile = async () => {
  try {
    const data = await fs.writeFile(
      "./someFile.txt",
      "Hello I am writing to this file"
    );
    console.log("The previous data has been overwritten");
  } catch (error) {
    console.log(error);
  }
};

//If i dont want to overwrite and i just want to append i can use the append method
const appendFile = async () => {
  try {
    await fs.appendFile(
      "./someFile.txt",
      "\nPlease add this also in the file\n"
    );
    console.log("File has been appeneded");
  } catch (error) {
    console.log(error);
  }
};

writeFile();
appendFile();
readFile();
