<template>
    <div>
      <h2>Register</h2>
      <form @submit.prevent="register">
        <input v-model="username" placeholder="Username" />
        <input v-model="password" type="password" placeholder="Password" />
        <button type="submit">Register</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: '',
        password: ''
      };
    },
    methods: {
      async register() {
        try {
          await this.$store.dispatch('register', { username: this.username, password: this.password });
          this.$router.push('/lobby');
        } catch (err) {
          console.error(err);
        }
      }
    }
  };
  </script>
  