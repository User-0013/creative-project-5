<template>
<div class="page" v-if="user">
  <div class="overview">
    <h2>{{user.username}}'s Stats</h2>
    <div class="resources">
      <div class="individual-resource">
        <p>Time: {{Math.floor(time)}}</p>
        <p>({{this.$root.$data.initData.secondsInHour * this.$root.$data.initData.resources.timeGrowthCoeff}}/hour)</p>
        <p>Max: {{maxTime}}</p>
      </div>
      <div class="individual-resource">
        <p>Brain Power: {{Math.floor(brainPower)}}</p>
        <p>({{this.$root.$data.initData.secondsInHour * this.$root.$data.initData.resources.brainPowerGrowthCoeff}}/hour)</p>
        <p>Max: {{maxBrainPower}}</p>
      </div>
      <div class="individual-resource">
        <p>Food: {{Math.floor(food)}}</p>
        <p>({{this.$root.$data.initData.secondsInHour * this.$root.$data.initData.resources.foodGrowthCoeff}}/hour)</p>
        <p>Max: {{maxFood}}</p>
      </div>
    </div>
    <p><b>Academic Prestige</b>: {{academicPrestige}}</p>
    <p><b>Degree Status</b>: {{degreeStatus}}</p>
    <p><b>Year in School</b>: {{yearInSchool}}</p>
  </div>

  <div class="delete-account">
    <div class="button-wrapper"><button @click="deleteAccount" class="button">Delete Account</button></div>
  </div>
</div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'GameOverview',
  data() {
    return {
      username: "",
      resource: null,
      userData: null,
      time: 0,
      brainPower: 0,
      food: 0,
      maxTime: 0,
      maxBrainPower: 0,
      maxFood: 0,
      academicPrestige: this.$root.$data.initData.academicPrestige,
      degreeStatus: this.$root.$data.initData.degreeStatus,
      yearInSchool: this.$root.$data.initData.yearInSchool,
      isAccountedDeleted: false
    }
  },
  methods: {
    async getResource() {
      try {
        const response = await axios.get(`/api/data/resources`);
        this.resource = response.data;
        this.time = this.resource.time;
        this.brainPower = this.resource.brainPower;
        this.food = this.resource.food;
        this.maxTime = this.resource.maxTime;
        this.maxBrainPower = this.resource.maxBrainPower;
        this.maxFood = this.resource.maxFood;
      } catch (error) {
        console.log(error);
      }
    },
    async getUserData() {
      try{
        const response = await axios.get('/api/data');
        this.userData = response.data;
        this.academicPrestige = this.userData.academicPrestige;
        this.degreeStatus = this.userData.degreeStatus;
        this.yearInSchool = this.userData.yearInSchool;
      } catch (error) {
        console.log(error);
      }
    },
    updateResources() {
        // Update resources every second.
        setInterval(function() {
        // Get how many resources we need to give the user.
        // Formulas are different based on a user's resource efficiency.

        // Time forumla.
        if (this.time < this.resource.maxTime) {
          this.time += this.$root.$data.initData.resources.timeGrowthCoeff;
        } else {
          this.time = this.resource.maxTime;
        }

        // Brain Power formula.
        if (this.brainPower < this.resource.maxBrainPower) {
          this.brainPower += this.$root.$data.initData.resources.brainPowerGrowthCoeff;
        } else {
          this.brainPower = this.resource.maxBrainPower;
        }

        // Food formula.
        if (this.food < this.resource.maxFood) {
          this.food += this.$root.$data.initData.resources.foodGrowthCoeff;
        } else {
          this.food = this.resource.maxFood;
        }
      }.bind(this), 1000);
    },
    async saveResources() {
      // Save the current user's resources to the database.
      if (this.resource) {
        await axios.put(`/api/data/resources`, {
          food: this.food,
          brainPower: this.brainPower,
          time: this.time,
          maxFood: this.resource.maxFood,
          maxBrainPower: this.resource.maxBrainPower,
          maxTime: this.resource.maxTime
        });
      }
    },
    async updateLastLoggedIn() {
      try {
        let currentDate = new Date();
        await axios.put(`/api/users`, {lastLoggedIn: currentDate});
        this.$root.$data.user.lastLoggedIn = currentDate;
      } catch (error) {
        console.log(error);
      }
    },
    getResourcesSinceLastLoggedIn() {
      // Get the current date and subtract from the last time the user
      // logged in.
      let now = new Date();
      let lastLoggedIn = new Date(this.user.lastLoggedIn);

      // Get the resources earned while the user wasn't logged in.
      let resourcesEarnedWhileLoggedOut = (now.getTime() - lastLoggedIn.getTime()) / 1000;
      this.time += this.$root.$data.initData.resources.timeGrowthCoeff * resourcesEarnedWhileLoggedOut;
      this.brainPower += this.$root.$data.initData.resources.brainPowerGrowthCoeff * resourcesEarnedWhileLoggedOut;
      this.food += this.$root.$data.initData.resources.foodGrowthCoeff * resourcesEarnedWhileLoggedOut;
    },
    async deleteAccount() {
      try {
        await axios.delete('/api/data/delete', {});
        await axios.delete(`/api/data/resources/delete`, {});
        await axios.delete(`/api/users/delete`, {});
        this.isAccountedDeleted = true;
        this.$root.$data.user = null;
        this.$root.$router.push({path: `/`})
      } catch (error) {
        console.log(error);
      }
    }
  },
  computed: {
    user() {
      return this.$root.$data.user;
    }
  },
  async created () {
    await this.getResource();
    await this.getUserData();
    this.getResourcesSinceLastLoggedIn();
    if (this.$root.$data.user) {
      this.username = this.$root.$data.user.username;
    }
  },
  beforeUpdate: function () {
    if (!this.isAccountedDeleted) {
      this.saveResources();
      this.updateLastLoggedIn();
    }
  },
  mounted: function () {
    this.updateResources();
  },
  beforeDestroy: function () {
    if(!this.isAccountedDeleted) {
      this.saveResources();
      this.updateLastLoggedIn();
    }
  }
}
</script>

