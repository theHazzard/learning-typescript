// Intersection Types
type Admin = {
  name: string;
  privileges: string[];
};

type Employee = {
  name: string;
  startDate: Date;
}

// this is an intersection type
type ElevatedEmployee =  Admin & Employee;

const e1: ElevatedEmployee = {
  name: 'Enzo',
  privileges: ['create-server'],
  startDate: new Date(),
};

// with interfaces
interface IAdmin {
  name: string;
  privileges: string[];
};

interface IEmployee {
  name: string;
  startDate: Date;
}

interface IElevatedEmplyee extends Employee, Admin {};

type ElevatedIEmployee = Admin & Employee;


// with union types
type Combinable = string | number; // this is a union type
type Numeric = number | boolean;

// universal is numeric because of the union types only have that type in common
type Universal = Combinable & Numeric;

// this throws error because on an intersection of union types
// the only common is the number
// const a: Universal = true;





// Type Guards

// using typeof
function add(a: Combinable, b: Combinable) {
  if (typeof a === 'string' || typeof b === 'string') {
    return a.toString() + b.toString();
  }
  return a + b;
}

type UnknownEmployee = Employee | Admin;


// using in keyword to check property existence on an object
function printEmployeeInfo(emp: UnknownEmployee) {
  console.log('Name: ' + emp.name);
  if ('privileges' in emp) {
    console.log('Privileges: ' + emp.privileges);
  }
  if ('startDate' in emp) {
    console.log('StartDate: ' + emp.startDate);
  }
}

// using instanceof for classes
class Car {
  drive() {
    console.log('Driving...');
  }
}

class Truck {
  drive() {
    console.log('Driving a truck...');
  }

  loadCargo(amount: number) {
    console.log('Loading cargo... ' + amount);
  }
}

type Vehicle = Car | Truck;

const v1 = new Car();
const v2 = new Truck();

function useVehicle(vehicle: Vehicle) {
  vehicle.drive();
  //this can be also done
  // if ('loadCargo' in vehicle) {
  //   vehicle.loadCargo(1000);
  // } 

  if (vehicle instanceof Truck) {
    vehicle.loadCargo(1000);
  }

  // instanceof would work for classes
  // but not for interfaces, because classes
  // end up compiled to constructor functions
  // and can be checked at execution time
  // but interfaces does not
}

useVehicle(v1);
useVehicle(v2);


// Discriminated Unions
// also works with classes
interface Bird {
  type: 'bird';
  flyingSpeed: number
}

interface Horse {
  type: 'horse';
  runningSpeed: number;
}

type Animal = Bird | Horse;

function moveAnimal(animal: Animal) {
  // cant do this because interfaces does not
  // exists on execution time
  // if (animal instanceof Bird) {
  //   console.log('Moving with speed: ' + animal.flyingSpeed);
  // }

  // we can do the in check, but typing each of them on
  // can be a burden if they are a lot of types involved
  
  let speed;
  switch (animal.type) {
    case 'bird':
      speed = animal.flyingSpeed;
      break;
    case 'horse':
      speed = animal.runningSpeed;
      break;
  }

  console.log('Moving at speed: ' + speed);
}

moveAnimal({ type: 'bird', flyingSpeed: 10 });
moveAnimal({ type: 'horse', runningSpeed: 50 });


// Type Casting
// this is a paragraph on the dom that typescript does not
// know about its specific type

// knows it's a paragraph because we are using a selector
// because we are using p as the query selector
const paragraph1 = document.querySelector('p');

// here does not know the specific type
// so it infers that is an HTMLElement
const paragraph2 = document.getElementById('message-output'); 

// now with an input
// as Typescript cannot identify the specific HTMLElement
// you don't have specific completion when using it
const input = document.getElementById('user-input')!;
// so it does not know that it has a value property
//  input.value = 'Hello there!';

// 1st way
const inputWithType1 = <HTMLInputElement>document.getElementById('user-input');
inputWithType1.value = 'Hello there!';

// 2nd way
// using the ! sign to ensure typescript that the value will not be null
// can lead to runtime errors
const inputWithType2 = document.getElementById('user-input')! as HTMLInputElement;
inputWithType2.value = 'Hello there!';

// 2nd way with nullish check
const inputWithType3 = document.getElementById('user-input');

if (inputWithType3) {
  (inputWithType3 as HTMLInputElement).value = 'Hello there!';
}



// Index types

interface ErrorContainer {
  [prop: string]: string;
}

const errorBag: ErrorContainer = {
  email: 'Not a valid email',
  username: 'Not a valid username',
  // test: true, // this is not allowed because of the interface above
};

// Function Overloads

function add2(a: Combinable, b: Combinable) {
  if (typeof a === 'string' || typeof b === 'string') {
    return a.toString() + b.toString();
  }
  return a + b;
}

// typescript does not know that it returns specifically a number
const result1 = add(1, 5);
// neither if returns specifically a string so it thinks that split does not exists
// on a combinable (because can be a number or a string)
const result2 = add('Enzo', 'Strongoli');
//result2.split(' ');

// can be fix like this 
const result3 = add('Enzo ', 'Strongoli') as string;
result3.split(' ');


// or you can do function overloading to specify differnt signatures
// that are more specific depending on the values it receives
function add3(a: number, b: number): number;
function add3(a: string, b: string): string;
function add3(a: Combinable, b: Combinable) {
  if (typeof a === 'string' || typeof b === 'string') {
    return a.toString() + b.toString();
  }
  return a + b;
}

// it works because it knows that if it receives 2 strings, it will return a string
const result4 = add3('Enzo', ' Strongoli');
result4.split(' ');



// Optional Chaining
// imagine this user comes from a fetch, so we don't know what we are receiving
const fetchedUserData = {
  id: 'u1',
  name: 'Lau',
  job: { title: 'CFO', description: 'in charge of spendings (?' }
}

// as data comes from other source, it might not have the job property
console.log(fetchedUserData?.job?.title);

// Nullish Coalesing
const userInput = '';

// this example will return DEFAULT because userinput is a falsy value
const storedData = userInput || 'DEFAULT'; // value is DEFAULT

// if you want to be more specific with null types only you can do this
const userInput2 = '';
const userInput3 = null;
const storedData2 = userInput ?? 'DEFAULT'; // value is ''
const storedData3 = userInput ?? 'DEFAULT'; // value is DEFAULT


