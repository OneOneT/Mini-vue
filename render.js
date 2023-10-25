//=======h函数创建Vnode========
function h(tag, props, children) {
  return {
    tag,
    props,
    children,
  };
}

//==========mount挂载Vnode==============
function mount(vnode, container) {
  //1.根据tag创建元素
  const el = (vnode.el = document.createElement(vnode.tag));

  //2.处理props
  if (vnode.props) {
    for (const key in vnode.props) {
      const value = vnode.props[key];

      //是否是事件
      if (key.startsWith("on")) {
        el.addEventListener(key.slice(2).toLocaleLowerCase(), value);
      } else {
        el.setAttribute(key, value);
      }
    }
  }

  //3.处理children
  if (vnode.children) {
    if (typeof vnode.children === "string") {
      el.textContent = vnode.children;
    } else {
      vnode.children.forEach((item) => {
        mount(item, el);
      });
    }
  }

  //挂载元素
  container.appendChild(el);
}

//============patch对比两个Vnode==============
function patch(n1, n2) {
  //1.处理tag
  if (n1.tag !== n2.tag) {
    //类型不同
    const n1Parent = n1.el.parentElement;
    n1Parent.removeChild(n1);

    mount(n2, n1Parent);
  } else {
    const el = (n2.el = n1.el);

    //2.处理props
    const newProps = n2.props || {};
    const oldProps = n1.props || {};

    // n1 ==> class:abc id:aa
    // n2 ==> class:bbb
    //添加将新的props
    for (const key in newProps) {
      const newValue = newProps[key];
      const oldValue = oldProps[key];

      if (newValue !== oldValue) {
        if (key.startsWith("on")) {
          el.addEventListener(key.slice(2).toLocaleLowerCase(), newValue);
        } else {
          el.setAttribute(key, newValue);
        }
      }
    }

    //删除旧的props
    for (const key in oldProps) {
      const value = oldProps[key];

      if (key.startsWith("on")) {
        el.removeEventListener(key.slice(2).toLocaleLowerCase(), value);
      } else {
        if (!(key in newProps)) {
          el.removeAttribute(key);
        }
      }
    }

    //3.处理children
    const oldChildren = n1.children || [];
    const newChildren = n2.children || [];

    if (typeof newChildren === "string") {
      //新节点==》string
      if (oldChildren === "string") {
        el.innerHTML = newChildren;
      } else {
        el.innerHTML = newChildren;
      }
    } else {
      //新节点==》【】
      if (oldChildren === "string") {
        el.innerHTML = "";
        newChildren.forEach((item) => {
          mount(item, el);
        });
      } else {
        //都是数组类型

        //对比相同长度的Vnode
        const commonLength = Math.min(newChildren.length, oldChildren.length);
        for (let i = 0; i < commonLength; i++) {
          patch(oldChildren[i], newChildren[i]);
        }

        //newChildren > oldChildren ==> 添加
        if (newChildren.length > oldChildren.length) {
          mount(newChildren.slice(oldChildren.length), el);
        }

        //oldChildren > newChildren ==> 删除
        if (oldChildren.length > newChildren.length) {
          oldChildren.slice(newChildren.length).forEach((item) => {
            el.removeChild(item);
          });
        }
      }
    }
  }
}

export { h, mount, patch };
