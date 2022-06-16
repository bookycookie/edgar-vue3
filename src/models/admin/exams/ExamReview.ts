export interface ExamReview {
	id_test_instance: number;
	title: string;
	questions_no: number;
	seconds_left: number;
	prolonged?: boolean;
	correct_no: number;
	incorrect_no: number;
	unanswered_no: number;
	partial_no: number;
	score: number;
	passed: boolean;
	answers_outcome: string;
	student: string;
	alt_id: string;
	alt_id2: string;
	show_solutions: boolean;
	type_name: string;
}
