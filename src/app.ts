// convention to start with capital letter
function Logger(logMsg: string) {
  console.log(1);
  return function (constructor: Function) {
    console.log(logMsg);
    console.log(constructor);
  }

}

// render some template which should be some HTML code 
//  into some place in the DOM, where I find this hookID
function WithTemplate(template: string, hookId: string) {
  console.log(2);
  // _ tells I awares it but I dont use it
  return function(_: Function) {
    const hookEl = document.getElementById(hookId);
    if (hookEl) {
      hookEl.innerHTML = template;
    }
  }
}

function WithTemplate2(template: string, hookId: string) {
  console.log(3);
  return function(constructor: any) {
    const hookEl = document.getElementById(hookId);
    const p = new constructor();
    if (hookEl) {
      hookEl.innerHTML = template;
      hookEl.querySelector('h1')!.textContent=p.name;
    }
  }
}

// @ is a special identifier TS recogonises
//    it points to a function that is a decorator (Logger)
// decorators execute before the class is defined, not when it is instantiated
// you dont need to instantiate the class at all.
@Logger('Logging class PERSON...')
@WithTemplate('<h2>My Person Project</h2>','app')
@WithTemplate2('<h1>My Person Project</h1>','app')
class Person {
  name = 'Max';
  
  constructor() {
    console.log('Creating person object...');
  }
}

const pers = new Person();

console.log(pers);


// ---

// not a decorator factory, only a decorator
// add decorator to a property receives 2 args:
//  1. target to the property, 
//      1.1 if it is an instance (title : string;), it will be the prototype of the object
//      1.2 if it is a static property here, target would refer to the constructor function instead
// The decorator executes when you define this property to JavaScript as part of your class
//  as part of the constructor function. Not need to instantiate the class
function Log(target: any, propertyName: string) {
  console.log('Property decorator');
  console.log(target, propertyName);  // prototype of the obj, title
}

// Accessor decorator
function Log2(target: any, name: string, descriptor: PropertyDescriptor) {
  console.log('Accessor decorator');
  console.log(target);  // prototype of the obj
  console.log(name);  // name of the accessor
  console.log(descriptor); // property descriptor
}

// Method Descriptor
function Log3(target: any, name: string | symbol, descriptor: PropertyDescriptor) {
  console.log('Method decorator');
  console.log(target);  // prototype of the obj
  console.log(name);  // name of the accessor
  console.log(descriptor); // property descriptor
}

// Param decorator
function Log4(target: any, name: string | symbol, position: number) {
  console.log('Param decorator');
  console.log(target);  // prototype of the obj
  console.log(name);  // name of the method uses this param
  console.log(position); // 0th, 1st, 2nd, 3rd of the param
}

class Product {

  // add decorator to a property
  @Log
  title : string;
  private _price: number;

  @Log2
  set price(val:number) {
    if(val>0) {
      this._price = val;
    } else {
      throw new Error('Invalid price - should be positive');
    }
  }
  constructor(t:string, p:number) {
    this.title = t;
    this._price = p;
  }

  @Log3
  getPriceWithTax(@Log4 tax:number) {
    return this.price*(1+tax);
  }
}