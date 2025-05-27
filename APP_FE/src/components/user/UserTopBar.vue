<template>
  <div>
    <nav class="top-navigation">
      <div class="nav-content">
        <div class="logo-welcome">
          <div class="logo">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 0L37.3205 10V30L20 40L2.67949 30V10L20 0Z" fill="white" />
              <path d="M20 5L32.3205 12.5V27.5L20 35L7.67949 27.5V12.5L20 5Z" fill="black" />
              <path d="M20 10L27.3205 15V25L20 30L12.6795 25V15L20 10Z" fill="white" />
            </svg>
            <span class="company-name">AutoSync</span>
          </div>
          <div class="welcome-text">
            Hello, <span class="username">{{ currentUser.username }}</span>
          </div>
        </div>

        <!-- Navigation Links -->
        <div class="nav-links" :class="{
          'admin-nav': currentUser.role === 'admin',
          'employee-nav': currentUser.role === 'employee'
        }">
          <router-link v-if="currentUser.role === 'employee'" to="/user/dashboard" class="nav-link employee-link">Dashboard</router-link>

          <div v-if="currentUser.role === 'employee'" class="nav-item employee-link">
            <router-link to="/store/list" class="nav-link">
              Stores
            </router-link>
            <div class="submenu">
              <router-link to="/store/add" class="submenu-item">Create Store</router-link>
              <router-link to="/store/list" class="submenu-item">See All Stores</router-link>
            </div>
          </div>

          <div v-if="currentUser.role === 'employee'" class="nav-item employee-link">
            <router-link to="/car/list" class="nav-link">
              Cars
            </router-link>
            <div class="submenu">
              <router-link to="/car/add" class="submenu-item">Create Car</router-link>
              <router-link to="/car/list" class="submenu-item">See All Cars</router-link>
            </div>
          </div>

          <router-link v-if="currentUser.role === 'admin'" to="/employee/list" class="nav-link admin-link">Employee Management</router-link>
        </div>

        <!-- Logout Button -->
        <button @click="handleLogout" class="logout-btn">
          <span>Logout</span>
          <svg class="logout-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2"
            fill="none">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </nav>
    <div class="separator"></div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import UserService from '@/services/UserService';

export default {
  name: 'UserTopBar',
  setup() {
    const router = useRouter();
    const currentUser = ref({
      username: 'Guest',
      role: null
    });

    const fetchCurrentUser = () => {
      try {
        const userData = UserService.getCurrentUser();
        currentUser.value = {
          username: userData.username || localStorage.getItem('username') || 'Guest',
          role: userData.role
        };
      } catch (error) {
        console.error('Error fetching user data:', error);
        currentUser.value = { username: 'Guest', role: null };
      }
    };

    const handleLogout = () => {
      UserService.clearUserData();
      router.push('/');
    };

    onMounted(() => {
      fetchCurrentUser();
    });

    return {
      currentUser,
      handleLogout,
    };
  },
};
</script>

<style scoped>
.top-navigation {
  background: linear-gradient(145deg, #000000, #676767);
  padding: 15px 40px;
  position: relative;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.logo-welcome {
  display: flex;
  align-items: center;
  gap: 30px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.company-name {
  color: white;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.welcome-text {
  color: #9ba1a6;
  font-size: 16px;
}

.username {
  color: white;
  font-weight: 600;
}

.nav-links {
  display: flex;
  gap: 40px;
  align-items: center;
  margin: 0 40px;
}

/* Estilo para navegação do admin */
.nav-links.admin-nav {
  justify-content: center;
  margin: 0 auto;
  flex: 1;
  padding-right: 100px;
}

.admin-link {
  font-size: 18px;
  padding: 8px 20px;
  margin-left: -100px;
}

/* Novo estilo para navegação do employee */
.nav-links.employee-nav {
  justify-content: flex-start;
  margin-left: -50px; /* Ajuste este valor para mover mais ou menos para a esquerda */
  padding-right: 50px;
}

.employee-link {
  font-size: 16px;
  padding: 8px 15px;
}

.nav-item {
  position: relative;
}

.nav-link {
  color: #9ba1a6;
  text-decoration: none;
  font-size: 16px;
  transition: all 0.3s ease;
  white-space: nowrap;
  font-weight: 500;
  padding: 5px 10px;
  display: block;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: white;
}

.nav-item:hover .submenu {
  display: block;
  transform: translateY(0);
  opacity: 1;
}

.submenu {
  display: block;
  position: absolute;
  top: 100%;
  left: 0;
  background: #1a1a1a;
  border-radius: 8px;
  padding: 8px 0;
  min-width: 180px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  z-index: 100;
  transform: translateY(-10px);
  opacity: 0;
  transition: all 0.3s ease;
  pointer-events: none;
}

.nav-item:hover .submenu {
  pointer-events: all;
}

.submenu-item {
  color: #9ba1a6;
  text-decoration: none;
  padding: 10px 16px;
  font-size: 14px;
  transition: all 0.3s ease;
  white-space: nowrap;
  font-weight: 500;
  display: block;
}

.submenu-item:hover,
.submenu-item.router-link-active {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.logout-btn {
  background: linear-gradient(145deg, #3d3d3d, #2a2a2a);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.logout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  background: linear-gradient(145deg, #4a4a4a, #333333);
}

.logout-icon {
  transition: transform 0.3s ease;
}

.logout-btn:hover .logout-icon {
  transform: translateX(3px);
}

.separator {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0;
  width: 100%;
}

/* Responsive Styles */
@media (max-width: 1200px) {
  .nav-links {
    gap: 30px;
  }

  .logo-welcome {
    gap: 20px;
  }

  .company-name {
    font-size: 20px;
  }
}

@media (max-width: 992px) {
  .top-navigation {
    padding: 15px 20px;
  }

  .nav-links {
    gap: 20px;
    margin: 0 20px;
  }

  .welcome-text {
    display: none;
  }
}

@media (max-width: 768px) {
  .top-navigation {
    padding: 15px;
  }

  .nav-content {
    flex-direction: column;
    gap: 20px;
  }

  .nav-links {
    flex-direction: column;
    width: 100%;
    margin: 20px 0;
    gap: 10px;
  }

  .nav-links.admin-nav,
  .nav-links.employee-nav {
    justify-content: center;
    margin: 20px 0;
    padding-right: 0;
  }

  .nav-item,
  .nav-link {
    width: 100%;
    text-align: center;
  }

  .submenu {
    position: static;
    background: rgba(255, 255, 255, 0.05);
    transform: none;
    opacity: 1;
    box-shadow: none;
    display: none;
  }

  .nav-item:hover .submenu {
    display: block;
  }

  .logout-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .company-name {
    font-size: 18px;
  }

  .nav-link {
    font-size: 15px;
  }

  .submenu-item {
    font-size: 14px;
  }
}
</style>