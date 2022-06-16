export interface PreviousExamNotOver {
	ts_started: string;
	ts_submitted: string;
	duration: string;
	correct_no: number;
	incorrect_no: number;
	unanswered_no: number;
	partial_no: number;
	t_score: string;
	test_score_ignored: boolean;
	t_score_perc: string;
	passed: boolean;
	id_test_instance: number;
	show_review: boolean;
	ordinal: number;
	is_correct: boolean;
	is_incorrect: boolean;
	is_unanswered: boolean;
	is_partial: boolean;
	score: string;
	score_perc: string;
	correction?: any;
}
