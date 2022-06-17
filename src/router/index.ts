import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import RouteNames from './routes';

const HomeView = () => import('@/views/HomeView.vue');
const LoginView = () => import('@/views/LoginView.vue');

//! EXAMS
const PreviousExamsView = () => import('@/views/admin/exams/PreviousExamsView.vue');
const ReviewExamView = () => import('@/views/admin/exams/ReviewExamView.vue');
const TicketsAdminView = () => import('@/views/admin/exams/TicketsAdminView.vue');
const ExamDefinitionsView = () => import('@/views/admin/exams/ExamDefinitionsView.vue');
const EditExamView = () => import('@/views/admin/exams/EditExamView.vue');
const ExamInstancesView = () => import('@/views/admin/exams/ExamInstancesView.vue');
const ExportStudentScoresView = () => import('@/views/admin/exams/ExportStudentScoresView.vue');
const QuizDefinitionsView = () => import('@/views/admin/exams/QuizDefinitionsView.vue');
const QuizInstancesView = () => import('@/views/admin/exams/QuizInstancesView.vue');
const LectureQuizView = () => import('@/views/admin/exams/LectureQuizView.vue');

//! LEARN
const NewTutorialView = () => import('@/views/admin/learn/NewTutorialView.vue');
const TutorialDefinitionView = () => import('@/views/admin/learn/TutorialDefinitionView.vue');
const StartTutorialView = () => import('@/views/admin/learn/StartTutorialView.vue');
const NewExerciseView = () => import('@/views/admin/learn/NewExerciseView.vue');
const ExerciseDefinitionView = () => import('@/views/admin/learn/ExerciseDefinitionView.vue');
const StartExerciseView = () => import('@/views/admin/learn/StartExerciseView.vue');
const FeedbackView = () => import('@/views/admin/learn/FeedbackView.vue');

//! QUESTIONS
const NewQuestionView = () => import('@/views/admin/questions/NewQuestionView.vue');
const EditQuestionView = () => import('@/views/admin/questions/EditQuestionView.vue');
const ListAllAndEditView = () => import('@/views/admin/questions/ListAllAndEditView.vue');
const SearchView = () => import('@/views/admin/questions/SearchView.vue');
const NodeVisView = () => import('@/views/admin/questions/NodeVisView.vue');
const NodeQuestionsView = () => import('@/views/admin/questions/NodeQuestionsView.vue');
const NodeTreeVisView = () => import('@/views/admin/questions/NodeTreeVisView.vue');
const CourseDataObjectView = () => import('@/views/admin/questions/CourseDataObjectView.vue');
const QuestionInstancesView = () => import('@/views/admin/questions/QuestionInstancesView.vue');

//! PREFERENCES
const CodeMirrorSkinView = () => import('@/views/admin/preferences/CodeMirrorSkinView.vue');

//! PLAYGROUND
const CodeSandboxView = () => import('@/views/admin/playground/CodeSandboxView.vue');
const SnippetStoreView = () => import('@/views/admin/playground/SnippetStoreView.vue');

//! ANALYTICS
const ExamAnalyticsView = () => import('@/views/admin/analytics/ExamAnalyticsView.vue');
const ExamScoreDistributionAnalyticsView = () =>
	import('@/views/admin/analytics/ExamScoreDistributionAnalyticsView.vue');
const QuestionsAnalyticsView = () => import('@/views/admin/analytics/QuestionsAnalyticsView.vue');
const StudentBehaviourAnalyticsView = () => import('@/views/admin/analytics/StudentBehaviourAnalyticsView.vue');
const PlagiarismDetectionView = () => import('@/views/admin/analytics/PlagiarismDetectionView.vue');
const TimeDependantPlagiarismDetectionView = () =>
	import('@/views/admin/analytics/TimeDependantPlagiarismDetectionView.vue');
const StudentsScatterView = () => import('@/views/admin/analytics/StudentsScatterView.vue');
const HighScoreListView = () => import('@/views/admin/analytics/HighScoreListView.vue');

//! ADMINISTRATION
const UploadStudentsView = () => import('@/views/admin/administration/UploadStudentsView.vue');
const UploadImagesView = () => import('@/views/admin/administration/UploadImagesView.vue');
const StudentsListView = () => import('@/views/admin/administration/StudentsListView.vue');
const TeachersListView = () => import('@/views/admin/administration/TeachersListView.vue');
const UsersListView = () => import('@/views/admin/administration/UsersListView.vue');
const EdgarLogsView = () => import('@/views/admin/administration/EdgarLogsView.vue');
const NginxLogsView = () => import('@/views/admin/administration/NginxLogsView.vue');
const WhoIsOnlineView = () => import('@/views/admin/administration/WhoIsOnlineView.vue');

//! HELP
const GlossaryView = () => import('@/views/admin/help/GlossaryView.vue');
const FAQView = () => import('@/views/admin/help/FAQView.vue');
const ExamFormView = () => import('@/views/admin/help/ExamFormView.vue');
const QuestionOperationsView = () => import('@/views/admin/help/QuestionOperationsView.vue');
const QuestionFormView = () => import('@/views/admin/help/QuestionFormView.vue');
const TemplatedQuestionsView = () => import('@/views/admin/help/TemplatedQuestionsView.vue');
const ScriptedQuestionsView = () => import('@/views/admin/help/ScriptedQuestionsView.vue');
const PeerAssessmentView = () => import('@/views/admin/help/PeerAssessmentView.vue');
const TicketingSystemView = () => import('@/views/admin/help/TicketingSystemView.vue');
const ManualGradingView = () => import('@/views/admin/help/ManualGradingView.vue');

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
// const { User, isLoggedIn } = storeToRefs(useUserStore(pinia));
// router.beforeEach((to, from, next) => {
//   if (to.name !== 'Login' && !isLoggedIn) next({ name: 'Login' });
//   else next();
// });

// router.beforeEach((to, from) => {
// 	// ...
// 	// explicitly return false to cancel the navigation
// 	//! Use JWT auth here.
// 	console.log('From:');
// 	console.table(from);
// 	console.log('-----------');
// 	console.log('To:');
// 	console.table(to);
// 	return true;
// });

export default router;
