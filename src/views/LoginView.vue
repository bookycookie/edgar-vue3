<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button';
import Password from 'primevue/password';
import InputText from 'primevue/inputtext';
import Card from 'primevue/card';
import Avatar from 'primevue/avatar';
import Divider from 'primevue/divider';

const username = ref('');
const password = ref('');

const dummyUsername = ref('imekterovi@fer.hr');
const dummyPassword = ref('sdkfjsfjsrsdfsdfsd@node.js');
</script>

<template>
	<div class="container-center-sm mt-4">
		<Card>
			<template #title><div class="center-text">Login</div></template>
			<template #content>
				<div class="center-text">
					<Avatar shape="circle" size="xlarge"><font-awesome-icon size="lg" icon="user" /></Avatar>
					<br />
					<br />
					<div class="p-inputgroup">
						<span class="p-float-label">
							<InputText id="username" v-model="username" type="text" />
							<label for="username">Username</label>
						</span>
					</div>
					<br />
					<br />
					<div class="p-inputgroup">
						<span class="p-float-label">
							<Password id="password" v-model="password" toggle-mask />
							<label for="password">Password</label>
						</span>
					</div>
					<br />
					<div class="p-inputgroup"><Button class="w-100" variant="primary" label="Log in" /></div>
					<Divider />
					<div class="p-inputgroup">
						<Button
							id="google"
							class="p-button-danger w-100"
							icon="pi pi-google"
							label="Login with Google" />
					</div>
					<br />
					<div class="p-inputgroup">
						<Button id="facebook" class="w-100" icon="pi pi-facebook" label="Login with Facebook" />
					</div>
					<br />
					<div class="p-inputgroup">
						<Button
							id="twitter"
							class="p-button-info w-100"
							icon="pi pi-twitter"
							label="Login with Twitter" />
					</div>
					<Divider />
					<br />
					<br />
					<div class="p-inputgroup">
						<span class="p-float-label">
							<InputText id="dummy-username" v-model="dummyUsername" type="text" />
							<label for="dummy-username">Dummy Username</label>
						</span>
					</div>
					<br />
					<br />
					<div class="p-inputgroup">
						<span class="p-float-label">
							<Password id="dummy-password" v-model="dummyPassword" toggle-mask />
							<label for="dummy-password">Dummy Password</label>
						</span>
					</div>
					<br />
					<div class="p-inputgroup">
						<div class="p-inputgroup"><Button class="w-100" variant="primary" label="Log in" /></div>
					</div>
				</div>
			</template>
		</Card>
	</div>
	<!-- <div class="grid-container mt-3">
		<div class="grid-container">
			<font-awesome-icon size="lg" class="icon grid-item" icon="user" />
			<InputText
				id="username"
				v-model="username"
				type="text"
				class="grid-item"
				placeholder="Username"></InputText>
			<Password id="password" v-model="password" class="grid-item" toggle-mask placeholder="Password"></Password>
			<Button class="grid-item center" variant="primary">Log In</Button>
		</div>
		<div class="oauth-login grid-container">
			<Button
				id="google"
				class="p-button-danger grid-item button"
				icon="pi pi-google"
				label="Login with Google"></Button>
			<Button id="facebook" class="grid-item button" icon="pi pi-facebook" label="Login with Facebook"></Button>
			<Button
				id="twitter"
				class="p-button-info grid-item button"
				icon="pi pi-twitter"
				label="Login with Twitter"></Button>
		</div>
		<div class="dummy-login grid-container">
			<h1>Dummy login</h1>
			<InputText
				id="dummy-username"
				v-model="dummyUsername"
				type="text"
				class="grid-item"
				placeholder="Username"></InputText>
			<Password
				id="dummy-password"
				v-model="dummyPassword"
				class="grid-item"
				toggle-mask
				placeholder="Password"></Password>
			<Button class="grid-item button center" variant="primary" label="Log In">Log In</Button>
		</div>
		<div id="api-login">
			<Button class="grid-item button center">Login with API & fill store</Button>
		</div>
		<div id="api-logout">
			<Button class="grid-item button center p-button-danger">Logout with API & empty store</Button>
		</div>
	</div> -->
</template>
