export interface ExamStatistics {
	ts_started: string;
	ts_submitted: string;
	duration: string;
	correct_no: number;
	incorrect_no: number;
	unanswered_no: number;
	partial_no: number;
	t_score: string;
	t_score_perc: string;
	passed: boolean;
}
