//==============依赖搜集===============
class Depend {
  constructor() {
    this.reactivesFn = new Set();
  }

  depend(fn) {
    if (fn) {
      this.reactivesFn.add(fn);
    }
  }

  notify() {
    if (this.reactivesFn) {
      this.reactivesFn.forEach((fn) => {
        fn();
      });
    }
  }
}

//=============自动搜集依赖函数===============
const objMap = new WeakMap();
function getDep(obj, key) {
  let map = objMap.get(obj);
  if (!map) {
    map = new Map();
    objMap.set(obj, map);
  }

  let dep = map.get(key);
  if (!dep) {
    dep = new Depend();
    map.set(key, dep);
  }

  return dep;
}

//=============监听依赖变化===============
let reactiveFn = null;
function watchEffect(fn) {
  reactiveFn = fn;
  fn();
  reactiveFn = null;
}

//=============监听数据的变化(vue2)===============
// function reactive(obj) {
//   Object.keys(obj).forEach((key) => {
//     let value = obj[key];

//     Object.defineProperty(obj, key, {
//       get() {
//         const dep = getDep(obj, key);
//         dep.depend(reactiveFn);
//         return value;
//       },
//       set(newValue) {
//         const dep = getDep(obj, key);
//         value = newValue;
//         dep.ontify();
//       },
//     });
//   });

//   return obj;
// }

//=============监听数据的变化(vue3)===============
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key, reciver) {
      const dep = getDep(target, key);
      dep.depend(reactiveFn);

      return Reflect.get(target, key, reciver);
    },

    set(target, key, newValue, reciver) {
      Reflect.set(target, key, newValue, reciver);
      const dep = getDep(target, key);
      dep.notify();

      return true;
    },
  });
}

//--------------测试代码---------------
// const obj = reactive({
//   name: "pyy",
//   age: 20,
// });

// watchEffect(() => {
//   console.log("_____foo________");
//   console.log(obj.name);
//   console.log(obj.age);
// });

// watchEffect(() => {
//   console.log("_____bar________");
//   console.log(obj.age);
// });

// obj.name = "huge";

export { reactive, watchEffect };
