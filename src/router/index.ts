import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { defineAsyncComponent } from 'vue';
import RouteNames from './routes';

const HomeView = () => import('@/views/HomeView.vue');
const LoginView = defineAsyncComponent(() => import('@/views/LoginView.vue'));

//? STUDENT
const PreviousExamsViewStudent = defineAsyncComponent(() => import('@/views/student/PreviousExamsView.vue'));
const TicketsViewStudent = defineAsyncComponent(() => import('@/views/student/TicketsView.vue'));
const StatsViewStudent = defineAsyncComponent(() => import('@/views/student/StatsView.vue'));
const CodeThemeViewStudent = defineAsyncComponent(() => import('@/views/student/CodeThemeView.vue'));

//? ADMIN
//! EXAMS
const PreviousExamsView = defineAsyncComponent(() => import('@/views/admin/exams/PreviousExamsView.vue'));
const ReviewExamView = defineAsyncComponent(() => import('@/views/admin/exams/ReviewExamView.vue'));
const TicketsAdminView = defineAsyncComponent(() => import('@/views/admin/exams/TicketsAdminView.vue'));
const ExamDefinitionsView = defineAsyncComponent(() => import('@/views/admin/exams/ExamDefinitionsView.vue'));
const EditExamView = defineAsyncComponent(() => import('@/views/admin/exams/EditExamView.vue'));
const ExamInstancesView = defineAsyncComponent(() => import('@/views/admin/exams/ExamInstancesView.vue'));
const ExportStudentScoresView = defineAsyncComponent(() => import('@/views/admin/exams/ExportStudentScoresView.vue'));
const QuizDefinitionsView = defineAsyncComponent(() => import('@/views/admin/exams/QuizDefinitionsView.vue'));
const QuizInstancesView = defineAsyncComponent(() => import('@/views/admin/exams/QuizInstancesView.vue'));
const LectureQuizView = defineAsyncComponent(() => import('@/views/admin/exams/LectureQuizView.vue'));

//! LEARN
const NewTutorialView = defineAsyncComponent(() => import('@/views/admin/learn/NewTutorialView.vue'));
const TutorialDefinitionView = defineAsyncComponent(() => import('@/views/admin/learn/TutorialDefinitionView.vue'));
const StartTutorialView = defineAsyncComponent(() => import('@/views/admin/learn/StartTutorialView.vue'));
const NewExerciseView = defineAsyncComponent(() => import('@/views/admin/learn/NewExerciseView.vue'));
const ExerciseDefinitionView = defineAsyncComponent(() => import('@/views/admin/learn/ExerciseDefinitionView.vue'));
const StartExerciseView = defineAsyncComponent(() => import('@/views/admin/learn/StartExerciseView.vue'));
const FeedbackView = defineAsyncComponent(() => import('@/views/admin/learn/FeedbackView.vue'));

//! QUESTIONS
const NewQuestionView = defineAsyncComponent(() => import('@/views/admin/questions/NewQuestionView.vue'));
const EditQuestionView = defineAsyncComponent(() => import('@/views/admin/questions/EditQuestionView.vue'));
const ListAllAndEditView = defineAsyncComponent(() => import('@/views/admin/questions/ListAllAndEditView.vue'));
const SearchView = defineAsyncComponent(() => import('@/views/admin/questions/SearchView.vue'));
const NodeVisView = defineAsyncComponent(() => import('@/views/admin/questions/NodeVisView.vue'));
const NodeQuestionsView = defineAsyncComponent(() => import('@/views/admin/questions/NodeQuestionsView.vue'));
const NodeTreeVisView = defineAsyncComponent(() => import('@/views/admin/questions/NodeTreeVisView.vue'));
const CourseDataObjectView = defineAsyncComponent(() => import('@/views/admin/questions/CourseDataObjectView.vue'));
const QuestionInstancesView = defineAsyncComponent(() => import('@/views/admin/questions/QuestionInstancesView.vue'));

//! PREFERENCES
const CodeMirrorSkinView = defineAsyncComponent(() => import('@/views/admin/preferences/CodeMirrorSkinView.vue'));

//! PLAYGROUND
const CodeSandboxView = defineAsyncComponent(() => import('@/views/admin/playground/CodeSandboxView.vue'));
const SnippetStoreView = defineAsyncComponent(() => import('@/views/admin/playground/SnippetStoreView.vue'));

