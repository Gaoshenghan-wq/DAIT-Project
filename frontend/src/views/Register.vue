<template>
  <div class="login-container">
    <div class="row g-0 justify-content-center align-items-center vh-100 flex-column flex-md-row">
      <div class="row g-0">
        <div class="col-md-6 d-none d-md-block">
          <div class="login-image"></div>
        </div>
        <div class="col-md-6 p-5 bg-white rounded shadow">
          <h2 class="mb-4 text-center">Register</h2>
          <form @submit.prevent="register">
            <div class="mb-3">
              <label for="first_name" class="form-label">First Name</label>
              <input
                type="text"
                class="form-control rounded-pill"
                id="first_name"
                v-model="first_name"
                required
              />
            </div>
            <div class="mb-3">
              <label for="last_name" class="form-label">Last Name</label>
              <input
                type="text"
                class="form-control rounded-pill"
                id="last_name"
                v-model="last_name"
                required
              />
            </div>
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
            <div class="mb-3">
              <label for="gender" class="form-label">Gender</label>
              <select
                class="form-control rounded-pill"
                id="gender"
                v-model="gender"
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
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
            <div class="d-grid">
              <button type="submit" class="btn btn-primary btn-lg rounded-pill">
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
  </div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  data() {
    return {
      first_name: "",
      last_name: "",
      email: "",
      gender: "",
      password: "",
      error: "",
      router: useRouter()
    };
  },
  methods: {
    async register() {
      // const router = useRouter();
      try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
            gender: this.gender,
            password: this.password,
            avatar:`https://picsum.photos/100/100?random=${Math.floor(Math.random() * 100) + 1}`
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Registration failed. Please check your input."
          );
        }

        const data = await response.json();
        console.log(data);
        this.$router.push("/login");
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
  min-height: 650px;
}

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