<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ApiService from '@/services/ApiService';
import { TestTable } from '@/models/admin/exams/TestTable';
import { Test } from '@/models/admin/exams/Test';
import humanize from '@/utilities/date-humanizer/humanizer';
import { FilterMatchMode } from 'primevue/api';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const courseId = 2000;
const academicYearId = 2020;
const appUserId = 46;

const toast = useToast();
const loading = ref(false);
const service = new ApiService();
const tests = ref<Test[]>([]);
const selectedTest = ref<Test>();

const testTable = ref<TestTable[]>([]);
const testTableDt = ref();

const skeletonTableData: TestTable[] = [
	{
		id: 45,
		title: 'Culpa incidunt sit et explicabo. Quidem iure vel enim ad delectus ipsam sit ratione. Veniam nam corrupti quo molestiae minima debitis quae aut quaerat. Cumque esse ut velit nihil amet. Sed corrupti atque minima est ut ea maiores et. Quibusdam quam sed ad.',
		id_course: 14,
		id_academic_year: 28,
		id_semester: 47,
		id_test_type: 10,
		id_user_created: 45,
		test_ordinal: 36,
		max_runs: 23,
		show_solutions: false,
		max_score: 30,
		password: 'magni cupiditate ut',
		questions_no: 46,
		duration_seconds: 30,
		pass_percentage: 14,
		ts_available_from:
			'Quibusdam omnis deleniti deleniti voluptatem. Repudiandae sapiente explicabo et eum quibusdam possimus vero ut. Deleniti molestias nemo.\n \rExcepturi omnis non neque doloribus. Dolore cumque natus. Magnam necessitatibus eaque dicta.\n \rSapiente aliquam temporibus illo qui quae accusamus consequatur autem. Esse facilis sapiente non dignissimos sed optio. Aut dolor illo sapiente accusamus. Placeat consequatur in quisquam ipsum.',
		ts_available_to: 'Ipsum illo esse similique sed.\nEius qui maxime cumque quis.',
		ts_created:
			'Reprehenderit aliquid consequatur et dolores in. Rerum perspiciatis ut sunt dolorem repellendus est est expedita corporis. In fugit architecto doloremque sed consectetur qui quidem odio reiciendis. Reprehenderit quaerat ipsam. Molestiae magni exercitationem dolore non voluptatem aut enim aut. Voluptas est et tempora.',
		ts_modified: 'sit est vel',
		user_modified: 'ducimus molestiae vero',
		review_period_mins: 22,
		hint_result: false,
		test_score_ignored: false,
		title_abbrev:
			'Et quasi eaque laudantium provident quia. Inventore consequuntur consequatur. Reprehenderit asperiores quia quos illo rerum rerum esse.',
		async_submit: false,
		trim_clock: false,
		id_email_reminder_scheme: 'K9w/$sZ7Wo',
		allow_anonymous: false,
		is_competition: true,
		eval_comp_score: 'Sqyk^N"hv+',
		upload_file_no: 7,
		upload_file_limit: 47,
		forward_only: true,
		id_parent: ':+2SJOskEC',
		allow_anonymous_stalk: true,
		use_in_stats: true,
		is_global: true,
		is_public: false,
		id_plag_detection_algorithm: '.o:!Jc|?!`',
		spassword:
			'Consequatur esse magni dolor omnis. Nesciunt velit iure esse neque non quam aut quo tempora. Placeat molestias sed nobis. Asperiores aspernatur corrupti maxime labore sed velit ut aut enim. Dicta fugit harum amet eius natus aut et culpa voluptatibus.\n \rPorro porro voluptatibus consequatur est dignissimos hic. Assumenda et quos quis ipsum. Quia optio ut recusandae repellat.\n \rOccaecati ut accusamus praesentium. Maxime eum corrupti. Voluptatibus repellat ipsam non. Eius modi modi suscipit voluptatem dolore modi voluptatem.',
		ts_from:
			'Dolor ut recusandae doloremque deserunt. Laudantium placeat dolore est ut et molestiae nulla soluta numquam. Beatae vel non.\n \rVelit rerum iure minima. Architecto eum in. Sunt soluta sed est.\n \rDignissimos occaecati officia aut iusto corrupti maxime. Velit voluptatibus cum minima ad molestiae dolorum. Et possimus iure a ducimus earum consectetur illo.',
		ts_to: 'Eum suscipit perspiciatis voluptate tempora.\nCommodi adipisci accusamus minus doloremque voluptatum autem.\nAut veritatis eius ducimus rerum eius autem sit minima.\nSuscipit est est sunt totam eum necessitatibus assumenda voluptas velit.\nQuod placeat quidem earum est repudiandae placeat optio voluptas vero.',
		type_name: 'Sint nostrum inventore eos.',
		user_created:
			'Minus asperiores et doloremque odio. Sit aspernatur ut. Harum aut rem natus sit. Error odio ducimus non.\n \rQui est accusamus eaque amet quis dolorum rerum inventore. Tempora repellendus possimus facilis consequatur deserunt voluptatem sint excepturi. Laborum voluptatem qui vero nobis blanditiis.\n \rTempore qui et placeat quos harum ratione occaecati adipisci sequi. Quia cumque sed ea omnis. Ut ab sed vitae. Nihil magnam distinctio culpa laboriosam provident quae ut.',
		test_flags:
			'Voluptas voluptas fugiat enim tempora aut facilis. Aut quia doloremque vel tempora dolor et rerum. Ipsa et sed earum quo vitae fugit recusandae. Magni ut atque enim optio.\n \rAssumenda excepturi aliquam facilis doloremque enim laboriosam aut sapiente. Soluta voluptas dolorem officia tempora et dolores odio voluptas corporis. Deserunt numquam ab quidem eaque accusamus qui.\n \rDignissimos ullam dolores amet neque ut. Eius quia fugiat enim nemo at eaque alias aperiam provident. Quidem vitae corporis neque sapiente quod eum sed sed. Architecto earum aliquid odio quibusdam sit in. Atque iure nobis.',
		title_type_name:
			'Eaque cumque nobis tenetur aut et. Alias itaque voluptatem omnis. Cumque sunt et aspernatur exercitationem qui. Dolor eum provident ab enim.',
	},
	{
		id: 12,
		title: 'Mollitia perspiciatis excepturi nihil corporis consequatur iste. Occaecati quod hic quo consectetur animi atque quam rerum possimus. Eos deleniti fuga illum dolor est cumque quis. Quas ipsum est enim et non rerum non blanditiis. Architecto rerum dolores assumenda itaque debitis. Possimus suscipit fugiat eos sunt adipisci fugit.',
		id_course: 14,
		id_academic_year: 27,
		id_semester: 2,
		id_test_type: 26,
		id_user_created: 34,
		test_ordinal: 7,
		max_runs: 0,
		show_solutions: true,
		max_score: 10,
		password: 'Autem soluta commodi vel et aspernatur soluta dolorem eum soluta.',
		questions_no: 32,
		duration_seconds: 23,
		pass_percentage: 34,
		ts_available_from:
			'At voluptatem est perferendis ducimus iure sequi repellendus aut. Eius ut dolor facere libero ab dolorem aut. A non et voluptatem et omnis aspernatur. Consequatur quia rerum officiis omnis in. Amet quam modi voluptatem in accusantium.\n \rQui occaecati delectus. Adipisci maiores similique omnis labore quas architecto. Deleniti quia necessitatibus.\n \rExplicabo unde et. Qui dicta ut deleniti. Sapiente asperiores in accusantium tempore ex.',
		ts_available_to: 'Consequatur aperiam qui quis est.',
		ts_created:
			'Ducimus id exercitationem aut ratione libero et. Ipsa tenetur non doloribus modi consequuntur sunt voluptas. Autem aut unde nam harum officiis minima.\n \rQuod minima aliquid voluptatem et asperiores repudiandae voluptas. Et dolorem cumque fuga est inventore ipsa. Maiores nam velit. Omnis atque alias veniam molestias veniam dignissimos aut reiciendis. Quas qui quisquam nemo optio et aliquam aut.\n \rSaepe dolor dolores adipisci voluptates quisquam enim ut fugiat dolor. Voluptatem molestias illum perferendis eos et. Culpa neque qui cumque. Libero quasi aut. Culpa voluptatem asperiores quaerat dolores cupiditate quas voluptatem.',
		ts_modified: 'sed corrupti assumenda',
		user_modified: 'assumenda',
		review_period_mins: 19,
		hint_result: false,
		test_score_ignored: false,
		title_abbrev: 'sunt',
		async_submit: true,
		trim_clock: true,
		id_email_reminder_scheme: '!&S>k#_*dU',
		allow_anonymous: false,
		is_competition: false,
		eval_comp_score: '=Np1sg)!rX',
		upload_file_no: 45,
		upload_file_limit: 18,
		forward_only: false,
		id_parent: "t'8#<Hn\\?P",
		allow_anonymous_stalk: true,
		use_in_stats: true,
		is_global: true,
		is_public: true,
		id_plag_detection_algorithm: '#D9WBW"W;&',
		spassword: 'molestias natus aut',
		ts_from:
			'Et est dignissimos aliquam esse laudantium error. Qui et ut odit est maiores. Est aliquid suscipit dolore.',
		ts_to: 'qui',
		type_name:
			'Et officia explicabo consequatur nihil amet. Possimus ut beatae quos nobis temporibus ut. Provident minus voluptatum. Possimus explicabo harum in id.\n \rTotam eveniet voluptatum reprehenderit labore dolorem. Quis nihil in asperiores debitis quia minima. Beatae et reiciendis minus numquam harum ad libero eum.\n \rUt asperiores in itaque. Consequatur est suscipit sit. Voluptatibus dolor animi asperiores aut nulla iusto. Consequuntur placeat quam debitis aut sapiente voluptatem illo nobis. Error reprehenderit alias quisquam quas et.',
		user_created:
			'Aut quidem optio vitae repellat dolorem sit. Est tempore est et. Rerum beatae vero quia ut officia porro officiis.',
		test_flags:
			'Rem porro saepe quam ea dolor quisquam qui.\nNon culpa nemo accusantium voluptates sit maiores nostrum.\nVel fuga numquam ut.',
		title_type_name:
			'Incidunt deserunt est omnis ipsa molestiae quia. Dignissimos atque in mollitia. Alias tempora repellendus quisquam architecto eos id.\n \rRatione est harum eum cupiditate cupiditate. Adipisci magni fugiat officia. Ipsa sed vel distinctio similique natus et qui enim.\n \rConsequuntur id sequi. Sed temporibus et facilis quam. Consequatur qui commodi aspernatur beatae.',
	},
	{
		id: 16,
		title: 'Voluptatem repellendus consequatur animi error quo quo dolor repudiandae laudantium. Ipsa aspernatur quis. Ipsa illo labore quod et voluptas quia. Quis est incidunt rem voluptatem minima qui et dolorem et. Fuga quidem et.\n \rNihil totam molestiae et accusantium natus. Consequatur nemo est expedita minima incidunt atque. Non doloribus consequatur rem et iure natus eligendi sint.\n \rEt quae facilis accusamus veniam quae. Id soluta iure aperiam odit. Eos placeat autem odio assumenda maiores omnis fugiat cupiditate provident.',
		id_course: 18,
		id_academic_year: 38,
		id_semester: 40,
		id_test_type: 40,
		id_user_created: 16,
		test_ordinal: 21,
		max_runs: 37,
		show_solutions: false,
		max_score: 36,
		password: 'Aliquam quae consectetur soluta ut.',
		questions_no: 20,
		duration_seconds: 35,
		pass_percentage: 32,
		ts_available_from:
			'Omnis provident at fugiat corporis ut unde. Est eum adipisci expedita voluptates eveniet consequatur occaecati. Quibusdam et ratione aliquid repellat dolores. Sint eaque maiores sit provident animi facilis aliquam nemo. Architecto voluptas ut non sunt dolores.',
		ts_available_to: 'Maxime aut molestiae et autem nihil non et consequatur ad.',
		ts_created:
			'Iusto aut ab reiciendis voluptas et similique. Asperiores inventore assumenda eos eum voluptatibus fugit. Autem illo consequatur ut voluptate deserunt voluptatibus occaecati. Facilis itaque fuga qui odit laudantium unde sint natus sapiente.',
		ts_modified:
			'Ea animi velit ut ducimus nam laborum optio. Et molestias deserunt earum. Aut magnam neque. Enim eum minima nemo. Nisi quidem aut quo corporis nobis ratione enim.\n \rAmet voluptates optio dolorum qui nam. Qui voluptate alias sapiente totam. Consequatur rerum cumque et et molestiae et. Tenetur eligendi enim velit sit non. Quibusdam iure soluta veritatis ab est.\n \rFugit laboriosam ipsam nemo nemo. Ut accusantium sapiente delectus et. Qui ipsa aut ipsum autem ipsum eos ut eveniet. Et voluptas qui officia aut molestiae voluptatibus perspiciatis nam. Et consequuntur omnis non magni iure quod dignissimos aperiam. Quod atque corporis maxime perspiciatis ullam iure.',
		user_modified:
			'Possimus ullam tempore magnam quo ab neque. Deleniti nam ullam ut at. Necessitatibus consequuntur itaque similique iusto. Voluptatum dolore necessitatibus iste aperiam aut.',
		review_period_mins: 49,
		hint_result: false,
		test_score_ignored: false,
		title_abbrev:
			'Esse et aut autem est voluptatem molestiae placeat iure adipisci.\nEa soluta eos sunt blanditiis qui nisi in.\nVoluptatem fuga et vel.\nDucimus maiores nesciunt commodi dolorem impedit et vel et.',
		async_submit: false,
		trim_clock: true,
		id_email_reminder_scheme: 'VOvw9A<rl2',
		allow_anonymous: false,
		is_competition: false,
		eval_comp_score: 'tl:>e>v]Jm',
		upload_file_no: 44,
		upload_file_limit: 6,
		forward_only: false,
		id_parent: 'Q=p.)*[BMY',
		allow_anonymous_stalk: true,
		use_in_stats: true,
		is_global: false,
		is_public: false,
		id_plag_detection_algorithm: 'tg*ot}CTSl',
		spassword:
			'Sunt pariatur ipsam deleniti quae autem velit. Cumque beatae sequi velit numquam dolorem. Esse rerum libero tempora. Molestias dicta dolorem dolor quis reprehenderit minima qui deleniti sunt. Rem deleniti voluptas voluptatem maxime soluta. Modi fugiat ea aliquam mollitia iste.\n \rNobis et maiores illum recusandae et. Cumque unde enim hic. Qui odio fugiat aut dolor assumenda cumque. Nihil est quisquam temporibus. Aut veniam possimus aut totam optio nulla nesciunt hic.\n \rFugit rerum labore non ipsa voluptas sit natus. Non id officiis nesciunt hic aut architecto rerum beatae voluptas. Ut voluptatem aut laudantium possimus est eius sed. Id quam maiores exercitationem nam voluptas sed. Velit velit nihil rem at aperiam aspernatur illum consequuntur. Ad hic autem velit porro similique qui tempore tempore qui.',
		ts_from:
			'Ut blanditiis officia quae illo impedit. Accusantium est temporibus omnis aspernatur eligendi iure sit voluptatem. Ipsum perspiciatis est est. Pariatur commodi sequi minima deserunt.',
		ts_to: 'Officiis minima enim. Asperiores aliquam sapiente et error. Ex laborum distinctio voluptatibus ipsum quasi eius est.\n \rQuia qui minima. Architecto vero est eos in non itaque qui dicta dolorem. Quis iure eum asperiores ipsum mollitia dolore nihil. Reiciendis aut beatae consequatur. Ex incidunt suscipit inventore a rerum ut. Esse incidunt commodi ut velit eveniet molestias voluptatem.\n \rQui ea quidem veritatis atque aperiam ut necessitatibus. Nulla modi quasi fuga earum. Consequatur neque culpa assumenda explicabo accusantium blanditiis quia. Fuga quisquam ut pariatur sed. Ut dicta dolor placeat. Ea quaerat est vel consequatur.',
		type_name:
			'Eius nostrum quod vitae et sit iusto. Modi autem excepturi est esse aut dolores. Ullam facere non possimus ratione in voluptas. Cumque error laborum. Officia quia adipisci id et reiciendis minus nisi.\n \rQuia eum necessitatibus nisi ut enim velit molestiae ut aut. Eum optio perspiciatis maxime atque saepe magni est dignissimos. Natus quidem non dolores aspernatur.\n \rId debitis in est ut. Consequatur earum voluptatem eaque. Quo dignissimos quod. Numquam illo ut eius vitae esse autem. Harum illum voluptates. Qui quia nemo velit laborum omnis.',
		user_created:
			'Sed temporibus possimus voluptatum optio sequi.\nOdio exercitationem quibusdam qui sit.\nRepudiandae quia quia blanditiis sapiente recusandae aut hic.',
		test_flags: 'Corrupti debitis temporibus voluptates est.',
		title_type_name: 'Odit inventore non.',
	},
	{
		id: 25,
		title: 'nobis',
		id_course: 25,
		id_academic_year: 1,
		id_semester: 8,
		id_test_type: 10,
		id_user_created: 38,
		test_ordinal: 13,
		max_runs: 11,
		show_solutions: true,
		max_score: 29,
		password: 'eos ea omnis',
		questions_no: 45,
		duration_seconds: 31,
		pass_percentage: 49,
		ts_available_from: 'omnis',
		ts_available_to:
			'Ducimus nostrum est ut placeat quasi quia voluptatibus. Libero optio repellendus omnis eligendi. Cum cupiditate rerum et. Cupiditate asperiores sapiente quia distinctio nemo dolores quia. Eum ea veniam. Tempore quidem sunt minus eaque.\n \rDolorem quos ea est et in omnis et reiciendis numquam. Est molestias et. Quod repellat vitae a voluptas est repellendus rem.\n \rAliquid similique neque officia aut sint a dolorem. Enim id qui culpa magnam laboriosam cum. Aliquid quia voluptas.',
		ts_created: 'unde accusantium quaerat',
		ts_modified:
			'Alias iste et tempora. Corporis maxime consequatur veritatis officia fugiat placeat nisi perspiciatis pariatur. Eligendi hic quo sint.',
		user_modified: 'natus ex in',
		review_period_mins: 15,
		hint_result: false,
		test_score_ignored: false,
		title_abbrev: 'Consequuntur consequatur iure consequuntur sit dolorem qui voluptatum.',
		async_submit: false,
		trim_clock: true,
		id_email_reminder_scheme: "_2YW''tMMP",
		allow_anonymous: true,
		is_competition: false,
		eval_comp_score: ':qgg!HUP>w',
		upload_file_no: 27,
		upload_file_limit: 18,
		forward_only: false,
		id_parent: '&#n,8eS;Ca',
		allow_anonymous_stalk: true,
		use_in_stats: false,
		is_global: true,
		is_public: false,
		id_plag_detection_algorithm: "'W</8{ee#a",
		spassword: 'suscipit nisi nemo',
		ts_from:
			'Voluptatem a at eum eligendi veniam expedita non et veniam. At est enim mollitia numquam. Delectus dolorum omnis et consectetur voluptatem qui. Voluptate neque autem quo harum. Quaerat facere est ut a magnam quis modi aspernatur et.',
		ts_to: 'A aut iste delectus et.\nMaxime autem nisi voluptatem optio non magnam consequatur officia.\nReprehenderit molestias voluptatem magnam quaerat sed veritatis in id eum.',
		type_name: 'Laborum omnis dicta excepturi maiores ut praesentium sit nihil.',
		user_created: 'in explicabo sequi',
		test_flags: 'ut',
		title_type_name: 'architecto architecto temporibus',
	},
	{
		id: 23,
		title: 'Et ex ullam rem hic non.',
		id_course: 25,
		id_academic_year: 37,
		id_semester: 41,
		id_test_type: 18,
		id_user_created: 42,
		test_ordinal: 40,
		max_runs: 21,
		show_solutions: true,
		max_score: 42,
		password:
			'Quia explicabo soluta expedita animi dolores dolores facilis et similique. Quia est quae sequi a ipsum. Nostrum voluptate ipsum doloribus nihil qui a. Incidunt tenetur illum et autem qui. Quam eligendi assumenda non error ipsum autem vel. Et doloribus beatae quisquam aut quo beatae.\n \rEst atque voluptatem soluta tempora sequi maiores. Vero quis officiis est qui non omnis aut. Eos hic veniam et. Nobis nobis porro ea aspernatur dolorum ea soluta ut sed. Facere vel in molestiae voluptas maxime repellat.\n \rOccaecati sunt qui. Sed neque unde ducimus at incidunt numquam. Modi rerum at quae delectus voluptates et quia laborum. Corrupti consequuntur qui.',
		questions_no: 50,
		duration_seconds: 35,
		pass_percentage: 24,
		ts_available_from:
			'Eveniet quis hic autem.\nIpsa non consequatur enim illum ex repellat qui numquam suscipit.\nVoluptates ducimus cupiditate.',
		ts_available_to:
			'Distinctio ipsa et pariatur. Non placeat enim quam quisquam fugiat quidem corporis eum voluptatem. Laudantium ad explicabo eaque qui nisi nam. Laborum repellat eligendi. Sint illo doloremque nostrum similique doloremque.',
		ts_created:
			'In qui ipsam doloribus totam architecto illo sint enim. Id tenetur quos quia doloremque reiciendis autem maxime vero. Id expedita accusantium qui voluptas. Qui autem qui veritatis nesciunt aut.',
		ts_modified: 'Distinctio illum qui velit nobis omnis molestiae est.',
		user_modified:
			'Provident eius ea beatae fuga aliquid sint. Aut magni odit nobis rerum sequi culpa. Tenetur nostrum nostrum et.',
		review_period_mins: 0,
		hint_result: false,
		test_score_ignored: true,
		title_abbrev:
			'Praesentium vel labore sit ipsum optio.\nDeserunt nam dolorum beatae beatae exercitationem excepturi.\nEarum ipsa rerum fugit voluptatem accusamus.\nMolestias facere nobis nam corporis ut voluptates quibusdam numquam.',
		async_submit: false,
		trim_clock: true,
		id_email_reminder_scheme: 'RR|z;lK\\}g',
		allow_anonymous: false,
		is_competition: true,
		eval_comp_score: 'v}-n[|0^c6',
		upload_file_no: 5,
		upload_file_limit: 29,
		forward_only: true,
		id_parent: 'I&Uy}"v"rU',
		allow_anonymous_stalk: false,
		use_in_stats: false,
		is_global: true,
		is_public: false,
		id_plag_detection_algorithm: '7r|)"FV`Q*',
		spassword: 'dolorum',
		ts_from:
			'Ratione ut dolore. Suscipit exercitationem doloremque sint asperiores nobis dolorem quidem. Voluptatem ut molestias rerum ipsam provident excepturi vel. Est amet ea placeat voluptatibus corrupti.',
		ts_to: 'Amet quia impedit sint.',
		type_name: 'voluptatibus quo et',
		user_created: 'Exercitationem dignissimos aut dignissimos nihil cum tenetur.',
		test_flags: 'Est ea maiores maiores provident sint est iure voluptatibus.',
		title_type_name:
			'Eveniet ut ab eius sapiente dolores. Quis velit exercitationem nesciunt quia occaecati consequatur maxime. Dolores vel facilis molestiae sint dolorem fugiat. Quaerat fugit rerum natus qui vel non recusandae.\n \rVoluptatum omnis explicabo suscipit veniam adipisci quia rem. Suscipit voluptatem repudiandae aperiam aut voluptate natus eum cupiditate cumque. Officia quaerat officia. Quo optio quisquam minima modi beatae quisquam ut expedita.\n \rFugit ea sit voluptatem facilis voluptatem. Rerum optio aut commodi hic cupiditate laudantium. Totam dolores perferendis saepe ipsum dicta numquam reiciendis qui harum. Ea ex unde. Animi repudiandae molestiae tempora atque quas culpa.',
	},
	{
		id: 17,
		title: 'quis',
		id_course: 11,
		id_academic_year: 32,
		id_semester: 27,
		id_test_type: 30,
		id_user_created: 21,
		test_ordinal: 11,
		max_runs: 22,
		show_solutions: false,
		max_score: 5,
		password: 'commodi voluptatem dolor',
		questions_no: 49,
		duration_seconds: 50,
		pass_percentage: 34,
		ts_available_from: 'Quae quibusdam voluptates dolorem minima reiciendis.',
		ts_available_to: 'Labore nihil sint itaque eaque voluptatem ratione et quis aperiam.',
		ts_created:
			'Facere molestiae nobis laudantium quo et ut dolor aut. Consequatur aut qui adipisci. Et deleniti est libero vero.',
		ts_modified:
			'Dolor quis eum sed velit ut qui earum. Doloribus reprehenderit earum assumenda earum. Dolores molestiae quisquam veritatis ratione aperiam voluptate quia voluptatem. Nobis autem quaerat laboriosam aliquid itaque corporis incidunt ex.\n \rEt necessitatibus dolorum recusandae earum sed ab eligendi inventore nesciunt. Amet animi molestiae repudiandae quae aut facilis eligendi est. Et veniam qui exercitationem nobis distinctio nihil est neque. Quia similique excepturi quia quos aliquid repellendus.\n \rExpedita sit ipsam et sit sit. Perspiciatis vel harum sit tempora dolores iste. Sit non assumenda sapiente totam beatae recusandae. Aut et minima officiis in id. Modi labore quod provident deserunt aliquam nesciunt sequi placeat nihil.',
		user_modified: 'In ab expedita magni sed eligendi.',
		review_period_mins: 45,
		hint_result: false,
		test_score_ignored: false,
		title_abbrev: 'quas reprehenderit soluta',
		async_submit: true,
		trim_clock: false,
		id_email_reminder_scheme: "W|n^X1h'_h",
		allow_anonymous: true,
		is_competition: true,
		eval_comp_score: '@Joy!Q%@S2',
		upload_file_no: 46,
		upload_file_limit: 10,
		forward_only: true,
		id_parent: '@=@F7Dl$N+',
		allow_anonymous_stalk: false,
		use_in_stats: false,
		is_global: true,
		is_public: true,
		id_plag_detection_algorithm: 'u,Z5eJ*xfb',
		spassword: 'Tempora fugit sit consectetur modi non ducimus voluptatem.',
		ts_from: 'Eos nam facilis unde veritatis nihil.',
		ts_to: 'Alias nobis ullam necessitatibus cum alias occaecati aliquid.\nNumquam dignissimos incidunt aperiam similique et provident dolore.',
		type_name:
			'Nihil quidem et commodi nemo optio non et aut. Dolores occaecati sit necessitatibus fugit veniam aut vero doloribus rerum. Sed atque nihil. Similique ex ratione amet voluptas in eos inventore excepturi rerum.',
		user_created:
			'Est laboriosam temporibus ut ut.\nMinus ut ipsam nesciunt soluta assumenda quibusdam sed consequatur culpa.\nAmet nihil nostrum.\nNihil rerum qui autem aliquid perspiciatis.',
		test_flags: 'Eos veritatis aspernatur distinctio minus.',
		title_type_name:
			'Saepe alias fugiat autem quis nulla atque officiis libero et. Aut non non vero fugiat ut. Et molestiae quia labore expedita dolorum ut. Aliquid et eum consequatur aperiam nihil assumenda et. Perspiciatis dolor ea. Est aut molestias.',
	},
	{
		id: 21,
		title: 'Quia dolore officiis quo earum quasi incidunt eveniet ut enim.\nQui eos libero.\nConsectetur dolor quia reprehenderit hic est.\nRerum qui fugit animi voluptatem.',
		id_course: 35,
		id_academic_year: 41,
		id_semester: 24,
		id_test_type: 25,
		id_user_created: 25,
		test_ordinal: 2,
		max_runs: 49,
		show_solutions: true,
		max_score: 42,
		password:
			'Id eum rerum aperiam aliquam optio esse id esse dolor.\nConsequatur quia nulla cupiditate occaecati.\nIste necessitatibus veritatis est quasi iusto aut expedita.\nOfficiis non ad quam quam consequatur dolore doloribus qui.\nCulpa animi corporis ratione ex autem dolor.',
		questions_no: 41,
		duration_seconds: 29,
		pass_percentage: 9,
		ts_available_from:
			'Vel voluptatem quaerat. Est sit et consequatur dolores doloremque eos minima. Exercitationem quo minus provident reprehenderit et voluptatibus repudiandae consectetur sed. Aliquam expedita accusantium.\n \rVoluptatem dolor aut vel voluptatem non. Est ut qui explicabo. Ut voluptas in doloremque odit quo voluptas sint. Enim ipsum quidem molestiae eos. Dicta qui ut. Quam beatae ut et itaque provident sit voluptas molestiae distinctio.\n \rAmet porro aliquam. Odit aut quisquam. Non aliquam sit sed omnis consequuntur deserunt incidunt et nemo. At et non voluptatem.',
		ts_available_to:
			'In natus repudiandae eaque est maxime quo recusandae. Ratione et itaque distinctio libero. Et magni eligendi labore eveniet. Eos eos omnis mollitia aut eum iure porro. Neque quae est eligendi incidunt veniam aspernatur repellendus.',
		ts_created:
			'Et enim ipsam corrupti deserunt.\nQui eveniet sint nostrum voluptas tempora labore inventore nihil eligendi.\nAut et minus dolor laboriosam maxime est exercitationem harum sed.\nEt a sequi mollitia numquam.',
		ts_modified: 'debitis expedita qui',
		user_modified: 'magni',
		review_period_mins: 43,
		hint_result: true,
		test_score_ignored: false,
		title_abbrev: 'perferendis aspernatur incidunt',
		async_submit: true,
		trim_clock: false,
		id_email_reminder_scheme: 'h_$@3cp>zm',
		allow_anonymous: true,
		is_competition: true,
		eval_comp_score: 'pq&>hFft%G',
		upload_file_no: 41,
		upload_file_limit: 4,
		forward_only: true,
		id_parent: '1&^>iPU,D+',
		allow_anonymous_stalk: false,
		use_in_stats: false,
		is_global: true,
		is_public: true,
		id_plag_detection_algorithm: 'Fe$mGZsf2L',
		spassword: 'quia',
		ts_from: 'Et laborum accusamus hic molestiae accusamus eum.',
		ts_to: 'Eaque tempora consequuntur nulla quis. Molestiae officia esse aliquid illo. Est voluptatum sapiente et beatae architecto accusamus molestiae. Laborum earum dolorem. Dignissimos et est voluptatem.\n \rPorro nihil et error. Pariatur aut quam impedit voluptatum vitae veritatis consectetur. Accusamus voluptas quaerat mollitia facere odio. Inventore reiciendis pariatur eos ab dolore deserunt aut sed quidem. Minima corporis in fuga et voluptas sit. Velit et rerum.\n \rQuia harum eveniet. Magnam voluptatem in harum. Ut consequatur incidunt sed maiores ullam et neque. Aspernatur laudantium eaque consequatur. Dolore natus eum reprehenderit assumenda quia sit debitis.',
		type_name: 'harum ipsum omnis',
		user_created: 'necessitatibus illum eum',
		test_flags: 'Nihil ut voluptatum.\nDistinctio ea autem error molestiae omnis sit.',
		title_type_name: 'corporis',
	},
	{
		id: 8,
		title: 'Omnis consequatur sed quas libero. Et dicta atque tenetur sint cum vitae id dolorem. Iure repellendus ducimus nostrum consequatur. Corrupti et incidunt aut dolorem non commodi velit. Et aperiam ut totam sint nam debitis qui similique. Esse architecto eos et et.\n \rNihil unde qui quia laboriosam provident repudiandae cupiditate optio. Labore autem eum ut. Sint possimus assumenda. Non minima quaerat sint illum incidunt asperiores. Fugiat iusto quia qui enim facere in neque excepturi impedit.\n \rIllo aut in et beatae omnis et itaque qui. Rerum ut consectetur in nam nam rerum sint qui. Voluptatem neque velit aspernatur cumque voluptatem ab non officiis quia. In consequatur enim commodi omnis.',
		id_course: 49,
		id_academic_year: 38,
		id_semester: 9,
		id_test_type: 1,
		id_user_created: 33,
		test_ordinal: 46,
		max_runs: 41,
		show_solutions: true,
		max_score: 40,
		password: 'pariatur',
		questions_no: 0,
		duration_seconds: 10,
		pass_percentage: 9,
		ts_available_from:
			'Corporis deserunt et. Iure voluptate ipsam earum minus esse. Ex eum asperiores sapiente ullam officia dolore.',
		ts_available_to:
			'Exercitationem rem voluptates blanditiis nihil.\nPerspiciatis sunt optio necessitatibus.\nNecessitatibus excepturi officiis consequatur.\nExplicabo corrupti nihil reprehenderit esse deserunt.\nQuia reprehenderit rerum ad quia provident ut.',
		ts_created: 'laudantium saepe quae',
		ts_modified: 'consectetur qui possimus',
		user_modified:
			'Qui et velit qui. Labore temporibus ut dolorum mollitia eos. Magni autem recusandae corrupti.\n \rAutem atque itaque. Voluptatem excepturi qui hic. Et neque quia harum. Nihil molestiae minima tempora sed illum cupiditate aut praesentium. Quis ex aut minus ipsum non quia fugiat. Laboriosam non quod excepturi possimus laboriosam impedit officia aut.\n \rIllum harum et at. Veniam suscipit unde accusamus nulla beatae sit voluptatem sunt dolor. Dignissimos et nihil illum qui enim aut maxime voluptas. Et minus nemo quisquam corporis culpa provident incidunt sed. Qui quo voluptas porro nisi accusantium.',
		review_period_mins: 45,
		hint_result: true,
		test_score_ignored: true,
		title_abbrev:
			'Porro dolor at inventore porro enim incidunt reiciendis quibusdam. Et eligendi consequuntur perspiciatis sint aperiam. Nisi sequi corporis est possimus.\n \rEligendi exercitationem soluta. Aut culpa assumenda facilis tenetur iste suscipit. Accusamus quis at est est ut doloremque consequatur. Similique reprehenderit aut.\n \rEt dolorum quasi. Quis quia qui a quidem magni. Soluta temporibus nihil. Enim qui itaque rem in nisi corporis soluta. Architecto vel distinctio enim et corrupti similique at quod quas.',
		async_submit: false,
		trim_clock: false,
		id_email_reminder_scheme: ',w}D"-]jFG',
		allow_anonymous: false,
		is_competition: false,
		eval_comp_score: '_m(-zu;Uwm',
		upload_file_no: 5,
		upload_file_limit: 29,
		forward_only: false,
		id_parent: 'G]L\\EtGS|a',
		allow_anonymous_stalk: false,
		use_in_stats: true,
		is_global: true,
		is_public: false,
		id_plag_detection_algorithm: 'p1O9SiFVPU',
		spassword: 'quaerat',
		ts_from:
			'Nihil odio eligendi voluptas rem nihil nesciunt vitae vero quo. Cumque qui mollitia debitis voluptate sit modi eos. Occaecati sed nisi dolorem reiciendis minima quo. Ut magni repellendus id aut sint. Culpa omnis dolores eius veniam. Enim voluptate illum hic unde aliquam aut.\n \rNecessitatibus aut consequatur eos nam a a eaque. Nemo id ut rem quia possimus at aut in et. Aperiam omnis libero ut incidunt dicta odio vel laboriosam id.\n \rAd quisquam aliquid et architecto dolore eos nam consectetur. Eum fugiat voluptatibus. Nihil et id officia ut nam.',
		ts_to: 'in',
		type_name:
			'Voluptatem rerum autem iusto. Delectus delectus id. Recusandae sed eum atque qui et et saepe error repellat. Quia ad nihil sunt aliquid et aut repudiandae voluptatibus aut.',
		user_created: 'Et quia eveniet inventore atque optio voluptate et sed.',
		test_flags:
			'Voluptatem expedita quia perferendis commodi magni totam nemo. Mollitia labore eius. Minus et ad eum est ad vel.',
		title_type_name: 'sapiente non provident',
	},
	{
		id: 27,
		title: 'Ut quibusdam eius sapiente dicta exercitationem quibusdam. Quos fuga et quo ut vero expedita. Corrupti et debitis ut veritatis. Tempore voluptatem maxime autem veniam maxime laboriosam omnis maxime. Aut et nisi suscipit voluptas voluptates.\n \rEt ut id dolores repudiandae culpa. Quibusdam dolores tempore necessitatibus nulla perspiciatis quia. Illum dolor sit necessitatibus nam reprehenderit qui vel ut. Et debitis laboriosam quaerat voluptatem adipisci nihil et. Delectus corrupti ipsa iusto provident ipsum.\n \rVoluptatibus aut dolore ullam animi nam amet. Qui nisi quia. Voluptas quis ut dolor est quaerat quia quaerat.',
		id_course: 9,
		id_academic_year: 26,
		id_semester: 8,
		id_test_type: 41,
		id_user_created: 26,
		test_ordinal: 21,
		max_runs: 15,
		show_solutions: false,
		max_score: 42,
		password: 'Harum dolor quo.',
		questions_no: 46,
		duration_seconds: 14,
		pass_percentage: 27,
		ts_available_from: 'Qui sequi saepe quia eaque aut.',
		ts_available_to:
			'Neque odio quae iusto officia dignissimos aut. Quo eveniet quaerat et rerum quos et adipisci ut dicta. Voluptas sint sed veritatis ullam maiores aliquid. Perspiciatis minima aspernatur.',
		ts_created: 'autem',
		ts_modified: 'nemo non asperiores',
		user_modified:
			'Laboriosam qui vitae et beatae debitis. Cumque unde inventore atque voluptatem enim autem quae officiis. Sunt ut impedit.',
		review_period_mins: 5,
		hint_result: true,
		test_score_ignored: true,
		title_abbrev: 'Est occaecati itaque sapiente voluptatem quasi iure cupiditate id debitis.',
		async_submit: true,
		trim_clock: false,
		id_email_reminder_scheme: '<}2c!FojY/',
		allow_anonymous: true,
		is_competition: false,
		eval_comp_score: '^Uyi7(<^Pg',
		upload_file_no: 36,
		upload_file_limit: 46,
		forward_only: false,
		id_parent: '0z`d3+*ZKf',
		allow_anonymous_stalk: false,
		use_in_stats: true,
		is_global: false,
		is_public: false,
		id_plag_detection_algorithm: 'H.Sn@Xi&fl',
		spassword: 'Expedita eligendi autem ut occaecati omnis.',
		ts_from:
			'Quis cum exercitationem reprehenderit. Quos soluta enim aut laudantium. Magni quia sint recusandae consequatur porro ab. Ducimus reprehenderit ab voluptatem porro iure sed voluptatem neque.',
		ts_to: 'Sequi eveniet ratione quo quasi ipsum enim quia quas.\nDolorum aut natus nihil.',
		type_name:
			'Impedit minima aliquid dolores quia autem. Ut eum est aut. Sit dignissimos vel.\n \rDolorem qui error odio dicta facere maxime. Sed reiciendis illo totam. Saepe laudantium excepturi aut dolor. Dicta eum facere magnam sed neque sint omnis ut et. Earum soluta dolorem officia dolorum accusantium. Nisi veritatis molestiae nemo molestiae iure quis.\n \rEnim consequatur cumque consequatur voluptas labore iusto et et. Cupiditate ut quibusdam sunt tempore voluptatem blanditiis laudantium et. Autem placeat debitis porro laboriosam et ipsam. Voluptatem qui aperiam et et qui vitae. Quasi tenetur quia dolor tempore doloremque sit reprehenderit voluptate.',
		user_created: 'quae rerum omnis',
		test_flags: 'facere',
		title_type_name:
			'Aspernatur omnis ad aut nihil dignissimos rerum est. Labore sit nulla fuga iusto. Quisquam ratione aspernatur aut autem reiciendis vitae ea qui. Dolor velit numquam ut doloremque voluptas voluptatem. Fugiat nihil et amet.',
	},
	{
		id: 38,
		title: 'Ut aspernatur autem minus dolores illo ut cupiditate. Dolorem ducimus fugit odit et. Ipsum est cupiditate enim earum.\n \rIllo nostrum eveniet inventore necessitatibus ratione. Aliquid culpa possimus ut. Quasi vero sit odio nostrum quod aspernatur quo quis et. Id delectus alias accusantium inventore. Harum aspernatur iure dolorem voluptatum non. Velit dolores in voluptas.\n \rProvident voluptates ipsum excepturi aut ducimus. Iusto deleniti consequatur rem ipsa corporis et et et nam. Velit dolorem qui porro eos ea officiis maxime consectetur. Rem corporis voluptatem ut vel fugit voluptatem iste. Recusandae tempora est vitae autem.',
		id_course: 30,
		id_academic_year: 26,
		id_semester: 25,
		id_test_type: 12,
		id_user_created: 49,
		test_ordinal: 14,
		max_runs: 39,
		show_solutions: false,
		max_score: 36,
		password:
			'Nihil commodi ut mollitia reiciendis quia harum. Voluptates fugiat nihil eius veritatis dicta odit est autem dicta. Magni blanditiis doloribus. Cumque ut mollitia ut quia voluptatibus quas enim. Explicabo inventore reiciendis ullam qui voluptatem. Sit optio est asperiores neque iure dicta.',
		questions_no: 29,
		duration_seconds: 8,
		pass_percentage: 42,
		ts_available_from: 'Dolores et in quas deserunt placeat delectus cumque sunt placeat.',
		ts_available_to: 'Accusamus iste qui. Eos rerum dolores et qui. Eligendi et adipisci.',
		ts_created: 'consequuntur',
		ts_modified:
			'Sit ea quos et dolorum deleniti repellat accusamus et. Veniam in non ipsam. Est quidem eaque consequatur modi ratione et quaerat earum nobis.\n \rVoluptatum repellendus rerum rerum quam voluptates sit enim. Qui perferendis illo optio iure vel omnis. Maxime omnis eos explicabo. At molestiae porro consectetur. Cupiditate corporis similique est eveniet laudantium praesentium quo. Mollitia fugit sint non fugit omnis est laborum.\n \rFacilis amet mollitia quod. Consequatur perferendis et aut voluptatum eos et tempora. Vitae animi quod iusto. Dolorum in et adipisci. Voluptatibus necessitatibus labore possimus quisquam.',
		user_modified: 'rerum',
		review_period_mins: 18,
		hint_result: false,
		test_score_ignored: false,
		title_abbrev:
			'Iusto est a et qui quod cum. Fugiat eum reprehenderit amet qui necessitatibus. Accusamus ut aut numquam natus consequatur ut distinctio. Ut quibusdam aut nobis sequi neque. Excepturi commodi et quae qui ut eligendi.\n \rLaboriosam vel nihil eos sit. Commodi voluptatem nihil. Aliquid rerum dolorem est fuga voluptatem ipsam quo est a. Pariatur numquam incidunt. Sed facilis et repudiandae harum sed possimus dicta. Natus est commodi temporibus enim quae est blanditiis accusamus.\n \rSimilique dolor pariatur ea dolorum et. Aut quasi non et. Repellat quia quidem ad repellendus laborum qui mollitia aut itaque.',
		async_submit: true,
		trim_clock: false,
		id_email_reminder_scheme: '(v#MV<k?_q',
		allow_anonymous: false,
		is_competition: true,
		eval_comp_score: "e>'f}:%30%",
		upload_file_no: 43,
		upload_file_limit: 27,
		forward_only: false,
		id_parent: 'Z5oVCYA)8|',
		allow_anonymous_stalk: true,
		use_in_stats: true,
		is_global: false,
		is_public: false,
		id_plag_detection_algorithm: 'Y}L`@[)_-E',
		spassword:
			'Sed ut quia molestiae et. Consequatur aliquid qui quia et. Quisquam autem quo voluptates id dolorum. Sed vero quam dolorem placeat fugiat nihil eaque. Libero rerum occaecati nobis esse dolores.',
		ts_from: 'quas',
		ts_to: 'Consequatur repellat nam ab voluptate aperiam atque numquam et ea. Id et nobis est eveniet eos veniam minus. Maiores eum eum similique dignissimos. Esse harum velit voluptas enim. Itaque et dolores libero et sunt saepe. Est vel accusamus.\n \rQuam adipisci cupiditate quo voluptas fugit. Voluptatum nisi occaecati sint sint velit nemo impedit dolores. Distinctio tenetur enim vitae labore. Dolores quo fugiat.\n \rEt asperiores est quae dolorem possimus nisi consectetur. Facere tempora sequi. Dicta culpa aperiam beatae labore sit aliquam veritatis quia aut.',
		type_name:
			'Hic est et et quos iure consequuntur. Minima doloribus unde id quis. Ut eos laboriosam aspernatur animi molestias. Et sapiente consequatur eos veritatis.\n \rMaiores aut consequuntur illum illo. Maiores occaecati placeat dicta qui aut est expedita. Qui est incidunt pariatur. Voluptas minus quam magni consequatur vitae modi repudiandae ab. Nisi et exercitationem et est.\n \rVoluptates et esse architecto fugiat necessitatibus. Doloremque voluptas voluptas cupiditate. A non mollitia. Tempore explicabo molestiae aperiam voluptatum esse soluta aut et.',
		user_created:
			'Maxime fuga in praesentium dolore eius omnis et ab. Ut architecto est suscipit omnis non culpa eveniet. Et voluptatibus non dignissimos sequi quae expedita aut veniam explicabo.\n \rEt libero et dicta error eligendi ut iusto in ducimus. Qui minus soluta accusantium dolores. Unde ullam commodi optio dolor qui. Excepturi temporibus pariatur. Voluptate voluptates dolor et perspiciatis. Quas porro fugiat.\n \rDolores illum repellat molestias et ea nihil dolores assumenda omnis. Nihil quidem quia autem dolorem voluptas corporis. Cumque excepturi facilis tenetur. Qui architecto et non sunt quo veritatis a blanditiis.',
		test_flags:
			'Quia dolorem quos odio exercitationem aspernatur dolore harum commodi.\nSuscipit odit consequatur dolores aut cupiditate id explicabo ad quidem.',
		title_type_name: 'Rerum vel adipisci recusandae tempora tempore eveniet.\nCorrupti quasi voluptas.',
	},
];
const skeletonColumns = [
	{
		header: 'Id',
		field: 'id',
	},
	{
		header: 'Test ordinal',
		field: 'test_ordinal',
	},
	{
		header: 'Title',
		field: 'title_type_name',
	},
	{
		header: 'Abbrev.',
		field: 'title_abbrev',
	},
	{
		header: 'Max runs (0=∞)',
		field: 'max_runs',
	},
	{
		header: 'Global Public UseStats ScoreIgnored',
		field: 'test_flags',
	},
	{
		header: 'Show solutions',
		field: 'show_solutions',
	},
	{
		header: 'Max score',
		field: 'max_score',
	},
	{
		header: 'Password',
		field: 'spassword',
	},
	{
		header: 'No of qs',
		field: 'questions_no',
	},
	{
		header: 'Duration (s)',
		field: 'duration_seconds',
	},
	{
		header: 'Valid from',
		field: 'ts_from',
	},
	{
		header: 'Valid to',
		field: 'ts_to',
	},
	{ header: 'Delete' },
	{ header: 'Edit' },
];
const flagsPill = (flag: string) => {
	let pillClass = 'badge rounded-pill bg-';
	if (flag.includes('-- STATS-')) pillClass += 'primary';
	else if (flag.includes('--- SCIGNORED')) pillClass += 'secondary';
	else if (flag.includes('----')) pillClass += 'info';
	else pillClass += 'light';
	return pillClass;
};

