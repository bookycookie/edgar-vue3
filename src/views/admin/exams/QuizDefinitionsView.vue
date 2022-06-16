<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ApiService from '@/services/ApiService';
import { Test } from '@/models/admin/exams/Test';
import { TestTable } from '@/models/admin/exams/TestTable';
import humanize from '@/utilities/date-humanizer/humanizer';
import { FilterMatchMode } from 'primevue/api';

const courseId = 477;
const academicYearId = 2020;

const service = new ApiService();

const tests = ref<Test[]>([]);
const selectedTest = ref<Test | null>(null);

const lectureTable = ref<TestTable[]>([]);
const lectureTableDt = ref();

onMounted(async () => {
	tests.value = await service.getManyAsync<Test>('/test_types', { standalone: false, typeName: 'Lecture quiz' });
	lectureTable.value = await service.getManyAsync<TestTable>('/lecture_table', {
		courseId: courseId,
		academicYearId: academicYearId,
	});

	for (var i = 0; i < lectureTable.value.length; i++) {
		lectureTable.value[i].title_type_name = `${lectureTable.value[i].title} — ${lectureTable.value[i].type_name}`;
	}
});

const flagsPill = (flag: string) => {
	let pillClass = 'badge rounded-pill bg-';
	if (flag.includes('-- STATS-')) pillClass += 'primary';
	else if (flag.includes('--- SCIGNORED')) pillClass += 'secondary';
	else if (flag.includes('----')) pillClass += 'info';
	else pillClass += 'light';
	return pillClass;
};

const filters = ref({
	global: { value: '', matchMode: FilterMatchMode.CONTAINS },
});

