import axios from 'axios';
import { useToast } from 'primevue/usetoast';
export default class ApiService {
	private baseUrl = `http://localhost:1337/api`;

	private toast = useToast();

	private logGetSuccess = false;
	private logPostSuccess = false;
	private logError = false;

	/**
	 * Sends an HTTP GET request for a single item of type T.
	 * @param endpoint - The endpoint of the API to target (e.g. /nodes).
	 * @param params - The parameters to be sent as query parameters.
	 * @returns T if the request successfully fetched data, else returns null.
	 */
	public async getSingleAsync<T>(endpoint: string, params: unknown = null): Promise<T | null> {
		const url = `${this.baseUrl}${endpoint}`;
		let data = null;

		try {
			console.log(`GET SINGLE ${url} ${params ? `with params ${JSON.stringify(params)}` : ''}`);
			const res = await axios.get(`${url}`, {
				params: params,
			});

			if (this.logGetSuccess)
				this.toast.add({
					severity: 'success',
					summary: `${res.status} ${res.statusText}`,
					detail: `Successful GET ${url}.`,
					life: 2000,
				});

			if (res && res.data && res.data.success === false) {
				return null;
			}

			console.log(res.data);
			data = res.data;
		} catch (error: any) {
			const err = error.response.data;
			console.error(error);
			if (this.logError)
				this.toast.add({
					severity: 'error',
					summary: `${err.status} ${err.statusText}`,
					detail: `GET ${url}: ${err.message}}.`,
				});
		}
		return data;
	}

	/**
	 * Sends an HTTP GET request for a collection of items of type T.
	 * @param endpoint - The endpoint of the API to target (e.g. /nodes).
	 * @param params - The parameters to be sent as query parameters.
	 * @returns A collection of T if the request successfully fetched data, else returns an empty array.
	 */
	public async getManyAsync<T = []>(endpoint: string, params: unknown = null): Promise<T[] | []> {
		const url = `${this.baseUrl}${endpoint}`;
		let data = [];

		try {
			console.log(`GET MANY ${url} ${params ? `with params ${JSON.stringify(params)}` : ''}`);
			const res = await axios.get(`${url}`, {
				params: params,
			});

			if (this.logGetSuccess)
				this.toast.add({
					severity: 'success',
					summary: `${res.status} ${res.statusText}`,
					detail: `GET ${url}.`,
					life: 2000,
				});
			if (res && res.data && res.data.success === false) {
				return [];
			}

			console.log(res.data);

			console.log(res);
			data = res.data;
		} catch (error: any) {
			const err = error.response;
			if (this.logError)
				this.toast.add({
					severity: 'error',
					summary: `${err.status} ${err.statusText}`,
					detail: `GET ${url}: ${err.data}}.`,
				});
		}
		return data;
	}

	/**
	 * Sends an HTTP POST request.
	 * @param endpoint - The endpoint of the API to target (e.g. /nodes).
	 * @param data - The data to be sent as part of the request body.
	 * @returns The response of the request.
	 */
	public async postAsync(endpoint: string, data: unknown): Promise<any> {
		const url = `${this.baseUrl}${endpoint}`;
		let res = '';
		try {
			console.log(`POST ${url} ${data ? `with body ${JSON.stringify(data)}` : ''}`);
			res = await axios.post(`${url}`, { data });

			if (this.logPostSuccess)
				this.toast.add({
					severity: 'success',
					summary: '200 OK',
					detail: `POST ${url}.`,
					life: 2500,
				});
		} catch (error: any) {
			const err = error.response;
			if (this.logError)
				this.toast.add({
					severity: 'error',
					summary: `${err.status} ${err.statusText}`,
					detail: `POST ${url}: ${err.data}}.`,
				});
		}
		return res;
	}
}
