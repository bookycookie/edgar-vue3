import { MenuItem } from 'primevue/menuitem';

export interface Snippet extends MenuItem {
	id: number;
	title: string;
	ts_modified: string;
	label: string;
}
