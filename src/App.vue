<template>
  <v-app>
    <nav id="nav">
      <ul class="items">
          <li :class="$route.path === '/' ? 'item active' : 'item'">
          <router-link to="/">
            Home
          </router-link>
          </li>

          <li :class="$route.path === '/menu' ? 'item active' : 'item'">
          <router-link to="/menu">
            Menu
          </router-link>
          </li>

          <li :class="$route.path === '/about' ? 'item active' : 'item'">
          <router-link to="/about">
            About
          </router-link>
          </li>

        </ul>

        </nav>
        <span class="target inactive" />
    <v-main>
      <div id="router-view">
        <router-view :key="$route.fullPath" />
      </div>
    </v-main>
  </v-app>
</template>

<script>

  
export default {
  name: 'App',
  mounted: function() {

    /* code for shifting nav menu underline */
    const target = document.querySelector(".target");
    const links = document.querySelectorAll("#nav a");

    if (document.querySelector('#nav .item.active')) {
      document.querySelector('#nav .item.active').classList.add("active--hover");
      const rect = document.querySelector('#nav .item.active a').getBoundingClientRect();
    
      target.style.width = `${rect.width}px`;
      target.style.height = `${rect.height}px`;
      target.style.top = `${rect.top + 10}px`;
      target.style.left = `${rect.left}px`;
    }
   
    function mouseenterFunc() {
      if (!this.parentNode.classList.contains("active--hover")) {
        for (let i = 0; i < links.length; i++) {
          if (links[i].parentNode.classList.contains("active--hover")) {
            links[i].parentNode.classList.remove("active--hover");
          }
        }

        this.parentNode.classList.add("active--hover");
        this.style.opacity = "1";

        const rect = this.getBoundingClientRect();

        target.classList.remove('inactive');
        target.style.width = `${rect.width}px`;
        target.style.height = `${rect.height}px`;
        target.style.top = `${rect.top + 10}px`;
        target.style.left = `${rect.left}px`;
      }
    }

    function mouseoutFunc() {
        this.parentNode.classList.remove('active--hover');

        if (document.querySelector('#nav .item.active')) {
          const rect = document.querySelector('#nav .item.active a').getBoundingClientRect();

          target.classList.remove('inactive');
          target.style.width = `${rect.width}px`;
          target.style.height = `${rect.height}px`;
          target.style.top = `${rect.top + 10}px`;
          target.style.left = `${rect.left}px`;

          document.querySelector('#nav .item.active').classList.add("active--hover");
        } else {
          target.classList.add('inactive');
        }

    }

 

    for (let i = 0; i < links.length; i++) {
      links[i].addEventListener("click", (e) => e.preventDefault());
      links[i].addEventListener("mouseenter", mouseenterFunc);
      links[i].addEventListener("mouseout", mouseoutFunc);
    }
    
    //nav.addEventListener("mouseout", mouseoutNavFunc());
    /* end shifting nav menu underline */
  }
}
</script>

<style>
@import './assets/css/style.css';
</style>
