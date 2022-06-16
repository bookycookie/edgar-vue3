export interface FeedbackTableRow {
	id: number;
	student_id: number;
	student_alt_id2: string;
	student_label: string;
	class_group: string;
	exercise_id?: any;
	exercise_title?: any;
	tutorial_id: number;
	tutorial_title: string;
	tutorial_step_id: number;
	tutorial_step_ordinal: number;
	tutorial_step_title: string;
	question_id: number;
	question_text: string;
	comment?: any;
	rating: string;
	ts_created: string;
	tutorial_title_step_title: string;
	star_rating: number;
	humanized_ts_created: string;
}
