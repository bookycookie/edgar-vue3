export interface SearchTable {
	id: number;
	version: number;
	is_active: string;
	question_text: string;
	tags: string;
	user_modified_sl: string;
	ts_modified_sl: string;
	days_ago: number;
	user_created: string;
	ts_created_sl: string;
	type_name: string;
	ts_last_used: string;
	last_used_by_id: number;
	last_used_by_name: string;
	last_used_by_alt_id2: string;
	test_instance_id: number;
}
