const defaultOpts = {
  // required opts
  Vue: null,
  appOptions: null,
  template: null
};

export default function singleSpaVue(userOpts) {
  if (typeof userOpts !== "object") {
    throw new Error(`single-spa-vue requires a configuration object`);
  }

  const opts = {
    ...defaultOpts,
    ...userOpts
  };

  if (!opts.Vue) {
    throw new Error("single-spa-vuejs must be passed opts.Vue");
  }

  if (!opts.appOptions) {
    throw new Error("single-spa-vuejs must be passed opts.appOptions");
  }

  // Just a shared object to store the mounted object state
  let mountedInstances = {};

  return {
    bootstrap: bootstrap.bind(null, opts, mountedInstances),
    mount: mount.bind(null, opts, mountedInstances),
    unmount: unmount.bind(null, opts, mountedInstances),
    update: update.bind(null, opts, mountedInstances),
    mountedInstances
  };
}

function bootstrap(opts) {
  if (opts.loadRootComponent) {
    return opts.loadRootComponent().then(root => (opts.rootComponent = root));
  } else {
    return Promise.resolve();
  }
}

function mount(opts, mountedInstances, props) {
  const { keepAlive, activesApp, name } = props;
  let instance = mountedInstances[name];
  let $el = opts.appOptions.el;
  if ($el) $el = document.querySelector($el);
  return Promise.resolve().then(() => {
    if (!instance || ($el && $el.innerHTML === "")) {
      instance = {};
      const { appOptions } = opts;
      let domEl;
      if (appOptions.el) {
        if (typeof appOptions.el === "string") {
          if (!$el) {
            domEl = createElement(appOptions.el.substr(1));
            document.body.appendChild(domEl);
          } else {
            domEl = $el
          }
        } else {
          domEl = appOptions.el;
        }
      } else {
        const htmlId = `single-spa-application:${name}`;
        // CSS.escape的文档（需考虑兼容性）：https://developer.mozilla.org/zh-CN/docs/Web/API/CSS/escape
        appOptions.el = `#${CSS.escape(htmlId)}`;
        domEl = document.getElementById(htmlId);
        if (!domEl) {
          document.body.appendChild(createElement(htmlId));
        }
      }

      // appOptions.el = appOptions.el + " .single-spa-container";

      // single-spa-vue@>=2 always REPLACES the `el` instead of appending to it.
      // We want domEl to stick around and not be replaced. So we tell Vue to mount
      // into a container div inside of the main domEl
      if (!domEl.querySelector(".single-spa-container")) {
        const singleSpaContainer = document.createElement("div");
        singleSpaContainer.className = "single-spa-container";
        domEl.appendChild(singleSpaContainer);
      }

      instance.domEl = domEl;
      if (!appOptions.render && !appOptions.template && opts.rootComponent) {
        appOptions.render = h => h(opts.rootComponent);
      }

      if (!appOptions.data) {
        appOptions.data = {};
      }

      appOptions.data = { ...appOptions.data, ...props };
      instance.vueInstance = new opts.Vue(appOptions);
      if (instance.vueInstance.bind) {
        instance.vueInstance = instance.vueInstance.bind(instance.vueInstance);
      }

      mountedInstances[name] = instance;
      keepAlive && !activesApp.has(name) && activesApp.push(name);
    } else {
      instance.vueInstance.$el.style.display = "block";
    }

    return instance.vueInstance;
  });
}

function update(opts, mountedInstances, props) {
  return Promise.resolve().then(() => {
    const instance = mountedInstances[props.name];
    const data = {
      ...(opts.appOptions.data || {}),
      ...props
    };
    for (let prop in data) {
      instance.vueInstance[prop] = data[prop];
    }
  });
}

function unmount(opts, mountedInstances, props) {
  const { keepAlive, activesApp, name } = props;
  return Promise.resolve().then(() => {
    const instance = mountedInstances[name];

    if (keepAlive && activesApp && activesApp.has(name)) {
      instance.vueInstance.$el.style.display = "none";
    } else {
      instance.vueInstance.$destroy();
      instance.vueInstance.$el.innerHTML = "";
      delete instance.vueInstance;
      if (instance.domEl) {
        instance.domEl.innerHTML = "";
        delete instance.domEl;
      }
    }
    return instance;
  });
}

function createElement(id) {
  const div = document.createElement("div");
  div.id = id;
  return div;
}
