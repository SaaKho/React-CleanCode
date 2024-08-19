// Promise = Object that manages asynchronous operations
//          Asynchronous operations such as
//          querying a file, fetching data from db
//          promise(resolved, rejected) => Asynchronous code

//the promise object promises to return a value
//Either the promise will be resolved or rejected

// function walkDog() {
//   setTimeout(() => {
//     console.log("You walk the dog");
//   }, 1500);
// }

// function cleanKitchen() {
//   setTimeout(() => {
//     console.log("You can clean the Kitchen");
//   }, 2500);
// }

// function takeTrash() {
//   setTimeout(() => {
//     console.log("No means No");
//   }, 500);
// }

//Need them to do in order so lets add the callbacks
function walkDog(callback) {
  setTimeout(() => {
    console.log("You walk the dog");
    callback();
  }, 1500);
}

function cleanKitchen(callback) {
  setTimeout(() => {
    console.log("You can clean the Kitchen");
    callback();
  }, 2500);
}

function takeTrash(callback) {
  setTimeout(() => {
    console.log("No means No");
    callback();
  }, 500);
}

// walkDog(() => {
//   cleanKitchen(() => {
//     takeTrash(() => {
//       console.log("You have finished all the chores");
//     });
//   });
// });

//This will result in a callback hell. We can simply use a promise to ignore this
//To avoid too many callbacks

function walkDog() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const dogWalked = true;
      if (dogWalked) {
        resolve("You walk the dog");
      } else {
        reject("You DIDNT");
      }
    }, 1500);
  });
}

function cleanKitchen() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const cleanKitchen = true;
      if (cleanKitchen) {
        resolve("You can clean the Kitchen");
      } else {
        reject("You DIDNT");
      }
    }, 2500);
  });
}

function takeTrash() {
  return new Promise((resolve, reject) => {
    const tookTrash = true;
    if (tookTrash) {
      resolve("No means No");
    } else {
      reject("You DIDNT");
    }
    setTimeout(() => {}, 500);
  });
}

walkDog()
  .then((value) => {
    console.log(value);
    return cleanKitchen();
  })
  .then((value) => {
    console.log(value);
    return takeTrash();
  })
  .then((value) => {
    console.log(value);
    console.log("You finished all the work");
  })
  .catch((error) => console.error(error));
