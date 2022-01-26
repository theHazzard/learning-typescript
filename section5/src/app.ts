interface Person {
   name: string;
   age: number;
   
   greet(phrase: string): void;
}

// type check with interfaces
let user1: Person;
user1 = {
  name: 'Enzo',
  age: 22,

  greet(phrase: string) {
    console.log(`${phrase} ${this.name}`);
  }
}

user1.greet('Hello there!');

// interfaces with classes
interface Named {
  readonly name: string;
  outputName?: string; // it's optional to declare on implementation
}

interface Greetable extends Named {
  greet(phrase: string): void;
}

class Person implements Greetable {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  greet(phrase: string): void {
    console.log(`${phrase} ${this.name}`);
  }
}

user1 = new Person('Laura');

// next line is not allowed 
// user1.name = 'Enzo';

user1.greet('Hello there!');

console.log(user1);

// Interfaces as function types
/// with types
type AddFn = (a: number, b: number) => number;

let add: AddFn;

add = (n1: number, n2: number) => {
  return n1 + n2;
}

/// with interfaces
interface IAddFn {
  (a: number, b: number): number; 
}

let add2: IAddFn = (n1: number, n2: number) => {
  return n1 + n2;
};

