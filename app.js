import * as pages from "./pages/index.js";
import clickEvents from "./assets/js/events/click.js";
import scrollEvents from "./assets/js/events/scroll.js";
import store from "./assets/js/store.js";

export default {
  name: "App",

  setup() {
    // ? importing Events for the app
    clickEvents.methods.click();
    scrollEvents.methods.scroll();
    const { watchEffect, onMounted, ref } = Vue;
    const page = ref(null);

    // * store management: save $variables to localstorage
    onMounted(() => {
      window.addEventListener("beforeunload", () => {
        Object.keys(store).forEach(function (key) {
          if (key.charAt(0) == "$") {
            localStorage.setItem(key, store[key]);
          } else {
            localStorage.removeItem("$" + key);
          }
        });
      });
      Object.keys(store).forEach(function (key) {
        if (key.charAt(0) == "$") {
          if (localStorage.getItem(key)) store[key] = localStorage.getItem(key);
        }
      });
    });

    //url management
    watchEffect(() => {
      const urlpage = window.location.pathname.split("/").pop();
      if (page.value == null) {
        page.value = urlpage;
      }
      if (page.value != urlpage) {
        const url = page.value ? page.value : "./";
        window.history.pushState({ url: url }, "", url);
      }
      window.onpopstate = function () {
        page.value = window.location.pathname.split("/").pop();
      };
    });

    return { page, pages };
  },

  template: `
        <section id="menu-navigation" aria-expanded="false">
            <section>
                <i class="fe-minimize-2"></i>
            </section>
            <nav>
                <ul>
                  <li>
                    <router-link to="/">Home</router-link>
                  </li>
                  <template v-for="page, path in pages" key="page.name">
                    <li>
                    <router-link :to="path">{{ page.name }}</router-link>
                    </li>
                  </template>   
                </ul>  
            </nav>           
        </section>
        <main>
        <header>
          <a><i class="fe-menu"></i></a>
          <i id="theme-selector" class="fe-moon"></i>
        </header>
          <section id="content">
            <router-view :is="page ? pages[page] : homepage"></router-view>
          </section>
          
  <button id="arrowUp" hidden>
  <i class="fe-arrow-up"></i>
</button>
        </main>`,
};
