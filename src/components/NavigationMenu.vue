<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import Course from '../models/Course';
import AcademicYear from '../models/AcademicYear';
import ApiService from '../services/ApiService';
import RouteNames from '../router/routes';
import CONSTANTS from '@/config/constants';

//! TODO: Add store
const username = CONSTANTS.USERNAME;
const service = new ApiService();
const isAdmin = ref(true);

const courses = ref<Course[]>([]);
const selectedCourse = ref<Course>();
const academicYears = ref<AcademicYear[]>([]);
const selectedAcademicYear = ref<AcademicYear>();

onMounted(async () => {
	courses.value = await service.getManyAsync<Course>('/courses', { username: username });
	academicYears.value = await service.getManyAsync<AcademicYear>('/acdmYears', { username: username });
});

const adminItems = ref([
	{
		label: 'Exams',
		items: [
			{ label: 'My previous exams', to: { name: RouteNames.PreviousExams } },
			{ label: 'My tickets', to: { name: RouteNames.TicketsAdmin } },
			{ separator: true },
			{ label: 'Exam definitions', to: { name: RouteNames.ExamDefinitions } },
			{ label: 'All exam instances', to: { name: RouteNames.ExamInstances } },
			{ separator: true },
			{ label: "Export students' scores", to: { name: RouteNames.ExportStudentScores } },
			{ separator: true },
			{ label: 'Quiz definitions', to: { name: RouteNames.QuizDefinitions } },
			{ label: 'All quiz instances', to: { name: RouteNames.QuizInstances } },
			{ label: 'Start lecture quiz', to: { name: RouteNames.LectureQuiz } },
		],
	},
	{
		label: 'Learn',
		items: [
			{ label: 'New tutorial', to: { name: RouteNames.NewTutorial } },
			{ label: 'Tutorial definition', to: { name: RouteNames.TutorialDefinition } },
			{ label: 'Start tutorial', to: { name: RouteNames.StartTutorial } },
			{ separator: true },
			{ label: 'New exercise', to: { name: RouteNames.NewExercise } },
			{ label: 'Exercise definitions', to: { name: RouteNames.ExerciseDefinition } },
			{ label: 'Start exercise', to: { name: RouteNames.StartExercise } },
			{ separator: true },
			{ label: 'Feedback', to: { name: RouteNames.Feedback } },
		],
	},
	{
		label: 'Questions',
		items: [
			{ label: 'New question', to: { name: RouteNames.NewQuestion } },
			{ separator: true },
			{ label: 'List (all), and edit', to: { name: RouteNames.ListAllAndEdit } },
			{ label: 'Search', to: { name: RouteNames.Search } },
			{ separator: true },
			{
				label: 'Course structure: node graph & edit',
				to: { name: RouteNames.NodeVis },
			},
			{
				label: 'Course structure: assign questions to nodes & vv',
				to: { name: RouteNames.NodeQuestions },
			},
			{ separator: true },
			{
				label: 'Course structure (read only): Node tree vis',
				to: { name: RouteNames.NodeTreeVis },
			},
			{ separator: true },
			{ label: "Course's data object", to: { name: RouteNames.CourseDataObject } },
		],
	},
	{
		label: 'Preferences',
		items: [{ label: 'CodeMirror skin', to: { name: RouteNames.CodeMirrorSkin } }, { label: 'Mobile App Token' }],
	},
	{
		label: 'Playground',
		items: [
			{ label: 'Code sandbox', to: { name: RouteNames.CodeSandboxAdmin } },
			{ label: 'Snippet store', to: { name: RouteNames.SnippetStoreAdmin } },
		],
	},
	{
		label: 'Analytics',
		items: [
			{ label: 'Exam Analytics', to: { name: RouteNames.ExamAnalytics } },
			{
				label: 'Exam Score Distribution Analytics (+per class groups)',
				to: { name: RouteNames.ExamScoreDistributionAnalytics },
			},
			{ label: 'Questions Analytics', to: { name: RouteNames.QuestionsAnalytics } },
			{
				label: 'Student Behaviour Analytics',
				to: { name: RouteNames.StudentBehaviourAnalytics },
			},
			{
				label: 'Plagiarism detection',
				to: { name: RouteNames.PlagiarismDetection },
			},
			{
				label: 'Time dependant plagiarism detection',
				to: { name: RouteNames.TimeDependantPlagiarismDetection },
			},
			{ separator: true },
			{
				label: 'Students Scatter',
				to: { name: RouteNames.StudentsScatter },
			},
			{
				label: 'High Score List',
				to: { name: RouteNames.HighScoreList },
			},
		],
	},
	{
		label: 'Administration',
		items: [
			{ label: 'Upload students', to: { name: RouteNames.UploadStudents } },
			{
				label: 'Upload images (faces)',
				to: { name: RouteNames.UploadImages },
			},
			{ label: 'Students (list)', to: { name: RouteNames.StudentsList } },
			{
				label: 'Teachers (list)',
				to: { name: RouteNames.TeachersList },
			},
			{
				label: 'Users (list)',
				to: { name: RouteNames.UsersList },
			},
			{
				label: 'Logs (Edgar)',
				to: { name: RouteNames.EdgarLogs },
			},
			{
				label: 'Logs (Nginx)',
				to: { name: RouteNames.NginxLogs },
			},
			{ separator: true },
			{
				label: "Who's online?",
				to: { name: RouteNames.WhoIsOnline },
			},
		],
	},
	{
		label: 'Help',
		items: [
			{ label: 'Glossary', to: { name: RouteNames.Glossary } },
			{
				label: 'FAQ (hey, read the FAQ!)',
				to: { name: RouteNames.FrequentlyAskedQuestions },
			},
			{ separator: true },

			{ label: 'Exam form', to: { name: RouteNames.ExamForm } },
			{ separator: true },

			{
				label: 'Question operations (Save, Save in place, Clone, Delete)',
				to: { name: RouteNames.QuestionOperations },
			},
			{
				label: 'Question form',
				to: { name: RouteNames.QuestionForm },
			},
			{
				label: 'Templated questions',
				to: { name: RouteNames.TemplatedQuestions },
			},
			{
				label: 'Scripted questions',
				to: { name: RouteNames.ScriptedQuestions },
			},
			{ separator: true },

			{
				label: 'Peer Assessment',
				to: { name: RouteNames.PeerAssessment },
			},
			{
				label: 'Ticketing system',
				to: { name: RouteNames.TicketingSystem },
			},
			{
				label: 'Manual grading',
				to: { name: RouteNames.ManualGrading },
			},
		],
	},
]);

