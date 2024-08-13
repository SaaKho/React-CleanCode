const characters = [
  {
    name: "Luke Skywalker",
    height: "172",
    mass: "77",
    eye_color: "blue",
    gender: "male",
  },
  {
    name: "Darth Vader",
    height: "202",
    mass: "136",
    eye_color: "yellow",
    gender: "male",
  },
  {
    name: "Leia Organa",
    height: "150",
    mass: "49",
    eye_color: "brown",
    gender: "female",
  },
  {
    name: "Anakin Skywalker",
    height: "188",
    mass: "84",
    eye_color: "blue",
    gender: "male",
  },
];

//***Filter***/
//Find all the characters of star wars with mass greater than 100
const charactersGreaterThan100 = characters.filter((characters) => {
  return characters.mass > 100;
});
// console.log(charactersGreaterThan100);

//Get all characters with height less than 200
const characterHeight = characters.filter((characters) => {
  return characters.height < 200;
});

// console.log(characterHeight);

//Get all male characters
const maleCharacters = characters.filter((characters) => {
  return (characters.gender = "male");
});
// console.log(maleCharacters)

//Get all female characters
const femaleCharacters = characters.filter((characters) => {
  return (characters.gender = "female");
});
// console.log(femaleCharacters)

//****MAP***/
//Iterates through the entire array and returns a new transformed array

//Get just the names of all the characters
const nameOfCharacters = characters.map((characters) => {
  return characters.name;
});
// console.log(nameOfCharacters);

//Get Array of all the heights
const height = characters.map((characters) => {
  return characters.height;
});
// console.log(height);

//Get array of objects with just name and height properties
const nameAndHeight = characters.map((characters) => ({
  name: characters.name,
  height: characters.height,
}));

//console.log(nameAndHeight);

//Get all the first names
const firstname = characters.map(characters=>
  characters.name.split(" ")[0])
//console.log(firstname);



//***REDUCE****/
//Get the total weight of all the characters

const totalWeight = characters.reduce((accumalated, current)=>
   accumalated + current.mass, 0)
console.log(totalWeight);