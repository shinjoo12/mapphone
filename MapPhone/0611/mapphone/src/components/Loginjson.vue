<template>
  <div class="telephone-directory">
    <div class="header-box">Telephone Directory</div>
    <div class="wrapper">
      <div class="title-text">
        <div class="title" :class="{ 'login': activeForm === 'login', 'signup': activeForm === 'signup' }" @click="activateLoginOrSignup">
          {{ activeForm.toUpperCase() }}
        </div>
      </div>
      <div class="form-container">
        <div class="slide-controls">
          <input type="radio" name="slide" id="login" v-model="activeForm" value="login">
          <input type="radio" name="slide" id="signup" v-model="activeForm" value="signup">
          <label for="login" class="slide login">LOGIN</label>
          <label for="signup" class="slide signup">SIGNUP</label>
          <div class="slider-tab"></div>
        </div>
        <div class="form-inner">
          <form action="#" class="login" v-if="activeForm === 'login'" @submit.prevent="handleLogin">
            <div class="field">
              <input type="text" placeholder="ID" v-model="loginData.username" required>
            </div>
            <div class="field">
              <input type="password" placeholder="Password" v-model="loginData.password" required>
            </div>
            <div class="pass-link">
              <a href="#">Forgot password?</a>
            </div>
            <div class="field btn">
              <div class="btn-layer"></div>
              <input type="submit" value="Login">
            </div>
          </form>
          <form action="#" class="signup" v-else @submit.prevent="handleSignup">
            <div class="field">
              <input type="text" placeholder="ID" v-model="signupData.username" required>
            </div>
            <div class="field">
              <input type="password" placeholder="Password" v-model="signupData.password" required>
            </div>
            <div class="field">
              <input type="password" placeholder="Confirm Password" v-model="signupData.confirmPassword" required>
            </div>
            <div class="field btn">
              <div class="btn-layer"></div>
              <input type="submit" value="Sign Up">
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../css/login.css";

export default {
  data() {
    return {
      activeForm: 'login',
      loginData: {
        username: '',
        password: ''
      },
      signupData: {
        username: '',
        password: '',
        confirmPassword: ''
      }
    };
  },
  methods: {
    activateLoginOrSignup() {
      this.activeForm = this.activeForm === 'login' ? 'signup' : 'login';
    },
    handleLogin() {
      fetch(`${import.meta.env.VITE_API_URL}/users?username=${this.loginData.username}&password=${this.loginData.password}`)
        .then(response => response.json())
        .then(data => {
          if (data.length > 0) {
            this.$router.push('/main');
          } else {
            alert('Invalid credentials');
          }
        });
    },
    handleSignup() {
      if (this.signupData.password !== this.signupData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }

      fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: this.signupData.username,
          password: this.signupData.password
        })
      })
        .then(response => response.json())
        .then(() => {
          alert('User registered successfully');
          this.activeForm = 'login';
        });
    }
  }
};
</script>

<style scoped>
/* 여기에 스타일을 추가하세요 */
</style>
