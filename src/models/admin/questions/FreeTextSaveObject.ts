export interface FreeTextSaveObject {
	id_question?: number;
	is_active?: boolean;
	can_upload?: boolean;
	save?: string;
	question_text?: string;
	question_tags?: number[];
	attachment?: string;
	attachment_label?: string;
	text_answer?: string;
	question_comment?: string;
}
