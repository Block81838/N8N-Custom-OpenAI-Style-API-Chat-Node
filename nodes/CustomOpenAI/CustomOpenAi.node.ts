import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IRequestOptions,
	NodeExecutionWithMetadata,
	NodeOperationError,
} from 'n8n-workflow';

export class CustomOpenAi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Custom OpenAI Chat',
		icon: 'file:customOpenAi.svg',
		version: 1,
		name: 'customOpenAi',
		group: ['transform'],
		defaults: {
			name: 'Custom OpenAI Chat',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'customOpenAiApi',
				required: false,
			},
		],
		properties: [
			{
				displayName: 'Base URL',
				name: 'base_url',
				type: 'string',
				default: '',
				placeholder: 'Base URL',
				description: 'Base URL for API',
			},
			{
				displayName: 'Prompt',
				name: 'prompt',
				type: 'string',
				default: '',
				placeholder: 'Prompt',
				description: 'What do you wanna ask',
			},
			{
				displayName: 'Temperature',
				name: 'temperature',
				type: 'number',
				default: 0.7,
				hint: 'Between 0 to 1',
				description:
					'Randomness, low values of temperature make the text more predictable and consistent, while high values let more freedom and creativity into the mix, but can also make things less consistent',
			},
			{
				displayName: 'Top P',
				name: 'top_p',
				type: 'number',
				default: 0.5,
				hint: 'Between 0.1 to 0.9',
				description:
					'How many possible words to consider, a high “top_p” value means the model looks at more possible words, even the less likely ones, which makes the generated text more diverse',
			},
			{
				displayName: 'Model',
				name: 'model',
				type: 'options',
				default: 'gpt-4o',
				options: [
					{
						name: 'GPT-4',
						displayName: 'GPT-4',
						value: 'gpt-4',
					},
					{
						name: 'GPT-4o',
						displayName: 'GPT-4o',
						value: 'gpt-4o',
					},
					{
						name: 'GPT-4-Mini',
						displayName: 'GPT-4-Mini',
						value: 'gpt-4o-mini',
					},
					{
						name: 'ChatGPT-Turbo',
						displayName: 'ChatGPT-16k',
						value: 'gpt-3.5-turbo',
					},
					{
						name: 'ChatGPT-Turbo-16k',
						displayName: 'ChatGPT-16k',
						value: 'gpt-3.5-turbo-16k',
					},
					{
						name: 'GPT-4-128k',
						displayName: 'GPT-4-128k',
						value: 'gpt-4-vision-preview',
					},
					{
						name: 'Claude-3-Opus',
						displayName: 'Claude-3-Opus',
						value: 'gpt-4-turbo-preview',
					},
					{
						name: 'Llama-3.1-405B-T',
						displayName: 'Llama-3.1-405B-T',
						value: 'Llama-3.1-405B-T',
					},
					{
						name: 'Llama-3.1-405B-FW-128k',
						displayName: 'Llama-3.1-405B-FW-128k',
						value: 'Llama-3.1-405B-FW-128k',
					},
					{
						name: 'Llama-3.1-70B-T',
						displayName: 'Llama-3.1-70B-T',
						value: 'Llama-3.1-70B-T',
					},
					{
						name: 'Llama-3.1-70B-FW-128k',
						displayName: 'Llama-3.1-70B-FW-128k',
						value: 'Llama-3.1-70B-FW-128k',
					},
					{
						name: 'Claude-3.5-Sonnet',
						displayName: 'Claude-3.5-Sonnet',
						value: 'Claude-3.5-Sonnet',
					},
					{
						name: 'Claude-3-Sonnet',
						displayName: 'Claude-3-Sonnet',
						value: 'Claude-3-Sonnet',
					},
					{
						name: 'Claude-3-Haiku',
						displayName: 'Claude-3-Haiku',
						value: 'Claude-3-Haiku',
					},
					{
						name: 'Llama-3-70b-Groq',
						displayName: 'Llama-3-70b-Groq',
						value: 'Llama-3-70b-Groq',
					},
					{
						name: 'Gemini-1.5-Pro',
						displayName: 'Gemini-1.5-Pro',
						value: 'Gemini-1.5-Pro',
					},
					{
						name: 'Gemini-1.5-Pro-128k',
						displayName: 'Gemini-1.5-Pro-128k',
						value: 'Gemini-1.5-Pro-128k',
					},
					{
						name: 'Gemini-1.5-Pro-1M',
						displayName: 'Gemini-1.5-Pro-1M',
						value: 'Gemini-1.5-Pro-1M',
					},
					{
						name: 'DALL-E-3',
						displayName: 'DALL-E-3',
						value: 'DALL-E-3',
					},
					{
						name: 'StableDiffusionXL',
						displayName: 'StableDiffusionXL',
						value: 'StableDiffusionXL',
					},
				],
				description: 'Who do you wanna ask',
			},
		],
		description: 'Chat node for openai style api',
	};
	async execute(
		this: IExecuteFunctions,
	): Promise<INodeExecutionData[][] | NodeExecutionWithMetadata[][] | null> {
		let items: INodeExecutionData[] = this.getInputData();
		let return_data: Array<{ content: string }> = [];
		for (let i = 0; i < items.length; i++) {
			try {
				let prompt = this.getNodeParameter('prompt', i, '') as string;
				let temperature = this.getNodeParameter('temperature', i, 0.7) as number;
				let top_p = this.getNodeParameter('top_p', i, 0.5) as number;
				let base_url = this.getNodeParameter('base_url', i, 'http://localhost') as string;
				let modal = this.getNodeParameter('model', i, 'gpt-4o') as string;
				let post_data: { [key: string]: any } = {
					model: modal,
					messages: [{ content: prompt, role: 'user' }],
					temperature: temperature,
					top_p: top_p,
				};
				// let asd: AxiosRequestConfig = {};
				// let res = await axios.post(, post_data, asd);
				let query_config: IRequestOptions = {
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
					},
					method: 'POST',
					body: post_data,
					uri: `${base_url}/v1/chat/completions`,
					json: true,
				};
				let res = await this.helpers.requestWithAuthentication.call(
					this,
					'customOpenAiApi',
					query_config,
				);
				if (res.choices != undefined) {
					let choices: Array<{ [key: string]: any }> = res.choices;
					if (choices.length != 0) {
						let message = choices[0].message;
						if (message.content != undefined) {
							let content = message.content;
							return_data.push({ content });
						}
					} else {
						return_data.push({ content: 'error' });
					}
				}
			} catch (error) {
				// This node should never fail but we want to showcase how
				// to handle errors.
				if (this.continueOnFail()) {
					items.push({ json: this.getInputData(i)[0].json, error, pairedItem: i });
					return_data.push({ content: error as string });
				} else {
					// Adding `itemIndex` allows other workflows to handle this error
					if (error.context) {
						// If the error thrown already contains the context property,
						// only append the itemIndex
						error.context.itemIndex = i;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex: i,
					});
				}
			}
		}
		return [this.helpers.returnJsonArray(return_data)];
	}
}
