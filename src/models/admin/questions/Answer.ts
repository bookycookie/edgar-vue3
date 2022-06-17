export interface Answer {
	is_correct: boolean;
	answer_text: string;
	ordinal: number;
	threshold_weight: number;
	penalty_percentage: number;
}
