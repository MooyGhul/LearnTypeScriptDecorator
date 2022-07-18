// convention to start with capital letter
function Logger(logMsg: string) {
  return function (constructor: Function) {
    console.log(logMsg);
    console.log(constructor);
  }

}

// @ is a special identifier TS recogonises
//    it points to a function that is a decorator (Logger)
// decorators execute before the class is defined, not when it is instantiated
// you dont need to instantiate the class at all.
@Logger('Logging PERSON...')
class Person {
  name = 'Max';
  
  constructor() {
    console.log('Creating person object...');
  }
}

const pers = new Person();

console.log(pers);