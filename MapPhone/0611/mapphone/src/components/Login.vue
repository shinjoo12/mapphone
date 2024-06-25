<template>
  <div class="telephone-directory">
    <div class="header-box">
      Telephone Directory
    </div>
    <div class="wrapper">
      <div class="title-text">
        <div class="title" :class="{ 'login': activeForm === 'login', 'signup': activeForm === 'signup' }"
          @click="activateLoginOrSignup">
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
              <input type="text" v-model="loginData.username" placeholder="ID" required>
            </div>
            <div class="field">
              <input type="password" v-model="loginData.password" placeholder="Password" required>
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
              <input type="password" placeholder="Confirm Password" v-model="signupData.Confirm_password" required>
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
import users from "../../assets/users.json"; // JSON 파일 불러오기

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
    activateLogin() {
      this.activeForm = 'login';
    },
    activateSignup() {
      this.activeForm = 'signup';
    },
    handleLogin() {
      const { username, password } = this.loginData;
      const user = users.find(user => user.username === username && user.password === password);
      if (user) {
        this.$router.push('/main');
      } else {
        alert('Invalid username or password');
      }
    },
    handleSignup() {
      const { username, password, confirmPassword } = this.signupData;
      if (password == confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      // 새로운 사용자 정보를 생성
      const newUser = {
        username: username,
        password: password
      };
      // JSON 파일에 새로운 사용자 정보를 추가
      users.push(newUser);
      // JSON 파일을 다시 저장 (이 부분은 클라이언트 측에서만 동작하며, 서버에서는 파일 시스템에 쓰기 권한이 필요합니다.)
      this.saveUsersToJsonFile(users);
      alert('Sign up successful. You can now log in.');
      this.activateLogin();
    },
    saveUsersToJsonFile(users) {
      // 여기서는 클라이언트 측에서 JSON 파일을 수정하는 방법을 제공하지 않습니다.
      // 실제로는 서버에서 새로운 사용자 정보를 JSON 파일에 저장하는 로직이 필요합니다.
      // 이 예제에서는 이를 시뮬레이션하기 위해 localStorage를 사용합니다.
      localStorage.setItem('users', JSON.stringify(users));
    }
  }
};
</script>



<style scoped>
/* 스타일 코드 */
</style>
