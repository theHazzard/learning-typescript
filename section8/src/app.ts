// Decorators
// Meta-Programming
function Logger(constructorFn: Function) {
  console.log('Logging...');
  console.log(constructorFn);
}

@Logger
class Person {
  name = 'Enzo';

  constructor() {
    console.log('Creating a person');
  }
}

const pers = new Person();

console.log(pers);



// Decorator factory
function Logger2(logString: string) {
  return (constructorFn: Function) => {
    console.log(logString);
    console.log(constructorFn);
  }
}

@Logger2('LOGGING - PERSON')
class Person2 {
  name = 'Enzo';

  constructor() {
    console.log('Creating a person');
  }
}

const pers2 = new Person2();

console.log(pers2);



// - 
function WithTemplate(template: string, hookId: string) {
  return (constructorFn: any) => {
    const p = new constructorFn();
    const element = document.getElementById(hookId);
    if (element) {
      element.innerHTML = template;
      element.querySelector('h1')!.append(p.name);
    }
  }
}

@WithTemplate('<h1>My Person Object</h1>', 'app')
class Person3 {
  name = 'Enzo';

  constructor() {
    console.log('Creating a person');
  }
}


// Multiple decorators
@Logger2('Logger 1')
@Logger2('Logger 2')
@Logger2('Logger 3')
class Something {
}

// --
function Log(target: any, propertyName: string | Symbol) {
  console.log('Property Decorator');
  console.log(target);
  console.log(propertyName);
}

function Log2(target: any, accesorName: string | Symbol, descriptor: PropertyDescriptor) {
  console.log('Accessor Decorator');
  console.log(target);
  console.log(accesorName);
  console.log(descriptor);
}

function Log3(target: any, methodName: string | Symbol, descriptor: PropertyDescriptor) {
  console.log('Method Decorator');
  console.log(target);
  console.log(methodName);
  console.log(descriptor);
}

function Log4(target: any, funcitonName: string | Symbol, position: number) {
  console.log('Property Decorator');
  console.log(target);
  console.log(funcitonName);
  console.log(position);
}

class Product {
  @Log
  title: string;
  private _price: number;

  @Log2
  set price(val: number) {
    if (val <= 0) {
      throw new Error('Invalid price - should be greater than 0');
    }
    this._price = val;
  }

  constructor(t: string, p: number) {
    this.title = t;
    this._price = p;
  }

  @Log3
  getPriceWithTax(@Log4 tax: number) {
    return this._price * (1 + tax);
  }
}


// returning from decorators
function WithTemplate2(template: string, hookId: string) {
  return function<T extends {new(...args: any[]): {name: string}}> (constructorFn: T) {
      return class extends constructorFn {
      constructor(...args: any[]) {
        super(...args);

        const element = document.getElementById(hookId);
        if (element) {
          element.innerHTML = template;
          element.querySelector('h1')!.append(this.name);
        }
      }
    }
  }
}

@WithTemplate2('<h1>Hello there</h1>', 'app')
class Test {
  name="Enzo"
}

const t = new Test();


// Creating an AutoBind with decorators
function Autobind(_target: any, _methodName: string | Symbol, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  return {
    configurable: true,
    enumerable: false,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn
    },
  };
}
class Printer {
  message = 'This works!';

  @Autobind
  showMessage() {
    console.log(this.message);
  }
}

const p = new Printer();

const button = document.querySelector('button')!;

// without the autobind decorator
// button.addEventListener('click', p.showMessage.bind(p))
button.addEventListener('click', p.showMessage);




// Validation Decorator
// Required
interface ValidatorConfig {
  [property: string]: {
    [validatableProp: string]: string[]
  }
}

const registeredValidators: ValidatorConfig = {};

function Required(target: any, propName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: ['required'],
  }
}

function PositiveNumber(target: any, propName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: ['positive'],
  }
}

function validate(obj: any) {
  const objValidatorConfig = registeredValidators[obj.constructor.name];
  if (!objValidatorConfig) {
    return true
  }

  let isValid = true;
  for (const prop in objValidatorConfig) {
    for (const validator of objValidatorConfig[prop]) {
      switch (validator) {
        case 'required': 
          isValid = isValid && !!obj[prop];
          break;
        case 'positive': 
          isValid = isValid && obj[prop] > 0;
          break;
      }
    }
  }
  return isValid;
}

class Course {
  @Required
  title: string;
  @PositiveNumber
  price: number;

  constructor(t: string, p: number) {
    this.title = t;
    this.price = p;
  }
}

const courseForm = document.querySelector('form')!;

courseForm.addEventListener('submit', event => {
  event.preventDefault();
  const titleEl = document.getElementById('title') as HTMLInputElement;
  const priceEl = document.getElementById('price') as HTMLInputElement;

  const title = titleEl.value;
  const price = +priceEl.value;

  const createdCourse = new Course(title, price);
  if (!validate(createdCourse)) {
    alert('Invalid input, please try again');
    return
  };
  console.log(createdCourse);
});