<template>
  <div class="employee-list">
    <UserTopBar />

    <div class="content-container">
      <div class="title-section">
        <h1 class="page-title">Employees</h1>
        <div class="title-underline"></div>
      </div>

      <!-- Summary Cards -->
      <div class="stats-container">
        <div class="stat-card" @click="filterStatus('all')">
          <i class="fas fa-users"></i>
          <div class="stat-info">
            <span class="stat-value">{{ totalEmployees }}</span>
            <span class="stat-label"> Total Employees</span>
          </div>
        </div>
        <div class="stat-card" @click="filterStatus('active')">
          <i class="fas fa-check-circle"></i>
          <div class="stat-info">
            <span class="stat-value">{{ activeCount }}</span>
            <span class="stat-label"> Active</span>
          </div>
        </div>
        <div class="stat-card" @click="filterStatus('inactive')">
          <i class="fas fa-times-circle"></i>
          <div class="stat-info">
            <span class="stat-value">{{ inactiveCount }}</span>
            <span class="stat-label"> Inactive</span>
          </div>
        </div>
      </div>

      <div class="card-container">
        <div class="card-header">
          <div class="search-box">
            <img src="/IconLupa.png" alt="Search" class="search-icon" />
            <input
              type="text"
              class="search-input"
              placeholder="Search employees..."
              v-model="searchQuery"
            />
          </div>
        </div>

        <div class="table">
          <div class="table-header">
            <div>Username</div>
            <div>Role</div>
            <div>Status</div>
            <div>Actions</div>
          </div>

          <TransitionGroup name="table-animation" tag="div" class="table-body">
            <div
              v-for="employee in filteredEmployees"
              :key="employee.username"
              class="table-row"
            >
              <div data-label="Username">
                <i class="fas fa-user-circle username-icon"></i>
                {{ employee.username }}
              </div>
              <div data-label="Role">
                <span class="badge">{{ employee.role }}</span>
              </div>
              <div data-label="Status">
                <span class="badge">{{ employee.isActive ? "Active" : "Inactive" }}</span>
              </div>
              <div class="actions" data-label="Actions">
                <button @click="toggleStatus(employee)" class="action-btn">
                  {{ employee.isActive ? "Inactivate" : "Activate" }}
                  <span class="status-icon">{{ employee.isActive ? "⦸" : "✓" }}</span>
                </button>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import UserTopBar from "../user/UserTopBar.vue";
import UserService from "@/services/UserService";

export default {
  name: "EmployeeList",
  components: { UserTopBar },
  setup() {
    const searchQuery = ref("");
    const filter = ref("all");
    const employees = ref([]);
    const errorMessage = ref("");

    const fetchEmployees = async () => {
      try {
        errorMessage.value = "";
        const response = await UserService.fetchAllUsers();
        employees.value = response.data.map((user) => ({
          username: user.username,
          role: "Employee",
          isActive: user.role === "employee",
        }));
      } catch (error) {
        console.error("Failed to fetch employees:", error);
        errorMessage.value = "Failed to load employees. Please try again.";
      }
    };

    const toggleStatus = async (employee) => {
      try {
        errorMessage.value = "";
        const updatedStatus = !employee.isActive;
        const updatedRole = updatedStatus ? "employee" : "inactive";
        await UserService.updateRole(employee.username, { role: updatedRole });
        employee.isActive = updatedStatus;
      } catch (error) {
        console.error("Failed to update status:", error);
        errorMessage.value = "Failed to update employee status. Please try again.";
      }
    };

    const filteredEmployees = computed(() => {
      return employees.value.filter((employee) => {
        const matchesSearch = employee.username
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase());
        const matchesFilter =
          filter.value === "all" ||
          (filter.value === "active" && employee.isActive) ||
          (filter.value === "inactive" && !employee.isActive);
        return matchesSearch && matchesFilter;
      });
    });

    const totalEmployees = computed(() => employees.value.length);
    const activeCount = computed(() => employees.value.filter((emp) => emp.isActive).length);
    const inactiveCount = computed(() => employees.value.filter((emp) => !emp.isActive).length);

    const filterStatus = (status) => {
      filter.value = status;
    };

    onMounted(() => {
      fetchEmployees();
    });

    return {
      searchQuery,
      filteredEmployees,
      toggleStatus,
      filterStatus,
      totalEmployees,
      activeCount,
      inactiveCount,
      errorMessage,
    };
  },
};
</script>


<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css");

.employee-list {
  min-height: 100vh;
  background: url("/HomeBackground.png") no-repeat center center fixed;
  background-size: cover;
}

.content-container {
  padding: 40px 80px;
  max-width: 1800px;
  margin: 0 auto;
}

.title-section {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 48px;
  font-weight: 800;
  color: white;
  margin-bottom: 10px;
}

.title-underline {
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #ffffff, transparent);
  margin: 0 auto;
  border-radius: 2px;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
  text-align: center;
}

.stat-card {
  background: linear-gradient(145deg, #000000, #454545);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-card i {
  font-size: 30px;
  margin-bottom: 10px;
  color: #9b9b9b;
}

.stat-info {
  color: white;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
}

.stat-label {
  font-size: 14px;
  color: #9b9b9b;
}

.card-container {
  background: linear-gradient(145deg, #000000, #a2a1a1);
  border-radius: 20px;
  padding: 30px;
}

.search-box {
  position: relative;
  width: 400px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 26px;
  height: 17px;
  opacity: 0.7;
}

.search-input {
  width: 100%;
  padding: 12px 12px 12px 45px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-size: 16px;
}

.table {
  max-width: 1200px;
  margin: 30px auto 0;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.table-header {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 25px;
  background: rgba(255, 255, 255, 0.1);
  color: rgb(190, 190, 190);
  text-align: center;
  font-size: 15px;
}

.table-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 25px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: white;
  text-align: center;
  align-items: center;
  font-size: 16px;
}

.username-icon {
  margin-right: 8px;
  font-size: 20px;
  color: #9b9b9b;
  vertical-align: middle;
}
.action-btn {
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  border: none;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  min-width: 140px;
}

/* Animation Styles */
.table-animation-enter-active,
.table-animation-leave-active {
  transition: all 0.5s ease;
}

.table-animation-enter-from,
.table-animation-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
