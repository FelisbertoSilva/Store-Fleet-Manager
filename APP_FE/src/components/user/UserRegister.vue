<template>
  <div class="login-page">
    <div class="content-wrapper">
      <div class="login-card">
        <h1 class="login-title">Register</h1>
        <form @submit.prevent="handleRegister" class="login-form">
          <div class="form-group">
            <div class="input-container">
              <div class="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/>
                </svg>
              </div>
              <input 
                type="text" 
                v-model="formData.username" 
                class="form-input"
                placeholder="Username"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <div class="input-container" @click="toggleRoleMenu" ref="roleContainer">
              <div class="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" fill="currentColor"/>
                </svg>
              </div>
              <div class="role-display">
                {{ formData.role || 'Select Role' }}
              </div>
              <div class="role-submenu" v-show="isRoleMenuOpen">
                <div 
                  class="role-option"
                  v-for="role in roles" 
                  :key="role.value"
                  @click="selectRole(role.value)"
                >
                  {{ role.label }}
                </div>
              </div>
            </div>
          </div>

          <div class="form-group">
            <div class="input-container">
              <div class="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z" fill="currentColor"/>
                </svg>
              </div>
              <input 
                type="password" 
                v-model="formData.password" 
                class="form-input"
                placeholder="Password"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <div class="input-container">
              <div class="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z" fill="currentColor"/>
                </svg>
              </div>
              <input 
                type="password" 
                v-model="formData.confirmPassword" 
                class="form-input"
                placeholder="Confirm Password"
                required
              />
            </div>
          </div>

          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

          <button type="submit" class="login-btn">REGISTER</button>

          <p class="register-text">
            Already have an account? 
            <router-link to="/" class="register-link">Login here</router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import UserService from "@/services/UserService";

export default {
  data() {
    return {
      formData: {
        username: "",
        role: "",
        password: "",
        confirmPassword: "",
      },
      roles: [
        { label: "Admin", value: "admin" },
        { label: "Employee", value: "employee" },
      ],
      isRoleMenuOpen: false,
      errorMessage: "",
    };
  },
  methods: {
    toggleRoleMenu() {
      this.isRoleMenuOpen = !this.isRoleMenuOpen;
    },
    selectRole(role) {
      this.formData.role = role;
      this.isRoleMenuOpen = false;
    },
    async handleRegister() {
      if (this.formData.password !== this.formData.confirmPassword) {
        this.errorMessage = "Passwords do not match!";
        return;
      }

      if (!this.formData.role) {
        this.errorMessage = "Please select a role!";
        return;
      }

      try {
        this.errorMessage = "";

        let response;
        const userData = {
          username: this.formData.username,
          password: this.formData.password,
          role: this.formData.role,
        };

        if (this.formData.role === "admin") {
          response = await UserService.registerAdmin(userData);
        } else {
          response = await UserService.registerOthers(userData);
        }

        if (response.status === 201) {
          this.$router.push("/");
        }
      } catch (error) {
        const errorResponse = error.response?.data || { message: "Registration failed!" };
        this.errorMessage = errorResponse.message || "Registration failed!";
      }
    },
  },
};
</script>


<style>
.login-page {
  background: url('/loginbackground.png') no-repeat center center fixed;
  background-size: cover;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 500px;
  padding: 60px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.login-title {
  color: white;
  font-size: 32px;
  text-align: center;
  margin-bottom: 40px;
  font-weight: 800;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 35px;
}

.form-group {
  display: flex;
  flex-direction: column;
  position: relative;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  padding: 5px 0;
  cursor: pointer;
}

.input-container:focus-within {
  border-bottom-color: rgba(255, 255, 255, 0.8);
}

.input-icon {
  color: rgba(255, 255, 255, 0.7);
  margin-right: 10px;
}

.form-input {
  width: 100%;
  padding: 10px 0;
  background: transparent;
  border: none;
  color: white;
  font-size: 16px;
  outline: none;
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

/* Role Dropdown Styling */
.role-display {
  color: rgba(255, 255, 255, 0.5);
  font-size: 16px;
  padding: 10px 0;
  flex-grow: 1;
}

.role-submenu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #1a1a1a;
  border-radius: 8px;
  padding: 8px 0;
  margin-top: 5px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  z-index: 100;
}

.role-option {
  color: #9ba1a6;
  padding: 10px 16px;
  font-size: 14px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.role-option:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.login-btn {
  background: linear-gradient(145deg, #1a1a1a, #333333);
  color: white;
  border: none;
  padding: 15px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
  margin-top: 10px;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.15);
  background: linear-gradient(145deg, #262626, #404040);
}

.login-btn:active {
  transform: translateY(0);
}

.register-text {
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

.register-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 500;
}

.register-link:hover {
  color: white;
}

@media (max-width: 768px) {
  .login-card {
    max-width: 400px;
    padding: 40px;
  }

  .login-title {
    font-size: 28px;
    margin-bottom: 30px;
  }

  .form-input {
    font-size: 15px;
  }

  .login-btn {
    padding: 12px;
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .login-card {
    max-width: 320px;
    padding: 30px;
  }

  .login-title {
    font-size: 24px;
    margin-bottom: 25px;
  }

  .form-input {
    font-size: 14px;
  }
}

.error-message {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin-top: -10px;
  margin-bottom: 20px;
  text-align: center;
}

</style>