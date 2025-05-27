<template>
  <div class="login-page">
    <div class="content-wrapper">
      <div class="login-card">
        <h1 class="login-title">Login</h1>
        <form @submit.prevent="handleSubmit" class="login-form">
          <div class="form-group">
            <div class="input-container">
              <div class="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
                    fill="currentColor" />
                </svg>
              </div>
              <input type="text" v-model="formData.username" class="form-input" placeholder="Username" />
            </div>
          </div>

          <div class="form-group">
            <div class="input-container">
              <div class="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z"
                    fill="currentColor" />
                </svg>
              </div>
              <input type="password" v-model="formData.password" class="form-input" placeholder="Password" />
            </div>
          </div>

          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

          <button type="submit" class="login-btn">LOGIN</button>

          <p class="register-text">
            Don't have an account?
            <router-link to="/register" class="register-link">Register here</router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import UserService from '@/services/UserService';

export default {
  data() {
    return {
      formData: {
        username: "",
        password: "",
      },
      errorMessage: "",
    };
  },
  methods: {
    async handleSubmit() {
      try {
        this.errorMessage = "";

        // Fazer login
        const response = await UserService.login(this.formData);

        // Atualizar informações do usuário
        await UserService.updateCurrentUserInformation();

        // Redirecionar baseado no papel do usuário
        const currentUser = UserService.getCurrentUser();

        if (currentUser.isAdmin) {
          this.$router.push('/employee/list');  // Admin vai direto para lista de funcionários
        } else if (currentUser.isEmployee) {
          this.$router.push('/user/dashboard');
        } else {
          this.$router.push('/user/dashboard');
        }

      } catch (error) {
        console.error('Login error:', error);
        const errorData = error.response?.data || {};
        this.errorMessage = errorData.message || 'Ocorreu um erro inesperado';
      }
    },
  },
};
</script>

<style>
/* Autofill styles */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px black inset !important;
  -webkit-text-fill-color: white !important;
  transition: background-color 5000s ease-in-out 0s;
}

.login-page {
  background: url('/HomeBackground.png') no-repeat center center fixed;
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
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  padding: 5px 0;
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

.options-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.forgot-password {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: white;
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

  .options-group {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
}

.error-message {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin: -20px 0 -20px;
  text-align: center;
}
</style>