//! ANALYTICS
const ExamAnalyticsView = defineAsyncComponent(() => import('@/views/admin/analytics/ExamAnalyticsView.vue'));
const ExamScoreDistributionAnalyticsView = defineAsyncComponent(
	() => import('@/views/admin/analytics/ExamScoreDistributionAnalyticsView.vue'),
);
const QuestionsAnalyticsView = defineAsyncComponent(() => import('@/views/admin/analytics/QuestionsAnalyticsView.vue'));
const StudentBehaviourAnalyticsView = defineAsyncComponent(
	() => import('@/views/admin/analytics/StudentBehaviourAnalyticsView.vue'),
);
const PlagiarismDetectionView = defineAsyncComponent(
	() => import('@/views/admin/analytics/PlagiarismDetectionView.vue'),
);
const TimeDependantPlagiarismDetectionView = defineAsyncComponent(
	() => import('@/views/admin/analytics/TimeDependantPlagiarismDetectionView.vue'),
);
const StudentsScatterView = defineAsyncComponent(() => import('@/views/admin/analytics/StudentsScatterView.vue'));
const HighScoreListView = defineAsyncComponent(() => import('@/views/admin/analytics/HighScoreListView.vue'));

//! ADMINISTRATION
const UploadStudentsView = defineAsyncComponent(() => import('@/views/admin/administration/UploadStudentsView.vue'));
const UploadImagesView = defineAsyncComponent(() => import('@/views/admin/administration/UploadImagesView.vue'));
const StudentsListView = defineAsyncComponent(() => import('@/views/admin/administration/StudentsListView.vue'));
const TeachersListView = defineAsyncComponent(() => import('@/views/admin/administration/TeachersListView.vue'));
const UsersListView = defineAsyncComponent(() => import('@/views/admin/administration/UsersListView.vue'));
const EdgarLogsView = defineAsyncComponent(() => import('@/views/admin/administration/EdgarLogsView.vue'));
const NginxLogsView = defineAsyncComponent(() => import('@/views/admin/administration/NginxLogsView.vue'));
const WhoIsOnlineView = defineAsyncComponent(() => import('@/views/admin/administration/WhoIsOnlineView.vue'));

//! HELP
const GlossaryView = defineAsyncComponent(() => import('@/views/admin/help/GlossaryView.vue'));
const FAQView = defineAsyncComponent(() => import('@/views/admin/help/FAQView.vue'));
const ExamFormView = defineAsyncComponent(() => import('@/views/admin/help/ExamFormView.vue'));
const QuestionOperationsView = defineAsyncComponent(() => import('@/views/admin/help/QuestionOperationsView.vue'));
const QuestionFormView = defineAsyncComponent(() => import('@/views/admin/help/QuestionFormView.vue'));
const TemplatedQuestionsView = defineAsyncComponent(() => import('@/views/admin/help/TemplatedQuestionsView.vue'));
const ScriptedQuestionsView = defineAsyncComponent(() => import('@/views/admin/help/ScriptedQuestionsView.vue'));
const PeerAssessmentView = defineAsyncComponent(() => import('@/views/admin/help/PeerAssessmentView.vue'));
const TicketingSystemView = defineAsyncComponent(() => import('@/views/admin/help/TicketingSystemView.vue'));
const ManualGradingView = defineAsyncComponent(() => import('@/views/admin/help/ManualGradingView.vue'));

const SPA_URL_PREFIX = '';