const skeletonLectureData: TestTable[] = [
	{
		id: 15,
		title: 'Voluptate dolore eum. Quis omnis consequatur molestias minus. Aut aperiam autem.',
		id_course: 5,
		id_academic_year: 43,
		id_semester: 31,
		id_test_type: 38,
		id_user_created: 29,
		test_ordinal: 17,
		max_runs: 25,
		show_solutions: true,
		max_score: 14,
		password: 'Voluptate non cumque repellendus ea aut ducimus dolore.',
		questions_no: 29,
		duration_seconds: 6,
		pass_percentage: 'nulla expedita est',
		ts_available_from: 'neque est vero',
		ts_available_to:
			'Praesentium accusantium voluptatibus. Eligendi nemo rem totam repellendus aspernatur eveniet maxime repellendus iusto. Cumque voluptatem qui a quia non ut voluptas rerum. Illum aliquid pariatur minus dolor neque est eum vel.',
		ts_created:
			'Eum veniam et at voluptatibus officiis nesciunt sed earum.\nDebitis id aliquid quia omnis doloribus aut assumenda sapiente.\nInventore nostrum voluptates in tempore fuga autem.\nIpsa maiores omnis et totam perferendis qui.\nQuas rerum molestiae dolor eligendi commodi quidem culpa quia aut.',
		ts_modified:
			'Esse qui ea. Consequatur et suscipit ipsum voluptatem itaque vel maxime et quia. Consequuntur delectus velit error ut non.',
		user_modified:
			'Occaecati non temporibus ut unde rerum quia. Voluptatem reiciendis soluta repellendus. Voluptas libero doloribus quia. Sed provident amet tempora accusantium. Reprehenderit eveniet tenetur voluptas cum eum voluptatibus totam.\n \rExplicabo nesciunt ab sapiente iste corporis maiores qui nisi corporis. Fuga quas nulla numquam doloribus. Totam placeat est veniam enim. Rerum voluptate laudantium corporis. Sint quasi earum. Consequatur omnis qui sit porro dolorem velit molestias culpa.\n \rVoluptate non earum. Minus adipisci hic adipisci neque nulla aut. Dolorum fugit maiores. Corporis sed et eos repellendus cumque itaque saepe alias quia. Placeat aliquam voluptas error modi qui.',
		review_period_mins: 14,
		hint_result: true,
		test_score_ignored: true,
		title_abbrev: 'odio',
		async_submit: true,
		trim_clock: false,
		id_email_reminder_scheme: 'GQqhhU/s"7',
		allow_anonymous: false,
		is_competition: false,
		eval_comp_score: '>;%<Fcwo3k',
		upload_file_no: 47,
		upload_file_limit: 37,
		forward_only: true,
		id_parent: 'g(]#EwrSX&',
		allow_anonymous_stalk: false,
		use_in_stats: false,
		is_global: false,
		is_public: false,
		id_plag_detection_algorithm: 'DdkW%4@Ecf',
		spassword:
			'Cumque tempora ipsa officia voluptas. Doloribus quod qui minima unde iusto rem. Consequuntur nemo est ut vel. Et ut qui perferendis pariatur tenetur quis in. Quo suscipit quos iste dignissimos consequatur quam temporibus voluptatum illum. Explicabo labore nihil error sed incidunt.\n \rQui deleniti velit est tempora iste voluptas distinctio ex alias. Sint totam rerum eveniet impedit. Eius praesentium non et in sint eum. Facilis aliquid qui voluptatem inventore dignissimos id qui fuga.\n \rExercitationem repudiandae ipsum possimus asperiores soluta asperiores aliquam. Dignissimos ex sed. Mollitia sed quod facere tempore impedit placeat porro unde.',
		ts_from: 'Mollitia dolorum fugit fuga occaecati quo.',
		ts_to: 'Facilis ipsum et recusandae quaerat iste facilis quia ut. Vitae est facilis ab sunt vel beatae voluptatem placeat. Facilis officia voluptas harum itaque alias. Asperiores facere odit perferendis deleniti nemo vero.',
		type_name: 'omnis',
		user_created:
			'Beatae aliquam sit eos qui. Ut iste tempora et voluptatem ipsam et earum consequatur. Eum animi rerum sit cum omnis vel.\n \rSuscipit qui occaecati repellendus hic quia eos blanditiis dolores. Voluptates facere fugit non et a aliquid. Aperiam ut ut doloremque dolorum dolores neque sed. Nemo dolor eos accusamus excepturi. Sit voluptate repudiandae quia rem maiores in ut eos.\n \rConsequuntur autem reiciendis dolore accusamus nobis. Quos est dolores. Autem et ut earum quia repudiandae. Ratione consectetur rerum molestias dignissimos laudantium.',
		title_type_name:
			'Sint error rem soluta sunt ab est.\nIpsam voluptatem sequi possimus ea.\nEt suscipit quo harum dolore minus aspernatur dolorum.',
	},

	{
		id: 35,
		title: 'nisi assumenda dolorum',
		id_course: 9,
		id_academic_year: 39,
		id_semester: 23,
		id_test_type: 6,
		id_user_created: 17,
		test_ordinal: 47,
		max_runs: 11,
		show_solutions: false,
		max_score: 48,
		password:
			'Aut illo qui ipsum quae.\nSuscipit et sit quis reprehenderit sit.\nAccusantium molestias est laboriosam reiciendis inventore dignissimos voluptate facere molestiae.',
		questions_no: 15,
		duration_seconds: 12,
		pass_percentage:
			'Debitis aut voluptatem nihil et unde eaque nulla. Harum placeat velit laborum qui officia modi aspernatur tenetur. Tenetur voluptas placeat et odit praesentium. Repellendus quae nostrum ut molestias. Consectetur iure qui quia molestias et dignissimos pariatur omnis ullam.\n \rCum vitae sapiente quo deserunt. Itaque et quibusdam et ex expedita odio quos ut nisi. Saepe quis harum praesentium aut laudantium possimus rerum illo optio. Eos corporis dolores aut nihil vitae ducimus.\n \rVelit totam ut voluptatem pariatur vel. Eum impedit aut eos quia corrupti enim recusandae aut. Aut deserunt tenetur reiciendis et architecto quos. Dicta aliquid eum maxime ab repellat earum natus incidunt. Voluptatibus ut sed adipisci. Sequi quia ut iure et adipisci consequatur assumenda ea sit.',
		ts_available_from:
			'Ipsa repellat qui quas ipsum illo et culpa saepe velit. Commodi aliquam et sapiente a in voluptas aliquid dolores. Provident temporibus vitae sunt. Consequatur quidem ea alias ut. Omnis eligendi nihil. Officia rerum voluptatem esse exercitationem totam qui quaerat voluptatem.\n \rEa autem minima voluptas cum voluptatem nesciunt. Est voluptatem sit dicta dicta omnis aut ipsam. Provident ex ad cupiditate quis natus. Sit saepe saepe doloremque. Sit in iusto ipsam ut reiciendis totam illo.\n \rId dolores sapiente soluta sed accusantium. Quia suscipit quo quisquam quia. Id sed possimus perspiciatis cupiditate non numquam corrupti ea libero. Odio qui natus dolorem et.',
		ts_available_to: 'Minus consequatur optio in hic assumenda quia.',
		ts_created: 'recusandae dicta praesentium',
		ts_modified:
			'Incidunt dolore illo possimus explicabo autem velit omnis cumque illo. Mollitia quibusdam reiciendis eveniet. Sed eligendi est animi aut consequatur ut qui blanditiis. Possimus ipsam dolorem veniam molestiae quo voluptas optio. Et at placeat in est omnis ut. Animi excepturi ut sed dicta recusandae sunt quia doloribus odit.',
		user_modified:
			'Vel maxime quisquam sed dolores totam est ea. Quos dignissimos nobis. Sapiente ut omnis soluta sunt itaque quod. Odit officiis qui earum id reprehenderit.',
		review_period_mins: 46,
		hint_result: true,
		test_score_ignored: false,
		title_abbrev: 'et',
		async_submit: true,
		trim_clock: false,
		id_email_reminder_scheme: "aZdZan#f'>",
		allow_anonymous: false,
		is_competition: true,
		eval_comp_score: '$H`B*|0[wI',
		upload_file_no: 36,
		upload_file_limit: 50,
		forward_only: true,
		id_parent: ';%6t5@$heo',
		allow_anonymous_stalk: true,
		use_in_stats: true,
		is_global: false,
		is_public: false,
		id_plag_detection_algorithm: '#j5@XcDzV7',
		spassword:
			'Facilis fugit sunt in. Incidunt alias commodi dicta iusto velit est. Aliquam recusandae sunt atque exercitationem sequi nisi ut ipsam iure. Tempore perferendis reiciendis aspernatur atque.',
		ts_from: 'temporibus',
		ts_to: 'Sit molestias minima ad minima veniam. Quo quod atque cumque dicta. In cupiditate error aperiam ad. Itaque sit molestiae est totam. Et commodi aperiam quas excepturi rerum deleniti adipisci nemo.',
		type_name:
			'Possimus harum totam magni debitis quidem minus. Ut aut minus sed neque iure. Et quis vel omnis perspiciatis nobis exercitationem numquam vel veniam. Natus rerum inventore est omnis qui. Quia earum culpa dolore rem. Amet provident quibusdam omnis.\n \rMolestiae recusandae architecto facilis reprehenderit. In voluptatem facere itaque accusantium recusandae magnam impedit molestiae. Fuga maxime occaecati ea molestiae dolor ducimus et repellendus blanditiis. Consequatur a asperiores.\n \rAut est minima et optio odit consequatur quisquam. Vitae ut quae. Veniam magni sunt et modi perspiciatis dolor quibusdam iusto ipsum. Sed sint inventore dicta voluptatum aliquid minus nam. Quos error occaecati sunt nam necessitatibus et laboriosam cum accusamus.',
		user_created: 'ut soluta et',
		title_type_name:
			'Ipsam qui sapiente sapiente. Voluptatem nesciunt voluptatem et totam quae autem. Voluptatem culpa provident a non rem molestias. Mollitia quos dolore aliquam delectus modi eum voluptatem dolorem.',
	},
	{
		id: 1,
		title: 'Vel et vel rerum cum vel ab omnis.',
		id_course: 5,
		id_academic_year: 5,
		id_semester: 5,
		id_test_type: 25,
		id_user_created: 18,
		test_ordinal: 39,
		max_runs: 16,
		show_solutions: false,
		max_score: 50,
		password: 'Omnis provident iusto et accusantium.',
		questions_no: 13,
		duration_seconds: 23,
		pass_percentage: 'Maxime reiciendis in qui totam eligendi.',
		ts_available_from: 'Dolorem alias odio sit.',
		ts_available_to: 'Neque velit ipsam.',
		ts_created:
			'Asperiores sint nisi corporis dolorem dolorem.\nIncidunt quia deserunt asperiores autem voluptas sit cupiditate.\nDeserunt molestiae et dolorum rem.\nNon ratione voluptatem ipsam distinctio consequatur minima vitae est.',
		ts_modified: 'ut',
		user_modified: 'impedit',
		review_period_mins: 39,
		hint_result: true,
		test_score_ignored: true,
		title_abbrev: 'et',
		async_submit: false,
		trim_clock: true,
		id_email_reminder_scheme: 'E3so6-Z(HB',
		allow_anonymous: true,
		is_competition: true,
		eval_comp_score: 'c,@iLYC{1I',
		upload_file_no: 4,
		upload_file_limit: 41,
		forward_only: false,
		id_parent: 'U"v#gNfXf}',
		allow_anonymous_stalk: true,
		use_in_stats: true,
		is_global: true,
		is_public: true,
		id_plag_detection_algorithm: 'E4CEEh,0}g',
		spassword: 'est quo ea',
		ts_from: 'Similique est et ullam autem occaecati perferendis voluptatem voluptatibus.',
		ts_to: 'odio',
		type_name: 'et recusandae est',
		user_created:
			'Enim nostrum sequi. Quae cumque voluptatibus quia aut voluptas perferendis repudiandae. Quidem quod aperiam aspernatur blanditiis voluptas. Corrupti saepe dolor. Eius autem corporis autem laudantium voluptatem eos.',
		title_type_name: 'occaecati',
	},
	{
		id: 21,
		title: 'Nostrum et doloribus incidunt eum magnam rem tempora sit. Voluptatem vitae qui quia dolores aut. Ratione architecto minima sequi reprehenderit totam.',
		id_course: 32,
		id_academic_year: 37,
		id_semester: 23,
		id_test_type: 46,
		id_user_created: 23,
		test_ordinal: 46,
		max_runs: 9,
		show_solutions: true,
		max_score: 13,
		password:
			'Excepturi autem aliquam.\nSimilique nihil labore quidem necessitatibus exercitationem autem voluptatem nulla.\nAnimi quia magnam et maiores debitis.',
		questions_no: 38,
		duration_seconds: 29,
		pass_percentage: 'Soluta sed rerum. Pariatur modi provident. Quia et et molestiae occaecati sit est qui ea.',
		ts_available_from: 'Placeat earum amet voluptas.',
		ts_available_to:
			'Omnis commodi sequi quam vero fuga et. Nemo adipisci non aut molestiae quia. Consequuntur itaque dolorem quo. Id enim laborum non omnis laborum possimus assumenda delectus. Voluptatem itaque fuga qui voluptates maiores qui nisi nemo. Exercitationem numquam ut aperiam non quos quo officia repellat.\n \rFugiat adipisci voluptate et. Quas et hic voluptas sint pariatur dolorum. Vitae aliquam et nobis. Qui voluptatibus in eligendi a ducimus voluptatum reprehenderit. Voluptatem et sed tenetur et.\n \rReprehenderit atque quis sapiente beatae quae rem dignissimos. Vel cupiditate voluptatibus veniam voluptatem. Natus earum dolores facere quam laudantium quasi fuga. Nesciunt ut consequatur commodi accusamus voluptatibus. Reiciendis sunt saepe repellat ea illum non fuga provident id.',
		ts_created:
			'Dolorem aspernatur praesentium sunt officia. Veritatis sunt sed repudiandae exercitationem deleniti esse. Id tempore aut eaque qui earum minus. Quisquam vel sequi voluptatem debitis. Incidunt nisi odit culpa voluptas. Sed aut omnis non et officiis omnis dolores dolor.',
		ts_modified: 'ratione',
		user_modified:
			'Totam dolore quia impedit doloremque aut non qui.\nUt sunt at nostrum ad nisi voluptatibus.\nFugit et fugiat et exercitationem alias id.\nEst eos velit eligendi ipsum ut atque.\nSed et impedit eligendi rerum cum ipsa nostrum mollitia.',
		review_period_mins: 17,
		hint_result: true,
		test_score_ignored: false,
		title_abbrev:
			'Numquam ratione ipsum et.\nQuia ratione esse ut eius.\nRepellendus quia id in soluta dicta exercitationem eius numquam fugiat.',
		async_submit: true,
		trim_clock: false,
		id_email_reminder_scheme: "tRyPaz#s}'",
		allow_anonymous: true,
		is_competition: true,
		eval_comp_score: "16LU'b*uL0",
		upload_file_no: 2,
		upload_file_limit: 10,
		forward_only: false,
		id_parent: '{Ss>*]k<$f',
		allow_anonymous_stalk: false,
		use_in_stats: false,
		is_global: false,
		is_public: false,
		id_plag_detection_algorithm: 'Soqt,phJ8P',
		spassword: 'fugiat',
		ts_from: 'iusto',
		ts_to: 'Tempore qui dolor ullam quas rem soluta nihil voluptas. Exercitationem similique doloremque. Repellendus enim est quia. In hic optio doloremque harum aspernatur voluptatem vero sapiente eum. Vel minus facilis asperiores sunt est quia est debitis officiis.\n \rAt assumenda et aut quia nemo quaerat. Id culpa deserunt et minus. Modi repellendus et. Fugiat ut quia exercitationem aperiam vel eaque ipsa. Cumque pariatur quia architecto doloribus voluptas dolores distinctio consequatur.\n \rVoluptatem ipsum quia dignissimos molestiae aut voluptas dolore molestiae sed. Beatae aperiam maxime aliquid iste sed dolorem quos commodi temporibus. Temporibus aut magni est consequuntur voluptatibus excepturi enim molestiae fugiat.',
		type_name:
			'Dolor optio voluptatem. Excepturi enim sunt accusantium rerum. Expedita laudantium et mollitia et sunt et rerum dolorum.',
		user_created:
			'Expedita sed sed sit. Dolorum autem qui quia. Non dolor est ea id molestiae dolores ea qui. Voluptatibus laudantium praesentium molestiae aut exercitationem aliquam et et qui. Beatae consectetur distinctio aut.\n \rPossimus et eum optio non officia error nesciunt cupiditate quaerat. Eos dolores nisi nihil quasi quasi. Ad suscipit quibusdam accusamus. Dolorum voluptatem veritatis animi quasi id consequatur sapiente et modi. Ut enim quae adipisci odit.\n \rConsequatur qui odio ea recusandae. Minus nulla quia consequatur dolorem aliquam quisquam ea voluptas. Ut quis voluptas harum. Id et veniam harum alias ea cumque aut.',
		title_type_name:
			'Aut dicta atque minus corrupti quia. Iure occaecati quam perferendis. Magni et veritatis veritatis. Aut qui optio. Alias non et pariatur error. Et nihil sit.',
	},
];

