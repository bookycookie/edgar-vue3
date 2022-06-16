<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ApiService from '@/services/ApiService';
import { Test } from '@/models/admin/exams/Test';
import { LectureInstancesTable } from '@/models/admin/exams/LectureInstancesTable';
import humanize from '@/utilities/date-humanizer/humanizer';
import { FilterMatchMode } from 'primevue/api';

const appUserId = 46;
const courseId = 477;
const academicYearId = 2020;
const service = new ApiService();

const lectureInstancesTable = ref<LectureInstancesTable[]>([]);

onMounted(async () => {
	lectureInstancesTable.value = await service.getManyAsync<LectureInstancesTable>('/lecture_instances_table', {
		appUserId: appUserId,
		courseId: courseId,
		academicYearId: academicYearId,
	});
});

const quizInstancesDt = ref();
const filters = ref({
	global: { value: '', matchMode: FilterMatchMode.CONTAINS },
});

const skeletonLectureInstanceData = [
	{
		id: 22,
		ts_start: 'voluptatem sed ut',
		ts_end: 'odio',
		title: 'Iusto mollitia perferendis et nobis distinctio dicta. Officia harum velit. Voluptates ipsam mollitia non dolor rerum consequatur quae reiciendis reiciendis. Similique blanditiis culpa sit non rerum ut praesentium.\n \rEarum quas nostrum. Magni laborum corrupti a ipsum sed. Quam quos enim eum nulla. Aperiam aut facere quia esse ipsam.\n \rRem consequuntur rerum voluptates temporibus magni possimus architecto. Possimus vitae ut. Qui dolorum quasi praesentium aut.',
		max_score: 2,
		spassword:
			'Sed amet non libero nihil. Voluptatem laudantium dolorem ut quis sequi unde soluta rem. Ipsum iure tenetur.',
		questions_no: 21,
		user_started:
			'Quod voluptatibus officia ut officiis. Explicabo ab accusamus quod. Itaque suscipit quidem molestiae cupiditate non ipsam ducimus quos. Sint architecto corrupti quis rerum recusandae maiores nesciunt possimus. Quisquam possimus quia quae nulla velit.\n \rQuibusdam nisi officiis itaque quia sequi magni aperiam aspernatur. Tempora quae sapiente voluptatem placeat debitis magni veritatis quo tenetur. Fugiat minus iure quia numquam tempore. Id laboriosam quam cum alias ut aut et eos.\n \rPorro quia vel voluptate sit consectetur ipsam aut aspernatur. Sequi pariatur ipsam voluptatem exercitationem quisquam aut excepturi aliquid vel. Facilis voluptas et quod molestiae autem temporibus ipsam. Ipsa voluptas placeat voluptatem.',
		students_no: 12,
	},
	{
		id: 49,
		ts_start: 'Autem dolorum quod minima sed. Et ipsa soluta accusamus illum labore.',
		ts_end: 'Suscipit qui molestias amet magnam id. Perspiciatis rerum saepe provident eaque rerum vero fugit necessitatibus. Esse eum et atque voluptatem dicta aut et quia rerum.\n \rDicta unde mollitia nemo quo. Labore delectus optio voluptatem perferendis porro commodi enim nulla. Qui natus pariatur alias. Recusandae libero et. Neque ab totam corporis impedit et aut quasi. Natus omnis cumque doloribus ea ut officia.\n \rAsperiores mollitia velit consectetur eligendi et consequatur quibusdam voluptatem. Totam aliquam sit maiores quas sint delectus velit perspiciatis quibusdam. Accusamus dolor optio qui excepturi facilis maxime adipisci ducimus labore. Quos et dignissimos quia quia id mollitia esse. Quis ut dolor in qui fugiat eos.',
		title: 'Laudantium perferendis rem ex sunt animi dolores totam. Et dolorem est aperiam sint adipisci sed quasi eligendi. Cum porro explicabo asperiores aspernatur molestiae minima. Voluptatem eos dicta magni quo nobis explicabo quaerat voluptatem odio. Enim nulla magnam ut quis enim doloribus omnis. Officia quia reprehenderit tempore vel ea nobis ipsum.',
		max_score: 22,
		spassword:
			'Omnis aliquam ipsam autem harum eveniet impedit. Temporibus aspernatur libero blanditiis consectetur reprehenderit necessitatibus assumenda velit quis. Quas eum deserunt ad et consequatur accusamus doloremque rerum.',
		questions_no: 17,
		user_started: 'est',
		students_no: 24,
	},
	{
		id: 36,
		ts_start:
			'Est quidem reiciendis architecto recusandae nihil vero sunt architecto. Delectus vel iure ut est. Et dolores perferendis aut sint eos quidem illo blanditiis ut. Veritatis enim sed beatae.\n \rEst est nobis non autem aut dicta. Provident laudantium possimus iure earum. Quaerat facere rerum. Non quae vel est. Quo consequatur soluta unde quaerat. Repellendus perspiciatis ad.\n \rSed et iste id sint qui. Repellat explicabo consequatur. Enim in velit delectus.',
		ts_end: 'Voluptates id est consequatur minima animi ad quis illum.\nQui distinctio minima laborum alias molestias est aliquid.\nRatione temporibus voluptate.',
		title: 'facere',
		max_score: 17,
		spassword:
			'Quidem asperiores eum sunt. Quia ut odit fugiat numquam. Repellat autem vel vel quia. Tenetur optio qui animi enim sequi sit numquam aperiam.\n \rRerum in aliquam. Quia laborum eligendi aliquam aliquid ad vitae ipsum deleniti. Asperiores ipsam consequuntur blanditiis dignissimos qui quam dolores quibusdam ut. Sit animi nobis officiis magni suscipit. Excepturi eos nulla sint pariatur aliquam quis omnis. Error quo tempore quia quam numquam.\n \rNobis qui porro velit amet sit et assumenda deleniti. Explicabo rerum a ullam. At qui et molestiae amet recusandae dolor rerum eveniet. Quia nulla quod dolorum sit eveniet est quia.',
		questions_no: 41,
		user_started: 'Nostrum et rem quisquam quam quod voluptas repudiandae unde.',
		students_no: 10,
	},
	{
		id: 28,
		ts_start: 'ipsam',
		ts_end: 'Expedita ullam iste saepe consequatur eos quis.\nFugiat eos aut molestiae quo pariatur a qui.\nError vel eveniet ut exercitationem.\nNam asperiores inventore voluptatem quo voluptas quasi sed.',
		title: 'quas',
		max_score: 5,
		spassword: 'Qui voluptate in non quia voluptatibus voluptatibus enim.',
		questions_no: 42,
		user_started:
			'Maiores quo delectus a molestiae officiis enim sit odio. Consequatur a quae placeat et ipsam quia. Aut nostrum quas in repudiandae et consequatur incidunt.',
		students_no: 34,
	},
	{
		id: 40,
		ts_start:
			'Eveniet ut pariatur reprehenderit facere magnam cupiditate. Praesentium soluta beatae. Totam qui in sequi voluptatem dolorem et soluta tenetur delectus. Similique aperiam officia modi non quo qui asperiores.\n \rModi iste repellat ut nobis dolorem eaque quo et at. Sit occaecati velit adipisci et eveniet qui rem possimus porro. Quas iusto nesciunt atque unde ex consequatur rerum dolore occaecati. Odit dignissimos laborum consequatur. Et consequatur et aut maxime voluptatum hic nisi nulla modi. Quam magni inventore voluptatum quo dolorem adipisci esse nisi.\n \rPossimus error qui id magnam dolore. Quis aut esse. Numquam impedit nulla accusamus eos necessitatibus distinctio. Iste dolorem quia omnis laboriosam vel beatae nihil et consequatur. Harum ad error ad alias qui. Possimus in hic voluptatem maiores iste minus rem neque deserunt.',
		ts_end: 'Totam quo rerum perspiciatis eos sapiente id id et. Sed ut et tenetur voluptas quia. Dolores praesentium odit. Error quia autem. Tenetur ut omnis saepe velit est neque blanditiis assumenda veritatis.\n \rAtque non illum eos inventore deleniti. Impedit dolor quibusdam aut. Dolorem aut eligendi repellat cupiditate sit. Laboriosam et similique dicta voluptatem non. Reprehenderit est ducimus et possimus nisi est dolorem ex. Et tempora quam quae et rerum labore atque vero molestiae.\n \rLibero voluptates placeat libero inventore. Porro quasi adipisci est. Numquam itaque hic illo possimus in.',
		title: 'Libero quasi sint nam eveniet vel.\nTenetur et voluptate quia.',
		max_score: 18,
		spassword:
			'Provident quis expedita distinctio tenetur. Quia maiores sed animi. Provident ullam rerum nulla non ut. Nesciunt inventore consequuntur omnis id et et quia omnis. Provident doloribus sed ullam officia blanditiis aut sit et. Sit quidem in harum praesentium aspernatur.',
		questions_no: 49,
		user_started: 'Est perspiciatis error enim accusamus quas nemo sint. Nihil a commodi.',
		students_no: 44,
	},
	{
		id: 47,
		ts_start:
			'Aut et molestiae harum accusamus est.\nPariatur animi delectus sint similique mollitia.\nQui ullam fugit amet.\nQuas fuga sapiente autem exercitationem laboriosam esse.\nDolor doloremque dolore consectetur quia adipisci dolor molestiae sunt.',
		ts_end: 'vero',
		title: 'laudantium inventore dicta',
		max_score: 30,
		spassword: 'dolore ut dolore',
		questions_no: 7,
		user_started:
			'Quia qui velit laboriosam amet quasi placeat officiis. Doloremque officiis ad laboriosam vitae. Quis est iusto quaerat esse earum quidem aut. Voluptatem eos aut et iste.',
		students_no: 29,
	},
	{
		id: 14,
		ts_start:
			'Qui aut officiis sed odit sit id. Ut autem autem quia eos sed iusto quae veritatis. Minima aut eligendi commodi aut expedita debitis expedita. Enim unde optio optio. Et mollitia possimus. Placeat modi voluptatibus velit molestiae omnis eius consequatur unde.\n \rQuasi dolore numquam. Temporibus reiciendis sit et non deleniti quod quia maxime aut. Voluptatem in asperiores quas aliquam repudiandae voluptas. Qui non impedit sunt suscipit alias cupiditate ut similique commodi. Rem optio dignissimos quas sit tempore et quia.\n \rEsse necessitatibus sunt repellat harum quos eos laborum. Sunt perspiciatis unde ut corrupti in mollitia eveniet amet unde. Nostrum consequatur et sed sit enim doloremque architecto eum eligendi.',
		ts_end: 'asperiores',
		title: 'Et dolor in architecto.',
		max_score: 14,
		spassword: 'Perspiciatis deserunt omnis quaerat reprehenderit harum eveniet.',
		questions_no: 39,
		user_started: 'qui',
		students_no: 27,
	},
	{
		id: 38,
		ts_start: 'ab',
		ts_end: 'Sunt quae possimus quaerat nesciunt.',
		title: 'Voluptatem impedit incidunt.',
		max_score: 13,
		spassword:
			'Voluptas reprehenderit nemo aut.\nConsequatur et ut minus modi quia reprehenderit error dolores.\nAlias praesentium delectus.\nEst et hic.',
		questions_no: 10,
		user_started: 'Repellat omnis expedita. Dolorem similique eum eos dolorem accusamus eos.',
		students_no: 43,
	},
	{
		id: 16,
		ts_start: 'et',
		ts_end: 'Quia nulla quasi maxime dignissimos. Sed ducimus magni rerum sint sint dolore. Rerum dolore ut necessitatibus neque numquam assumenda eaque maxime. Officiis consequatur rerum. Quis odio consequatur nihil aut.\n \rDolorem excepturi quibusdam beatae voluptatem aperiam quos. Suscipit laudantium exercitationem iusto debitis sit maiores. Iste voluptatem aperiam quam qui dolorem occaecati quisquam. Omnis sunt non quia dolores. Iusto vel sapiente. Consequatur quis accusamus soluta libero est illo sint et autem.\n \rId nesciunt laboriosam similique et tempora facilis voluptatem dolorum sapiente. Sed laborum ut et non. Id rem deleniti et delectus.',
		title: 'Aut qui laborum aspernatur voluptas.\nAut qui et consequatur.',
		max_score: 31,
		spassword:
			'Quis fugiat dolorem numquam mollitia quo animi sit.\nTempora adipisci eius ut vel vero delectus nisi.\nRepellendus qui laborum qui rem facere perferendis.\nQuaerat aspernatur inventore accusantium.',
		questions_no: 18,
		user_started:
			'Quo natus est occaecati et ducimus veritatis natus vero architecto. Sit sapiente alias rerum impedit velit ipsum et. Doloribus in provident accusamus et.',
		students_no: 18,
	},
	{
		id: 3,
		ts_start: 'et voluptatibus optio',
		ts_end: 'Aut quia sit asperiores quis. Officiis blanditiis est qui eveniet. Quibusdam accusamus expedita doloremque velit dicta saepe. Tempore voluptatem aspernatur tenetur aperiam nesciunt nostrum. Similique consequatur dolorum sed vitae dolor.\n \rQuo ullam ipsa aperiam ipsa soluta consequuntur ut. Repellat consequatur et dolorum neque nam libero voluptas. Corporis omnis possimus error dolor reprehenderit molestias hic. Recusandae magni neque. Quidem facere voluptatem ad dolorem.\n \rSuscipit ea nihil recusandae. Non id voluptatibus consequuntur corporis. Eligendi quibusdam sequi itaque quod. Occaecati quo repudiandae sed dignissimos corrupti aperiam inventore. Autem suscipit sunt in rerum.',
		title: 'Voluptas qui nostrum quia voluptatum quis et occaecati itaque.',
		max_score: 24,
		spassword:
			'Quas accusamus ea necessitatibus delectus dolores nesciunt nisi. Doloribus autem sit qui tempora et voluptatem ipsam et. Quos impedit vero asperiores sit nobis. Sit aliquam aut ex.',
		questions_no: 17,
		user_started:
			'Illum ut alias est qui atque. Voluptas tempora cumque assumenda ea pariatur. Qui provident dolor magnam voluptatem at. Dolorem voluptates porro ex nisi voluptatibus. Ratione alias quo possimus voluptas est tenetur quibusdam.',
		students_no: 34,
	},
];

