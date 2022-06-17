export interface RuntimeConstraint {
	c_question_test_id: number;
	programming_language_id: number;
	constraint_id: number;
	constraint_name: string;
	constraint_value: string | number | boolean;
	constraint_type: string;
	j0_unit_type: string;
	override_level: string;
}
