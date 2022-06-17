export interface Question {
	id: number;
	version: number;
	is_active: boolean;
	id_prev_question?: number;
	id_question_type: number;
	question_text: string;
	id_user_created: number;
	ts_created: string;
	ts_modified: string;
	user_modified: string;
	id_user_modified: number;
	can_upload: boolean;
	question_comment: string;
	id_next_question?: number;
	type_name: string;
	has_answers: boolean;
	user_created: string;
	paths: string;
	last_used: string;
	count_used: number;
	data_object: string;
	eval_script: string;
	id_script_programming_language: number;
}
