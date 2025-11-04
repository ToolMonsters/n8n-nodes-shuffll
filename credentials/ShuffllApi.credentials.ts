import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ShuffllApi implements ICredentialType {
	name = 'shuffllApi';
	displayName = 'Shuffll API';
	documentationUrl = 'https://docs.shuffll.com';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Enter your Shuffll API Key. Open your <a href="https://app.shuffll.com/dashboard/(panel:api-key)" target="_blank">Profile Settings</a> in Shuffll, click the API Integration section, then copy the API Key and paste it here.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-KEY': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.shuffll.com/api/v1',
			url: '/auth/user/me',
			method: 'POST',
		},
	};
}