const exportCSV = () => testTableDt.value.exportCSV();
const filters = ref({
	global: { value: '', matchMode: FilterMatchMode.CONTAINS },
});

const create = async () => {
	console.log('Created!');
	service
		.postAsync('/exam/new', {
			testTypeId: selectedTest.value?.id,
			courseId: courseId,
			academicYearId: academicYearId,
			appUserId: appUserId,
		})
		.then((response: any) => {
			if (!response) return;

			const newId = parseInt(response.data[0].new_test);
			console.log(newId);
			router.push({ name: 'EditExam', params: { id: newId } });
		});
};

const deleteE = (index: number) => {
	console.log(`Deleted ${JSON.stringify(testTable.value[index])}`);
	testTable.value.splice(index, 1);

	toast.add({
		severity: 'success',
		summary: '200 OK',
		detail: `Exam ${testTable.value[index].id} deleted successfully.`,
		life: 3000,
	});
};

const edit = (id: number) => {
	router.push({ name: 'EditExam', params: { id: id } });
};

const createNewEdit = async () => {
	const res = await service.postAsync('/exam/new', {
		testTypeId: selectedTest.value?.id,
		courseId: courseId,
		academicYearId: academicYearId,
		appUserId: appUserId,
	});

	return parseInt(res);
};

onMounted(async () => {
	tests.value = await service.getManyAsync<Test>('/test_types', {
		standalone: true,
	});

	if (tests.value && tests.value.length > 0) selectedTest.value = tests.value[0];

	testTable.value = await service.getManyAsync<TestTable>('/test_table', {
		courseId: courseId,
		academicYearId: academicYearId,
	});

	for (var i = 0; i < testTable.value.length; i++) {
		testTable.value[i].title_type_name = `${testTable.value[i].title} — ${testTable.value[i].type_name}`;
	}
});
</script>

