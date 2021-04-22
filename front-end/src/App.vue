<template>
  <div id="app" v-if="!user">
    <div id="nav">
      <div class="nav-item">
        <router-link to="/">Home</router-link>
      </div>
      <div class="nav-item">
        <router-link to="/patch-notes">Patch Notes</router-link>
      </div>
      <div class="nav-item">
        <router-link to="/login">Login</router-link>
      </div>
      <div class="nav-item">
        <router-link to="/register">Register</router-link>
      </div>
    </div>
    <router-view/>
  </div>
  <div id="app" v-else>
    <div id="nav">
      <div class="nav-item">
        <router-link :to="updateRouteToOverview">Overview</router-link>
      </div>
      <div class="nav-item">
        <router-link :to="updateRouteToAssignments">Assignments</router-link>
      </div>
      <div class="nav-item">
        <router-link :to="updaterouteToHome" @click.native="logout">Logout</router-link>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'App',
  methods: {
    async logout () {
      try {
        await axios.delete('/api/users');
        this.$root.$data.user = null;
      } catch (error) {
        this.$root.$data.user = null;
      }
    }
  },
  async created() {
    try {
      let response = await axios.get('/api/users');
      this.$root.$data.user = response.data.user;
      
    } catch (error) {
      this.$root.$data.user = null;
    }
  },
  computed: {
    updateRouteToOverview () {
      if (this.$root.$data.user) {
        return `/overview/${this.$root.$data.user.username}`;
      } else {
        return '/';
      }
    },
    updateRouteToAssignments () {
      if (this.$root.$data.user) {
        return `/assignments/${this.$root.$data.user.username}`;
      } else {
        return '/';
      }
    },
    updaterouteToHome () {
      return '/';
    },
    user() {
      return this.$root.$data.user;
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  display: flex;
  flex-direction: row;
  padding: 30px;
  background-color: #116466;
}

#nav a {
  display: flex;
  font-weight: bold;
  text-decoration: none;
  color: #D1E8E2;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.nav-item {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  margin: 10px auto;
}
</style>
