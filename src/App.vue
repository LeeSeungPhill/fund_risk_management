<template>
  <div class="app-container">
    <Header></Header>
    <div class="router-container">
      <router-view></router-view>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "./components/Trading_Header.vue";
import Footer from "./components/Trading_Footer.vue";

export default {
  name: 'App',

  components: {
    Header,
    Footer,
  },

  data: () => ({
    //
  }),
}
</script>
<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.router-container {
  flex: 1;
  overflow-y: auto;
}
</style>
