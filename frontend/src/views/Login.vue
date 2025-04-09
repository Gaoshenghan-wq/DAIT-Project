<template>
  <div class="login-container">
    <div class="row g-0 justify-content-center align-items-center vh-100 flex-column flex-md-row">
      <div class="col-md-6">
        <div class="login-image"></div>
      </div>
      <div class="col-md-6 p-5 login-col">
        <h2 class="mb-4 text-center">Login</h2>
        <form @submit.prevent="login">
          <div class="mb-3">
            <label for="email" class="form-label">Email address</label>
            <input
              type="email"
              class="form-control rounded-pill"
              id="email"
              v-model="email"
              required
            />
          </div>
          <div class="mb-4">
            <label for="password" class="form-label">Password</label>
            <input
              type="password"
              class="form-control rounded-pill"
              id="password"
              v-model="password"
              required
            />
          </div>
          <div class="d-flex justify-content-between">
            <button type="submit" class="btn btn-primary btn-lg rounded-pill">
              Login
            </button>
            <button @click="router.push('/register')" class="btn btn-info btn-lg rounded-pill">
              Register
            </button>
          </div>
          <div v-if="error" class="text-danger text-center mt-2">
            {{ error }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'vue-router';
export default {
  data() {
    return {
      email: "",
      password: "",
      error: "",
      router: useRouter()
    };
  },
  methods: {
    async login() {
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Login failed. Please check your email and password."
          );
        }

        const data = await response.json();
        const token = data.token;
        const decoded = jwtDecode(token);
        console.log(decoded);
        localStorage.setItem("token", token);
        this.$router.push("/system");
      } catch (error) {
        this.error = error.message;
      }
    }
  }
};
</script>

<style scoped>

.login-col {
  /* background-color: #fff;
  /* border-radius: 5px; 
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1); */
}
.login-container {
  /* background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1); */
  overflow: auto;
  max-width: 900px; 
  width: 90%; 
  min-width: 300px;
}

.login-image {
  background-image: url("liamge.png");
  background-size: cover;
  background-position: center;
  min-height: 400px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .login-container {
    max-width: 100%;
    border-radius: 0;
  }

  .login-image {
    min-height: 200px;
  }
}


</style>    