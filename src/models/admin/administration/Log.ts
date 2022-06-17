export interface LogConfig {
	label: string;
	type: string;
	path: string;
}

export interface LogEntry {
	logConfig: LogConfig;
	hostname: string;
	appInstance: number;
	message: string;
	ts_log: Date;
	ts_collector: Date;
	script: string;
	level: string;
}
