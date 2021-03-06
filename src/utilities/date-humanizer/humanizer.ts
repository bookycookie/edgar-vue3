import { formatDistanceToNow } from 'date-fns';
export default function humanize(date: Date | undefined) {
	if (!date || Number.isNaN(date.getTime()) || date == null) return '';
	return `(${formatDistanceToNow(date, { addSuffix: true })})`;
}