const studentItems = ref([
	{ label: 'My previous exams', to: { name: RouteNames.PreviousExamsStudent } },
	{ label: 'My tickets', to: { name: RouteNames.TicketsStudent } },
	{ label: 'My stats', to: { name: RouteNames.StatsStudent } },
	{ label: 'Code theme', to: { name: RouteNames.CodeThemeStudent } },
]);

const items = computed(() => (isAdmin.value ? adminItems.value : studentItems.value));
</script>

<template>
	<div class="">
		<Menubar :model="items" style="max-height: 6rem">
			<template #start>
				<router-link :to="{ name: RouteNames.Home }" class="ms-2 me-5">
					<img
						src="/images/edgar75.png"
						class="hand-cursor edgar-logo"
						title="Bcs middle-aged men with moustaches make great logos..." />
				</router-link>
			</template>
			<template #end>
				<div class="d-flex align-items-center ml-5">
					<Dropdown
						v-model="selectedCourse"
						:options="courses"
						:placeholder="selectedCourse?.course_acronym"
						option-label="course_acronym"
						class="outline mr-1 small-text-dropdown"
						style="max-height: 3rem; max-width: 10rem; min-width: 10rem">
						<template #option="slotProps">
							<span>{{ slotProps.option.course_name }}</span>
						</template>
					</Dropdown>
					<Dropdown
						v-model="selectedAcademicYear"
						:options="academicYears"
						:placeholder="selectedAcademicYear?.title"
						option-label="title"
						class="outline me-5 small-text-dropdown"
						style="max-height: 3rem; max-width: 9rem; min-width: 9rem">
						<template #option="slotProps">
							<span>{{ slotProps.option.title }}</span>
						</template>
					</Dropdown>
					<div class="profile-picture">
						<font-awesome-icon icon="user-secret" class="me-3 rounded-circle" style="font-size: 75px" />
					</div>

					<div style="min-width: 120px">
						<div>Borna Goljački</div>
						<Tag
							:value="isAdmin ? 'Admin' : 'Student'"
							:severity="isAdmin ? 'info' : 'danger'"
							rounded
							class="ml-4"></Tag>
						<div><small class="text-xs">IP:127.0.0.1</small></div>
						<div><small class="text-xs">Instance: 0@BOBI</small></div>
					</div>
					<div>
						<form action="/auth/logout" method="POST">
							<Button>Logout</Button>
						</form>
					</div>
				</div>
			</template>
		</Menubar>
	</div>
</template>

<style scoped>
.p-dropdown :deep(.p-dropdown-label),
.p-dropdown :deep(.p-dropdown-items) {
	font-size: 14px !important;
}
</style>
