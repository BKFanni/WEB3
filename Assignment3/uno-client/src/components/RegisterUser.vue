<template>
  <div class="auth-container">
    <h2>Register</h2>
    <form @submit.prevent="register">
      <div>
        <label>Username:</label>
        <input v-model="username" type="text" required />
      </div>
      <div>
        <label>Password:</label>
        <input v-model="password" type="password" required />
      </div>
      <button type="submit">Register</button>
    </form>
    <p>{{ message }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      message: '',
    };
  },
  methods: {
    async register() {
      try {
        const response = await axios.post('http://localhost:3000/api/auth/register', {
          username: this.username,
          password: this.password,
        });
        // Save the JWT token to localStorage for future requests
        localStorage.setItem('token', response.data.token);
        this.message = 'Registration successful!';
        this.$router.push('/'); // Redirect to the game lobby after registration

        // Example of using this.$socket to send data to the server after registration
        this.$socket.emit('userRegistered', { username: this.username });
      } catch (error) {
        if (error.response && error.response.data && error.response.data.errors && error.response.data.errors[0]) {
          this.message = error.response.data.errors[0].msg;
        } else {
          this.message = 'Registration failed';
        }
      }
    }
  }
};
</script>


<style scoped>
/* Add some styles for the registration form */
.auth-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
}

form div {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #218838;
}

p {
  text-align: center;
  margin-top: 15px;
}
</style>
