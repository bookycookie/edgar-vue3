<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ApiService from '@/services/ApiService';
import { UserList } from '@/models/admin/administration/UserList';
import { FilterMatchMode } from 'primevue/api';
import humanize from '@/utilities/date-humanizer/humanizer';
const courseId = 155;
const academicYearId = 2020;
const appUserId = 46;
const service = new ApiService();

const usersDt = ref();
const exportCSV = () => usersDt.value.exportCSV();
const filters = ref({
	global: { value: '', matchMode: FilterMatchMode.CONTAINS },
});

const users = ref<UserList[]>([]);
const getUsersAsync = async () => {
	users.value = await service.getManyAsync<UserList>('/administration/users/list');
};

onMounted(async () => {
	await getUsersAsync();
});

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const username = ref('');
const altId = ref('');
const altId2 = ref('');
const provider = ref('');

const addAsync = async () => {
	await service
		.postAsync('/administration/users/add', {
			firstName: firstName.value,
			lastName: lastName.value,
			username: username.value,
			email: email.value,
			altId: altId.value,
			altId2: altId2.value,
			provider: provider.value,
		})
		.then(async () => await getUsersAsync());
};

const deleteAsync = async (userId: number) => {
	await service
		.postAsync('/administration/users/delete', {
			userId: userId,
		})
		.then(async () => await getUsersAsync());
};
</script>

<template>
	<div class="container-fluid">
		<Card>
			<template #title>Users (globally, in all courses):</template>
			<template #content>
				<div class="wrapper">
					<div class="item1">
						<span class="p-float-label me-2">
							<InputText v-model="firstName" class="w-100" />
							<label>First name</label>
						</span>
					</div>
					<div class="item2">
						<span class="p-float-label me-2">
							<InputText v-model="lastName" class="w-100" />
							<label>Last name</label>
						</span>
					</div>
					<div class="item3">
						<span class="p-float-label me-2">
							<InputText v-model="email" class="w-100" />
							<label>Email</label>
						</span>
					</div>
					<div class="item4">
						<span class="p-float-label me-2">
							<InputText v-model="username" class="w-100" />
							<label>Username</label>
						</span>
					</div>
					<div class="item5">
						<span class="p-float-label me-2">
							<InputText v-model="altId" class="w-100" />
							<label>Alt. id</label>
						</span>
					</div>
					<div class="item6">
						<span class="p-float-label me-2">
							<InputText v-model="altId2" class="w-100" />
							<label>Alt. id2</label>
						</span>
					</div>
					<div class="item7">
						<span class="p-float-label me-2">
							<InputText v-model="provider" class="w-100" />
							<label>Provider</label>
						</span>
					</div>
					<div class="item8">
						<Button label="Add" class="p-button-success w-100" @click="addAsync" />
					</div>
				</div>
			</template>
			<template #footer>
				<DataTable
					ref="usersDt"
					v-model:filters="filters"
					:value="users"
					filter-display="menu"
					show-gridlines
					scroll-height="43rem"
					class="p-datatable-sm"
					responsive-layout="scroll"
					:paginator="true"
					:rows="7">
					<template #header>
						<div style="display: flex">
							<span class="p-input-icon-left">
								<i class="pi pi-search" />
								<InputText
									v-model="filters['global'].value"
									placeholder="Search"
									class="p-inputtext-sm p-inputtext-filled" />
							</span>
							<Button
								icon="pi pi-external-link"
								label="Export"
								class="p-button-sm ml-3 me-3"
								@click="exportCSV" />
						</div>
					</template>
					<template #empty>
						<span class="center">No data to show.</span>
					</template>
					<Column field="" header="#">
						<template #body="{ index }">
							<div>{{ index + 1 }}</div>
						</template>
					</Column>
					<Column field="id" header="Id">
						<template #body="{ data }">
							<div class="number-align">
								<div>{{ data.id }}</div>
							</div>
						</template>
					</Column>
					<Column field="" header="Image" sortable>
						<font-awesome-icon icon="user"></font-awesome-icon>
					</Column>
					<Column field="first_name" header="First name" sortable />
					<Column field="last_name" header="Last name" sortable />
					<Column field="alt_id" header="alt_id" sortable />
					<Column field="alt_id2" header="alt_id2" sortable />
					<Column field="email" header="Email" sortable />
					<Column field="username" header="Username" sortable />
					<Column field="provider" header="Provider" sortable />
					<Column field="ts_created" header="Created at" sortable>
						<template #body="{ data }">
							{{ new Date(data.ts_created).toISOString().split('T')[0] }}
							<p>
								<em>
									<small>{{ humanize(new Date(data.ts_created)) }}</small>
								</em>
							</p>
						</template>
					</Column>
					<Column field="ts_modified" header="Modified at" sortable>
						<template #body="{ data }">
							{{ new Date(data.ts_modified).toISOString().split('T')[0] }}
							<p>
								<em>
									<small>{{ humanize(new Date(data.ts_modified)) }}</small>
								</em>
							</p>
						</template>
					</Column>
					<Column field="courses" header="Courses" sortable>
						<template #body="{ data }">
							<div class="number-align">{{ data.courses }}</div>
						</template>
					</Column>
					<Column field="" header="Delete">
						<template #body="{ data }">
							<div class="center">
								<Button class="p-button-danger" @click="deleteAsync(data.id)">
									<font-awesome-icon icon="trash"></font-awesome-icon>
								</Button>
							</div>
						</template>
					</Column>
				</DataTable>
			</template>
		</Card>
	</div>
</template>

<style scoped>
.wrapper {
	display: grid;
	grid-template-columns: repeat(11, 1fr);
	gap: 1rem;
	grid-template-areas: 'a b b c d d e e f f g h';
	align-items: start;
}
.item1 {
	grid-area: a;
}
.item2 {
	grid-area: b;
}

.item3 {
	grid-area: c;
}
.item4 {
	grid-area: d;
}
.item5 {
	grid-area: e;
}
.item6 {
	grid-area: f;
}
.item7 {
	grid-area: g;
}
.item8 {
	grid-area: h;
}
</style>
