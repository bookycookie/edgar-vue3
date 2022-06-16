export interface TestPart {
	id_test_part: number;
	ordinal: number;
	id_test: number;
	id_node: number;
	id_grading_model: number;
	id_question_type: number | null;
	min_questions: number;
	max_questions: number;
	pass_percentage: number;
	ts_created: string;
	node_name: string;
	type_name: string;
	node_name_and_type_name: string;
	cnt_active_qs: number;
}
