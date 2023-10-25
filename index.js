import { watchEffect } from "./reactive.js";
import { mount, patch } from "./render.js";

function createApp(rootCompoment) {
  return {
    mount(select) {
      const container = document.querySelector(select);
      let isMount = false;
      let oldVnode = null;

      watchEffect(() => {
        if (!isMount) {
          oldVnode = rootCompoment.runder();
          mount(oldVnode, container);
          isMount = true;
        } else {
          const newVnode = rootCompoment.runder();
          patch(oldVnode, newVnode);
          oldVnode = newVnode;
        }
      });
    },
  };
}

export { createApp };
