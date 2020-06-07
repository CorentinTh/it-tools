<template>
  <v-card class="single-card">
    <v-card-title>About</v-card-title>
    <v-card-text>
      <Abstract />
    </v-card-text>
  </v-card>
</template>

<script>
  import Abstract from "../components/Abstract";

  export default {
    name: "About",
    components : {
      Abstract
    },
  }
</script>