const routes: RouteRecordRaw[] = [
	{
		path: SPA_URL_PREFIX,
		name: RouteNames.Home,
		component: HomeView,
	},
	{
		path: '/login',
		name: RouteNames.Login,
		component: LoginView,
	},
	//? STUDENT
	{
		path: '/test_instances',
		name: RouteNames.PreviousExamsStudent,
		component: PreviousExamsViewStudent,
	},
	{
		path: '/ticket_mytickets',
		name: RouteNames.TicketsStudent,
		component: TicketsViewStudent,
	},
	{
		path: '/analytics_score_student',
		name: RouteNames.StatsStudent,
		component: StatsViewStudent,
	},
	{
		path: '/prefs_cmskin',
		name: RouteNames.CodeThemeStudent,
		component: CodeThemeViewStudent,
	},
	//? ADMIN
	//! EXAMS
	{
		path: '/test/instances/:id?',
		name: RouteNames.PreviousExams,
		component: PreviousExamsView,
		props: (route) => ({ id: Number(route.params.id) }),
	},
	{
		path: '/exam/review/:id/:questionId',
		name: RouteNames.ReviewExam,
		component: ReviewExamView,
		props: (route) => ({ id: Number(route.params.id), questionId: Number(route.params.questionId) }),
	},
	{
		path: '/ticket/mytickets_admin',
		name: RouteNames.TicketsAdmin,
		component: TicketsAdminView,
	},
	{
		path: '/test/def/list',
		name: RouteNames.ExamDefinitions,
		component: ExamDefinitionsView,
	},
	{
		path: '/test/def/edit/:id',
		name: RouteNames.EditExam,
		component: EditExamView,
		props: (route) => ({ id: Number(route.params.id) }),
	},
	{
		path: '/test/instances/list',
		name: RouteNames.ExamInstances,
		component: ExamInstancesView,
	},
	{
		path: '/test/instances/dumpcsv',
		name: RouteNames.ExportStudentScores,
		component: ExportStudentScoresView,
	},
	{
		path: '/lecture/def/list',
		name: RouteNames.QuizDefinitions,
		component: QuizDefinitionsView,
	},
	{
		path: '/lecture/instances/list',
		name: RouteNames.QuizInstances,
		component: QuizInstancesView,
	},
	{
		path: '/lecture/startteacher',
		name: RouteNames.LectureQuiz,
		component: LectureQuizView,
	},

	//! LEARN
	{
		path: '/tutorial/def/new',
		name: RouteNames.NewTutorial,
		component: NewTutorialView,
	},
	{
		path: '/tutorial/def',
		name: RouteNames.TutorialDefinition,
		component: TutorialDefinitionView,
	},
	{
		path: '/tutorial',
		name: RouteNames.StartTutorial,
		component: StartTutorialView,
	},
	{
		path: '/exercise/def/new',
		name: RouteNames.NewExercise,
		component: NewExerciseView,
	},
	{
		path: '/exercise/def',
		name: RouteNames.ExerciseDefinition,
		component: ExerciseDefinitionView,
	},
	{
		path: '/exercise',
		name: RouteNames.StartExercise,
		component: StartExerciseView,
	},
	{ path: '/feedback', name: RouteNames.Feedback, component: FeedbackView },

	//! QUESTIONS
	{
		path: '/question/new',
		name: RouteNames.NewQuestion,
		component: NewQuestionView,
	},
	{
		path: '/question/edit/:id',
		name: RouteNames.EditQuestion,
		component: EditQuestionView,
		props: (route) => ({ id: Number(route.params.id) }),
	},
	{
		path: '/question',
		name: RouteNames.ListAllAndEdit,
		component: ListAllAndEditView,
	},
	{
		path: '/question/search',
		name: RouteNames.Search,
		component: SearchView,
	},
	{ path: '/node/vis', name: RouteNames.NodeVis, component: NodeVisView },
	{
		path: '/node/questions',
		name: RouteNames.NodeQuestions,
		component: NodeQuestionsView,
	},
	{
		path: '/node/vistree',
		name: RouteNames.NodeTreeVis,
		component: NodeTreeVisView,
	},
	{
		path: '/course/dataobject',
		name: RouteNames.CourseDataObject,
		component: CourseDataObjectView,
	},
	{
		path: '/question/instances/:id',
		name: RouteNames.QuestionInstances,
		component: QuestionInstancesView,
		props: (route) => ({ id: Number(route.params.id) }),
	},

	//! PREFERENCES
	{
		path: '/prefs/cmskin_admin',
		name: RouteNames.CodeMirrorSkin,
		component: CodeMirrorSkinView,
	},

	//! PLAYGROUND
	{
		path: '/playground/sandbox/:id?',
		name: RouteNames.CodeSandboxAdmin,
		component: CodeSandboxView,
		props: (route) => ({ id: Number(route.params.id) }),
	},
	{
		path: '/playground/snippet/store',
		name: RouteNames.SnippetStoreAdmin,
		component: SnippetStoreView,
	},

	//! ANALYTICS
	{
		path: '/analytics/tests/single',
		name: RouteNames.ExamAnalytics,
		component: ExamAnalyticsView,
	},
	{
		path: '/analytics/score',
		name: RouteNames.ExamScoreDistributionAnalytics,
		component: ExamScoreDistributionAnalyticsView,
	},
	{
		path: '/analytics/questions/bulk',
		name: RouteNames.QuestionsAnalytics,
		component: QuestionsAnalyticsView,
	},
	{
		path: '/analytics/behaviour',
		name: RouteNames.StudentBehaviourAnalytics,
		component: StudentBehaviourAnalyticsView,
	},
	{
		path: '/analytics/plagiarismdetection',
		name: RouteNames.PlagiarismDetection,
		component: PlagiarismDetectionView,
	},
	{
		path: '/analytics/time-dependent-plagiarism',
		name: RouteNames.TimeDependantPlagiarismDetection,
		component: TimeDependantPlagiarismDetectionView,
	},
	{
		path: '/analytics/scatterstudents',
		name: RouteNames.StudentsScatter,
		component: StudentsScatterView,
	},
	{
		path: '/analytics/highscore',
		name: RouteNames.HighScoreList,
		component: HighScoreListView,
	},
	{ path: '/analytics/score/student', name: RouteNames.MyStats, component: HomeView },

	//! ADMINISTRATION
	{
		path: '/upload/students',
		name: RouteNames.UploadStudents,
		component: UploadStudentsView,
	},
	{
		path: '/upload/faces',
		name: RouteNames.UploadImages,
		component: UploadImagesView,
	},
	{
		path: '/admin/student/list',
		name: RouteNames.StudentsList,
		component: StudentsListView,
	},
	{
		path: '/admin/teacher/list',
		name: RouteNames.TeachersList,
		component: TeachersListView,
	},
	{
		path: '/admin/user/list',
		name: RouteNames.UsersList,
		component: UsersListView,
	},
	{
		path: '/admin/logs/edgar',
		name: RouteNames.EdgarLogs,
		component: EdgarLogsView,
	},
	{
		path: '/admin/logs/nginx',
		name: RouteNames.NginxLogs,
		component: NginxLogsView,
	},
	{
		path: '/admin/onlineusers',
		name: RouteNames.WhoIsOnline,
		component: WhoIsOnlineView,
	},

	//! HELP
	{
		path: '/help/glossary',
		name: RouteNames.Glossary,
		component: GlossaryView,
	},
	{
		path: '/help/faq',
		name: RouteNames.FrequentlyAskedQuestions,
		component: FAQView,
	},
	{
		path: '/help/examform',
		name: RouteNames.ExamForm,
		component: ExamFormView,
	},
	{
		path: '/help/questionops',
		name: RouteNames.QuestionOperations,
		component: QuestionOperationsView,
	},
	{
		path: '/help/questionedit',
		name: RouteNames.QuestionForm,
		component: QuestionFormView,
	},
	{
		path: '/help/questiontemplate',
		name: RouteNames.TemplatedQuestions,
		component: TemplatedQuestionsView,
	},
	{
		path: '/help/questionscript',
		name: RouteNames.ScriptedQuestions,
		component: ScriptedQuestionsView,
	},
	{
		path: '/help/pa',
		name: RouteNames.PeerAssessment,
		component: PeerAssessmentView,
	},
	{
		path: '/help/ticketing',
		name: RouteNames.TicketingSystem,
		component: TicketingSystemView,
	},
	{
		path: '/help/manualgrading',
		name: RouteNames.ManualGrading,
		component: ManualGradingView,
	},
	//? REDIRECTS
	{ path: '/', redirect: { name: RouteNames.Home } },
	{ path: '/:pathMatch(.*)*', redirect: { name: RouteNames.Home } },
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

//! Auth should look something akin to this.
// const { User, isLoggedIn } = storeToRefs(useUserStore(pinia)));
// router.beforeEach((to, from, next) => {
//   if (to.name !== 'Login' && !isLoggedIn) next({ name: 'Login' }));
//   else next());
// }));

// router.beforeEach((to, from) => {
// 	// ...
// 	// explicitly return false to cancel the navigation
// 	//! Use JWT auth here.
// 	console.log('From:'));
// 	console.table(from));
// 	console.log('-----------'));
// 	console.log('To:'));
// 	console.table(to));
// 	return true;
// }));

export default router;
