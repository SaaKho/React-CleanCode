//Async/Await= Async = makes a function return a promise
//             Await = makes an async function wait for a promise
// It helps you write asynchronous code synchronously
// Async doesnot have resolve or reject params
//Everything after await is placed in an event queue


async function walkDog() {
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


//   walkDog()
//     .then((value) => {
//       console.log(value);
//       return cleanKitchen();
//     })
//     .then((value) => {
//       console.log(value);
//       return takeTrash();
//     })
//     .then((value) => {
//       console.log(value);
//       console.log("You finished all the work");
//     })
//     .catch((error) => console.error(error));

// To avoid this long chain we can simply use async await lets see how

async function doChores() {
  try {
    const walkDogResult = await walkDog();
    console.log(walkDogResult);

    const cleanKitchenResult = await cleanKitchen();
    console.log(cleanKitchenResult);

    const takeTrashResult = await takeTrash();
    console.log(takeTrashResult);

    console.log("You have finsished all the chores");
  } catch {
    console.error(error);
  }
}

doChores();
