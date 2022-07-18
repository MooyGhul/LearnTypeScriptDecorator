// convention to start with capital letter
function Logger(logMsg: string) {
  return function (constructor: Function) {
    console.log(logMsg);
    console.log(constructor);
  }

}

// render some template which should be some HTML code 
//  into some place in the DOM, where I find this hookID
function WithTemplate(template: string, hookId: string) {
  // _ tells I awares it but I dont use it
  return function(_: Function) {
    const hookEl = document.getElementById(hookId);
    if (hookEl) {
      hookEl.innerHTML = template;
    }
  }
}

function WithTemplate2(template: string, hookId: string) {
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
// @Logger('Logging class PERSON...')
@WithTemplate2('<h1>My Person Project</h1>','app')
class Person {
  name = 'Max';
  
  constructor() {
    console.log('Creating person object...');
  }
}

const pers = new Person();

console.log(pers);