<script setup lang="ts">
import NavigationMenuVue from './components/NavigationMenu.vue';
import Toast from 'primevue/toast';
</script>

<template>
	<Toast />
	<NavigationMenuVue />
	<router-view></router-view>
</template>
