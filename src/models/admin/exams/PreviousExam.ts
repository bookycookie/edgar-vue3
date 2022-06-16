export interface PreviousExam {
	title: string;
	test_score_ignored: boolean;
	tosort: string;
	ts_started: string;
	ts_submitted: string;
	duration: string;
	correct_no: number;
	incorrect_no: number;
	unanswered_no: number;
	partial_no: number;
	t_score: number;
	t_score_perc: number;
	passed: boolean;
	id_test_instance: number;
	show_review: boolean;
}
