<script setup lang="ts">
import { ref } from 'vue';
import { Codemirror } from 'vue-codemirror';
import { sql } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';
import { Extension } from '@codemirror/state';
import { ParsedStudent } from '@/models/admin/administration/ParsedStudent';
import CONSTANTS from '@/config/constants';

import ApiService from '@/services/ApiService';

const service = new ApiService();

const extensions: Extension[] = [sql(), oneDark];

const students = ref(`# Provide a list of students with the following columns:
# ALT_ID	alt_id2	FIRST NAME	LAST NAME	email	group_name	auth_provider
# eg
# username@domain	0012345678	Edgar	Codd	edgar@mail.com	G01	google
# someotheruser@domain		John	Doe

# Note that:
#   * alt_id is actually USERNAME, obviously depends on what auth provider are you using
#   * alt_id2 is typically another identiciator used by the higher education institution, some kind of academic id
#   * alt_id, and alt_id2 if provided, MUST BE UNIQUE
#   * auth_provider is authenication provider, eg saml.aai, google, facebook, twitter, ...
#   * uppercase columns are obligatory,
#   * fields are tab-separated,
#   * rows are (CR)LF separated
#   * comments start with #, so you can leave or delete these instructions"
`);

const parsed = ref();
const parsemsg = ref('');

const parsedList = ref<ParsedStudent[]>([]);

const parseAsync = async () => {
	const response = await service.postAsync('/administration/student/parse', { students: students.value });

	parsed.value = response;

	parsemsg.value = response.data.parsemsg;
	parsedList.value = response.data.parsedlist;

	console.log(response.data.parsedList);
};

const insertNewAsync = async () => {
	if (!parsedList.value) return;
	const response = await service.postAsync('/administration/students/insertnew', {
		courseId: CONSTANTS.COURSE_ID,
		academicYearId: CONSTANTS.ACADEMIC_YEAR_ID,
		rows: parsedList.value,
	});
	console.log('insert new');
	console.log(response);
};
</script>

<template>
	<div class="container-fluid">
		<Card>
			<template #title>Upload students</template>
			<template #content>
				<Codemirror
					v-model="students"
					:extensions="extensions"
					:style="{ width: '100%', minHeight: '30rem' }" />
				<Button label="Parse" class="p-button-success" @click="parseAsync" />
			</template>
			<template #footer>
				<span>{{ parsemsg }}</span>
				<h3 v-if="parsedList" class="p-card-title">Parsed entries (count: {{ parsedList.length }})</h3>
				<DataTable :value="parsedList" class="p-datatable-sm" :paginator="true" :rows="7">
					<template #header>
						<Button label="Insert & update" class="p-button-success me-1" disabled />
						<Button label="Update existing" class="p-button-success me-1" disabled />
						<Button label="Insert new" class="p-button-success me-1" @click="insertNewAsync" />
					</template>
					<Column field="" header="#">
						<template #body="{ index }">
							<div>{{ index + 1 }}</div>
						</template>
					</Column>
					<Column field="" header="alt_id" sortable>
						<template #body="{ data }">
							<InputText v-model="data.alt_id" type="text" />
						</template>
					</Column>
					<Column field="" header="alt_id2" sortable>
						<template #body="{ data }">
							<InputText v-model="data.alt_id2" type="text" />
						</template>
					</Column>
					<Column field="" header="email" sortable>
						<template #body="{ data }">
							<InputText v-model="data.email" type="text" />
						</template>
					</Column>
					<Column field="" header="first_name" sortable>
						<template #body="{ data }">
							<InputText v-model="data.first_name" type="text" />
						</template>
					</Column>
					<Column field="" header="last_name" sortable>
						<template #body="{ data }">
							<InputText v-model="data.last_name" type="text" />
						</template>
					</Column>
					<Column field="" header="group_name" sortable>
						<template #body="{ data }">
							<InputText v-model="data.group_name" type="text" />
						</template>
					</Column>
					<Column field="" header="provider" sortable>
						<template #body="{ data }">
							<InputText v-model="data.provider" type="text" />
						</template>
					</Column>
				</DataTable>
			</template>
		</Card>
	</div>
</template>
