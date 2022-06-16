import axios from 'axios';
export default class ApiService {
	private baseUrl = `http://localhost:1337/api`;

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

			if (res && res.data && res.data.success === false) {
				return null;
			}

			console.log(res.data);
			data = res.data;
		} catch (error) {
			console.error(`ERROR at GET ${url}`);
			console.error(error);
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

			if (res && res.data && res.data.success === false) {
				return [];
			}

			console.log(res.data);
			data = res.data;
		} catch (error) {
			console.error(`ERROR at GET ${url}`);
			console.error(error);
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
		} catch (error) {
			console.error(`ERROR at POST ${url}`);
			console.error(error);
		}
		return res;
	}
}