const skeletonColumns = [
	{ field: '', header: '#' },
	{ field: 'id', header: 'Id' },
	{ field: 'title', header: 'Title' },
	{ field: 'user_started', header: 'User started' },
	{ field: 'max_score', header: 'Max score' },
	{ field: 'spassword', header: 'Password' },
	{ field: 'questions_no', header: 'No of qs' },
	{ field: 'ts_start', header: 'Started' },
	{ field: 'ts_end', header: 'Finished' },
	{ field: 'students_no', header: 'Students' },
];

const exportCSV = () => quizInstancesDt.value.exportCSV();
</script>

<template>
	<div class="container-fluid">
		<Card>
			<template #title>All quiz instances:</template>
			<template #content>
				<DataTable
					ref="quizInstancesDt"
					v-model:filters="filters"
					:value="lectureInstancesTable"
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

					<Column field="title" header="Title" sortable>
						<template #body="{ data }">
							<strong>{{ data.title }}</strong>
						</template>
					</Column>

					<Column field="max_score" header="Max score" sortable>
						<template #body="{ data }">
							<div class="number-align">{{ data.max_score }}</div>
						</template>
					</Column>
					<Column field="spassword" header="Password" sortable>></Column>
					<Column field="questions_no" header="No of qs" sortable>
						<template #body="{ data }">
							<div class="number-align">{{ data.questions_no }}</div>
						</template>
					</Column>
					<Column field="ts_submitted" header="Started" sortable>
						<template #body="{ data }">
							{{ new Date(data.ts_start).toLocaleDateString('hr-HR') }}
							<p>
								<em>
									<small>{{ humanize(new Date(data.ts_start)) }}</small>
								</em>
							</p>
						</template>
					</Column>
					<Column field="ts_submitted" header="Finished" sortable>
						<template #body="{ data }">
							{{ new Date(data.ts_end).toLocaleDateString('hr-HR') }}
							<p>
								<em>
									<small>{{ humanize(new Date(data.ts_end)) }}</small>
								</em>
							</p>
						</template>
					</Column>
					<Column field="students_no" header="Students" sortable>
						<template #body="{ data }">
							<div class="number-align">{{ data.students_no }}</div>
						</template>
					</Column>
				</DataTable>
			</template>
		</Card>
	</div>
</template>
