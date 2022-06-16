export interface AllExamInstances {
	id: number;
	test_ordinal: number;
	title: string;
	ts_available_from: string;
	seconds_available_from: string;
	type_name: string;
	test_flags: string;
	allow_anonymous_stalk: boolean;
	uploaded_files_no: number;
	started: number;
	started_perc: string;
	submitted_perc: string;
	generated: number;
	submitted: number;
	total: number;
	ongoing: number;
	not_started: number;
	title_type_name: string;
}
