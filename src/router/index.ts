import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { defineAsyncComponent } from 'vue';
import RouteNames from './routes';

import NotFoundComponent from '@/components/NotFoundComponent.vue';
import SkeletonComponent from '@/components/SkeletonComponent.vue';
import ErrorComponent from '@/components/ErrorComponent.vue';
const HomeView = () => import('@/views/HomeView.vue');
const LoginView = defineAsyncComponent(() => import('@/views/LoginView.vue'));

//? STUDENT
const PreviousExamsViewStudent = defineAsyncComponent({
	loader: () => import('@/views/student/PreviousExamsView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const TicketsViewStudent = defineAsyncComponent({
	loader: () => import('@/views/student/TicketsView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const StatsViewStudent = defineAsyncComponent({
	loader: () => import('@/views/student/StatsView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const CodeThemeViewStudent = defineAsyncComponent({
	loader: () => import('@/views/student/CodeThemeView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});

//? ADMIN
//! EXAMS
const PreviousExamsView = defineAsyncComponent({
	loader: () => import('@/views/admin/exams/PreviousExamsView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const ReviewExamView = defineAsyncComponent({
	loader: () => import('@/views/admin/exams/ReviewExamView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const TicketsAdminView = defineAsyncComponent({
	loader: () => import('@/views/admin/exams/TicketsAdminView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const ExamDefinitionsView = defineAsyncComponent({
	loader: () => import('@/views/admin/exams/ExamDefinitionsView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const EditExamView = defineAsyncComponent({
	loader: () => import('@/views/admin/exams/EditExamView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const ExamInstancesView = defineAsyncComponent({
	loader: () => import('@/views/admin/exams/ExamInstancesView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const ExportStudentScoresView = defineAsyncComponent({
	loader: () => import('@/views/admin/exams/ExportStudentScoresView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const QuizDefinitionsView = defineAsyncComponent({
	loader: () => import('@/views/admin/exams/QuizDefinitionsView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const QuizInstancesView = defineAsyncComponent({
	loader: () => import('@/views/admin/exams/QuizInstancesView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const LectureQuizView = defineAsyncComponent({
	loader: () => import('@/views/admin/exams/LectureQuizView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});

//! LEARN
const NewTutorialView = defineAsyncComponent({
	loader: () => import('@/views/admin/learn/NewTutorialView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const TutorialDefinitionView = defineAsyncComponent({
	loader: () => import('@/views/admin/learn/TutorialDefinitionView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const StartTutorialView = defineAsyncComponent({
	loader: () => import('@/views/admin/learn/StartTutorialView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const NewExerciseView = defineAsyncComponent({
	loader: () => import('@/views/admin/learn/NewExerciseView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const ExerciseDefinitionView = defineAsyncComponent({
	loader: () => import('@/views/admin/learn/ExerciseDefinitionView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const StartExerciseView = defineAsyncComponent({
	loader: () => import('@/views/admin/learn/StartExerciseView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const FeedbackView = defineAsyncComponent({
	loader: () => import('@/views/admin/learn/FeedbackView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});

//! QUESTIONS
const NewQuestionView = defineAsyncComponent({
	loader: () => import('@/views/admin/questions/NewQuestionView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const EditQuestionView = defineAsyncComponent({
	loader: () => import('@/views/admin/questions/EditQuestionView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const ListAllAndEditView = defineAsyncComponent({
	loader: () => import('@/views/admin/questions/ListAllAndEditView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const SearchView = defineAsyncComponent({
	loader: () => import('@/views/admin/questions/SearchView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const NodeVisView = defineAsyncComponent({
	loader: () => import('@/views/admin/questions/NodeVisView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const NodeQuestionsView = defineAsyncComponent({
	loader: () => import('@/views/admin/questions/NodeQuestionsView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const NodeTreeVisView = defineAsyncComponent({
	loader: () => import('@/views/admin/questions/NodeTreeVisView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const CourseDataObjectView = defineAsyncComponent({
	loader: () => import('@/views/admin/questions/CourseDataObjectView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const QuestionInstancesView = defineAsyncComponent({
	loader: () => import('@/views/admin/questions/QuestionInstancesView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});

//! PREFERENCES
const CodeMirrorSkinView = defineAsyncComponent({
	loader: () => import('@/views/admin/preferences/CodeMirrorSkinView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});

//! PLAYGROUND
const CodeSandboxView = defineAsyncComponent({
	loader: () => import('@/views/admin/playground/CodeSandboxView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const SnippetStoreView = defineAsyncComponent({
	loader: () => import('@/views/admin/playground/SnippetStoreView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});

//! ANALYTICS
const ExamAnalyticsView = defineAsyncComponent({
	loader: () => import('@/views/admin/analytics/ExamAnalyticsView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const ExamScoreDistributionAnalyticsView = defineAsyncComponent({
	loader: () => import('@/views/admin/analytics/ExamScoreDistributionAnalyticsView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const QuestionsAnalyticsView = defineAsyncComponent({
	loader: () => import('@/views/admin/analytics/QuestionsAnalyticsView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const StudentBehaviourAnalyticsView = defineAsyncComponent({
	loader: () => import('@/views/admin/analytics/StudentBehaviourAnalyticsView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const PlagiarismDetectionView = defineAsyncComponent({
	loader: () => import('@/views/admin/analytics/PlagiarismDetectionView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const TimeDependantPlagiarismDetectionView = defineAsyncComponent({
	loader: () => import('@/views/admin/analytics/TimeDependantPlagiarismDetectionView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const StudentsScatterView = defineAsyncComponent({
	loader: () => import('@/views/admin/analytics/StudentsScatterView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const HighScoreListView = defineAsyncComponent({
	loader: () => import('@/views/admin/analytics/HighScoreListView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});

//! ADMINISTRATION
const UploadStudentsView = defineAsyncComponent({
	loader: () => import('@/views/admin/administration/UploadStudentsView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const UploadImagesView = defineAsyncComponent({
	loader: () => import('@/views/admin/administration/UploadImagesView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const StudentsListView = defineAsyncComponent({
	loader: () => import('@/views/admin/administration/StudentsListView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const TeachersListView = defineAsyncComponent({
	loader: () => import('@/views/admin/administration/TeachersListView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const UsersListView = defineAsyncComponent({
	loader: () => import('@/views/admin/administration/UsersListView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const EdgarLogsView = defineAsyncComponent({
	loader: () => import('@/views/admin/administration/EdgarLogsView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const NginxLogsView = defineAsyncComponent({
	loader: () => import('@/views/admin/administration/NginxLogsView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const WhoIsOnlineView = defineAsyncComponent({
	loader: () => import('@/views/admin/administration/WhoIsOnlineView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});

//! HELP
const GlossaryView = defineAsyncComponent({
	loader: () => import('@/views/admin/help/GlossaryView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const FAQView = defineAsyncComponent({
	loader: () => import('@/views/admin/help/FAQView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const ExamFormView = defineAsyncComponent({
	loader: () => import('@/views/admin/help/ExamFormView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const QuestionOperationsView = defineAsyncComponent({
	loader: () => import('@/views/admin/help/QuestionOperationsView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const QuestionFormView = defineAsyncComponent({
	loader: () => import('@/views/admin/help/QuestionFormView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const TemplatedQuestionsView = defineAsyncComponent({
	loader: () => import('@/views/admin/help/TemplatedQuestionsView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const ScriptedQuestionsView = defineAsyncComponent({
	loader: () => import('@/views/admin/help/ScriptedQuestionsView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const PeerAssessmentView = defineAsyncComponent({
	loader: () => import('@/views/admin/help/PeerAssessmentView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const TicketingSystemView = defineAsyncComponent({
	loader: () => import('@/views/admin/help/TicketingSystemView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});
const ManualGradingView = defineAsyncComponent({
	loader: () => import('@/views/admin/help/ManualGradingView.vue'),
	loadingComponent: SkeletonComponent,
	errorComponent: ErrorComponent,
	timeout: 10000,
});

const SPA_URL_PREFIX = '';

const routes: RouteRecordRaw[] = [
	{
		path: SPA_URL_PREFIX,
		name: RouteNames.Home,
		component: defineAsyncComponent({
			loader: HomeView,
			loadingComponent: SkeletonComponent,
			errorComponent: ErrorComponent,
			timeout: 10000,
		}),
	},
	{
		path: '/404',
		name: RouteNames.NotFound,
		component: NotFoundComponent,
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
	{ path: '/:pathMatch(.*)*', redirect: { name: RouteNames.NotFound } },
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
