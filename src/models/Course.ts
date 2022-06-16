export default interface Course {
	id: number;
	course_name: string;
	course_desc: string;
	ects_credits: number;
	course_acronym: string;
	course_url: string | null;
}
