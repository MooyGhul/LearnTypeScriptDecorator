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
  return function<T extends {new (...args:any[]):{name:string}}>(originalConstructor: T) {
    // const hookEl = document.getElementById(hookId);
    // const p = new originalConstructor();
    // if (hookEl) {
    //   hookEl.innerHTML = template;
    //   hookEl.querySelector('h1')!.textContent=p.name;
    // }

    // class decortor can return a constructor which will replace the old one
    // class is syntax suger allows you to create a constructor function here
    // I am returning a new class (actually a sugar for constructor function) 
    //    which based on the original constructor function, so that keep all properties 
    //    of the original class and constructor function.
    // return function (constructor: any) { ... return class extends constructor{} }
    // can add new functionalities:
    // for example add new constructor, remember to rename parameter 
    // from constructor to originalConstructor to avoid conflicts
    // add super() in the new constructor, and other logics

    // Overall , we try to replace the construction by adding a decorator with class and new constructor
    //   where still execute the old logic and also new logic, after the change, the template only rendered during object instantiation.

    // 
    return class extends originalConstructor {
      constructor(..._:any) {
        super();
        const hookEl = document.getElementById(hookId);
        // const p = new originalConstructor();
        if (hookEl) {
          hookEl.innerHTML = template;
          // because I dont call my constructor any more
          hookEl.querySelector('h1')!.textContent= this.name;//p.name;
        }
      }
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



function Autobind(_: any, _1:string, descriptor:PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable:false,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    }
  }
  return adjDescriptor;
}


class Printer {
  message = 'This Works!';
  
  @Autobind
  showMessage() {
    console.log(this.message);
  }
}

const p = new Printer();

const button = document.querySelector('button');
// ??? WHY not p.showMessage()
// not showing correctly, because this will aim to the target of event
button?.addEventListener('click',p.showMessage);