<template>
	<div class="container-fluid no-x">
		<Toast />

		<br />
		<h2>Exams for the current course and year:</h2>
		<br />
		<div class="row d-flex justify-content-start">
			<div class="ml-5">
				<h5>
					I want to create a new quiz
					<Dropdown
						v-model="selectedTest"
						:options="tests"
						:placeholder="selectedTest?.name"
						option-label="name"
						class="me-2 ms-2"></Dropdown>
					<Button
						label="Create"
						icon="pi pi-plus-circle"
						class="center p-button-rounded"
						@click="create"></Button>
				</h5>
			</div>
			<br />
		</div>
		<DataTable v-if="loading" :value="skeletonTableData" responsive-layout="scroll" class="p-datatable-sm">
			<template #header>
				<div style="display: flex">
					<span class="p-input-icon-left">
						<i class="pi pi-search" />
						<InputText
							v-model="filters['global'].value"
							placeholder="Search"
							class="p-inputtext-sm p-inputtext-filled"
							style="border-radius: 14px" />
					</span>
					<Button
						icon="pi pi-external-link"
						label="Export"
						class="p-button-rounded p-button-outlined p-button-sm ml-3"
						@click="exportCSV" />
				</div>
			</template>
			<Column v-for="col of skeletonColumns" :key="col.field" :field="col.field" :header="col.header" sortable>
				<template #body><Skeleton></Skeleton></template>
			</Column>
		</DataTable>
		<DataTable
			v-else
			ref="testTableDt"
			v-model:filters="filters"
			:value="testTable"
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
					<Button icon="pi pi-external-link" label="Export" class="p-button-sm ml-3" @click="exportCSV" />
				</div>
			</template>
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
	</div>
</template>
