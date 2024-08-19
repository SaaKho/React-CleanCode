console.log("Hello my name is Saadan");

//This is known as annotation once you have defined that this variable is a number
//It cannot be changed
let age: number = 20;

if (age > 30) {
  console.log("Overage");
} else {
  console.log("UnderAge");
}

let ids: number[] = [1, 2, 3, 4, 5];
let names: string[] = ["Saadan", "Wali"];
let arr: any[] = [1, 2, true, "Saadan"]; //What is the point of using any when we are using ts for strict typing

//Tuple
//With a Tuple you can speify the types in an array. We can do the same with any but one must avoid the use of any
let person: [number, string, boolean] = [1, "Saadan", false];

//Tuple Array
let employeeType: [number, String][]; // First bracket is for Tuple the empty ones are for Array//Array of Tuples
employeeType = [
  [1, "Saadan"],
  [1, "Brad"],
  [1, "Mustafa"],
  [1, "Wali"],
];

//Union// If you want the variable to store more than one datatype
let pid: number | string = 10;

//Enumeration
enum directionOne {
  Up,
  Down,
  Left,
  Right,
}

type User = {
  id: number;
  name: string;
};

const user: User = {
  id: 1,
  name: "Saadan",
};

//Functions
function addNum(num1: number, num2: number): number {
  return num1 + num2;
}
console.log(addNum(10, 2));

//Interface
interface PersonInterface {
  id: number;
  name: string;

  register(): string;
}
//Classes
class Person implements PersonInterface {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
  register() {
    return `${this.name} is now registered`;
  }
}
const newPerson = new Person(1, "Saadan");
const mike = new Person(2, "Mike Jordan");

//SubClass
class Employee extends Person {
  position: string;

  constructor(id: number, name: string, position: string) {
    super(id, name);
    this.position = position;
  }
}

const newEmployee = new Employee(5, "Ronnie", "Manager");
console.log(newEmployee.name);
console.log(newEmployee.register());

//Generics= used to build reusable components
function getArray<T>(items: T[]): T[] {
  return new Array().concat(items);
}
let numArray = getArray<number>([1, 2, 3, 4]);
let strArray = getArray<string>(["Saadan", "Shahzil", "Wali"]);
