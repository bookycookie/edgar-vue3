export interface TestItem {
	id_programming_language: number;
	c_test_type_id: number;
	percentage: number;
	allow_diff_order: boolean;
	allow_diff_letter_size: boolean;
	trim_whitespace: boolean;
	comment?: string;
	regex_override?: string;
	input: string;
	output: string;
	generator_test_file_id?: number;
	arguments?: string;
	description?: string;
	random_test_type_id?: number;
	low_bound?: number;
	upper_bound?: number;
	elem_count?: number;
	random_test_type_name?: string;
	id: number;
	is_public: boolean;
}