<style scoped>
.page {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
}

.page h1 {
  display: flex;
  width: 90%;
  font-family: "Times New Roman", serif;
  padding: 20px 15px;
  margin: 20px 5%;
}

.page h2 {
  display: flex;
  width: 100%;
  font-family: "Helvetica", sans-serif;
  font-size: 2.5em;
  padding: 20px 20px;
  color: #000;
}

.page h3 {
  display: flex;
  flex-direction: row;
  width: 90%;
  font-family: "Candara";
  font-size: 2em;
  padding: 10px 40px;
  margin-left: 4%;
  margin-right: 4%;
  color: #000;
}

.page p {
  display: flex;
  font-family: "Garamond";
  font-size: 1.3em;
  margin: 10px 0;
}

.overview {
  display: flex;
  flex-direction: column;
  width: 70%;
  height: 100%;
  border-radius: 5px;
  background-color: #D1E8E2;
  margin: 50px 0;
  padding: 0 20px;
  padding-bottom: 15px;
}

.resources {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.individual-resource {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
}

.individual-resource p {
  margin-top: 0px;
  margin-bottom: 0px;
  margin-left: 5px;
}

/* Buttons */
.button {
  display: flex;
  width: 200px;
  height: 50px;
  color: #D1E8E2;
  align-items: center;
  justify-content: center;
  background-color: #2C3531;
  border-radius: 4px;
  margin-top: 2%;
  margin-left: 20px;
  margin-bottom: 50px;
  font-size: 1.25em;
}

.button-wrapper {
  display: flex;
  width: 100%;
  justify-content: flex-end;
}

/* Mobile Styles */
@media only screen and (max-width: 400px) {}

/* Tablet Styles */
@media only screen and (min-width: 401px) and (max-width: 960px) {
  .button-wrapper {
    margin-right: 50px;
  }
}

/* Desktop Styles */
@media only screen and (min-width: 961px) {
  .resources {
    flex-direction: row;
    justify-content: center;
  }

  .individual-resource {
    flex-direction: column;
    align-items: center;
    margin: 0 0;
  }

  .resources p {
    margin: 10px 50px;
  }

  .individual-resource p {
    margin-top: 0px;
    margin-bottom: 0px;
    margin-left: 0px;
  }
}
</style>
