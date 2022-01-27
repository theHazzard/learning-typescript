// default generics
// example of a array of strings
// requires a type specification
// const names: Array = ['Enzo', 'Laura', 'Hopper'];

// like this
const names: Array<string> = ['Enzo', 'Laura', 'Hopper'];

// another generic type can be promise
const promise: Promise<string> = new Promise((resolve, _reject) => {
  setTimeout(() => {
    resolve('this is done!');
  }, 2000)
});

promise.then((data) => {
  // typescript knows that data is a string
  data.split(' ');
});



// Creating my own generic type
function merge<T, A>(objA: T, objB: A): T & A {
  return Object.assign(objA, objB);
}

const mergedObj = merge({ name: 'Enzo' }, { age: 33 });
const mergedObj2 = merge({ name: 'Enzo' }, { realm: 'home' });
// however it will still allow this
const mergedObj3 = merge({ name: 'Enzo' }, 5);
// typescript gives hints here now
console.log(mergedObj2.realm);
console.log(mergedObj.age);



// working with constraints
function constrainedMerge<T extends object, A extends object>(objA: T, objB: A): T & A {
  return Object.assign(objA, objB);
}

// now this is restricted
// const mergedObj4 = constrainedMerge({ name: 'Enzo' }, 5);
const mergedObj5 = constrainedMerge({ name: 'Enzo' }, { realm: 'home' });



// another generic function
interface Lengthy {
  length: number;
}

function countAndDescribe<T extends Lengthy>(element: T): [T, string] {
  let description = 'Got no value.';

  if (element.length === 1) {
    description = 'Got 1 element.'
  }

  if (element.length > 0) {
    description = `Got ${element.length} elements.`;
  }

  return [element, description]
}

console.log(countAndDescribe([]));
console.log(countAndDescribe(['Hi']));
console.log(countAndDescribe(['Hello', 'there']));
console.log(countAndDescribe('hello there'));





// The keyof property
function extractAndConvert<T extends object, K extends keyof T>(obj: T, key: K) {
  return `Value: ${obj[key]}`;
}

// will not work because 'asd' is not a key from the empty object
// console.log(extractAndConvert({}, 'asd'));
console.log(extractAndConvert({ name: 'Laura' }, 'name'));
console.log(extractAndConvert({ bunny: 'Hopper' }, 'bunny'));







// Generic Classes
class DataStorage<T> {
  private data: T[] = [];

  addItem(item: T) {
    this.data.push(item);
  }

  removeItem(item: T) {
    const foundIn = this.data.indexOf(item);
    if (foundIn != -1) {
      this.data.splice(foundIn, 1);
    }
  }

  getItems() {
    return [...this.data];
  }
}

const textStorage = new DataStorage<string>();
// will not work because we've indicated that it will hold strings
// textStorage.addItem(54);
textStorage.addItem('Enzo');
textStorage.addItem('Laura');
textStorage.addItem('Hopper');

console.log(textStorage.getItems());

const numberStorage = new DataStorage<number>();
// will not work because we've indicated that it will hold numbers
// numberStorage.addItem('asd');
numberStorage.addItem(1);
numberStorage.addItem(2);
numberStorage.addItem(3);

console.log(numberStorage.getItems());



// Built in generic types 
// Partial
interface CourseGoal {
  title: string;
  description: string;
  completeUntil: Date;
}

function createCourseGoal(title: string, description: string, date: Date): CourseGoal {
  let courseGoal: Partial<CourseGoal> = {};
  courseGoal.title = title;
  courseGoal.description = description;
  courseGoal.completeUntil = date;
  return courseGoal as CourseGoal;
}

// Readonly
const names2: Readonly<string[]> = ['Enzo', 'Laura'];

// not possible
// names2.push('Hopper');
// names2.pop();