const skeletonColumns = [
	{ field: '', header: '#' },
	{ field: 'id', header: 'Id' },
	{ field: 'ordinal', header: 'Ordinal' },
	{ field: 'title_type_name', header: 'Title' },
	{ field: 'user_created', header: 'User created' },
	{ field: 'max_runs', header: 'Max runs (0=∞)' },
	{ field: '', header: 'Show results' },
	{ field: 'max_score', header: 'Max score' },
	{ field: 'spassword', header: 'Password' },
	{ field: 'questions_no', header: 'No of qs' },
	{ field: 'duration_seconds', header: 'Duration (s)' },
	{ field: 'pass_percentage', header: 'Pass %' },
	{ field: 'ts_from', header: 'Valid from' },
	{ field: 'ts_to', header: 'Valid to' },
	{ field: '', header: 'Delete' },
	{ field: '', header: 'Edit' },
];

const exportCSV = () => lectureTableDt.value.exportCSV();
</script>

<template>
	<div class="container-fluid no-x">
		<Card>
			<template #title>Quizzes for the current course and year:</template>
			<template #content>
				<div class="row d-flex justify-content-start">
					<div class="ml-5">
						<h5>
							Create a new exam of the following type
							<Dropdown
								v-model="selectedTest"
								:options="tests"
								:placeholder="selectedTest?.name"
								option-label="name"
								class="me-2 ms-2"></Dropdown>
							<Button label="Create" icon="pi pi-plus-circle" class="center p-button-rounded"></Button>
						</h5>
					</div>
					<br />
				</div>
				<DataTable
					ref="lectureTableDt"
					v-model:filters="filters"
					:value="lectureTable"
					filter-display="menu"
					show-gridlines
					class="p-datatable-sm"
					:rows="7"
					paginator>
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
								class="p-button-sm ml-3"
								@click="exportCSV" />
						</div>
					</template>

					<template #empty><span class="center">No data to show.</span></template>
					<Column field="" header="#">
						<template #body="{ index }">
							<div>{{ index + 1 }}</div>
						</template>
					</Column>
					<Column field="id" header="Id" sortable>
						<template #body="{ data }">
							<div class="number-align">{{ data.id }}</div>
						</template>
					</Column>
					<Column field="test_ordinal" header="Test ordinal" sortable>
						<template #body="{ data }">
							<div class="number-align">{{ data.test_ordinal }}</div>
						</template>
					</Column>
					<Column field="title_type_name" header="Title" sortable>
						<template #body="{ data }">
							<strong>{{ data.title }}</strong>
							<p>
								<em>
									<small>{{ data.type_name }}</small>
								</em>
							</p>
						</template>
					</Column>
					<Column field="title_abbrev" header="Abbrev." sortable></Column>
					<Column field="max_runs" header="Max runs (0=∞)" sortable>
						<template #body="{ data }">
							<div class="number-align">{{ data.max_runs }}</div>
						</template>
					</Column>
					<Column field="test_flags" header="Global Public UseStats ScoreIgnored" sortable>
						<template #body="{ data }">
							<div class="center-align">
								<span :class="flagsPill(data.test_flags)">
									{{ data.test_flags }}
								</span>
							</div>
						</template>
					</Column>
					<Column field="show_solutions" header="Show solutions" sortable>
						<template #body="{ data }">
							<div class="center-align">
								<font-awesome-icon
									:icon="data.show_solutions ? 'check-circle' : 'times-circle'"
									:class="data.show_solutions ? 'success' : 'failure'"
									class="icon" />
							</div>
						</template>
					</Column>
					<Column field="max_score" header="Max score" sortable>
						<template #body="{ data }">
							<div class="number-align">{{ data.max_score }}</div>
						</template>
					</Column>
					<Column field="spassword" header="Password" sortable></Column>
					<Column field="questions_no" header="No of qs" sortable>
						<template #body="{ data }">
							<div class="number-align">{{ data.questions_no }}</div>
						</template>
					</Column>
					<Column field="duration_seconds" header="Duration (s)" sortable>
						<template #body="{ data }">
							<div class="number-align">{{ data.duration_seconds }}</div>
						</template>
					</Column>
					<Column field="ts_from" header="Valid from" sortable>
						<template #body="{ data }">
							<span class="w-100">{{ new Date(data.ts_from).toISOString().split('T')[0] }}</span>
							<p class="text-xs text-500">
								<em>
									{{ humanize(new Date(data.ts_from)) }}
								</em>
							</p>
						</template>
					</Column>
					<Column field="ts_to" header="Valid to" sortable>
						<template #body="{ data }">
							<span class="w-100">{{ new Date(data.ts_to).toISOString().split('T')[0] }}</span>
							<p class="text-xs text-500">
								<em>
									{{ humanize(new Date(data.ts_to)) }}
								</em>
							</p>
						</template>
					</Column>
					<Column field="" header="Delete">
						<template #body="{ index }">
							<Button class="p-button-danger" @click="deleteE(index)">
								<font-awesome-icon icon="trash"></font-awesome-icon>
							</Button>
						</template>
					</Column>
					<Column field="" header="Edit">
						<template #body="{ data }">
							<Button class="p-button-success" @click="edit(data.id)">
								<font-awesome-icon icon="pen-to-square"></font-awesome-icon>
							</Button>
						</template>
					</Column>
				</DataTable>
			</template>
		</Card>
	</div>
</template>
