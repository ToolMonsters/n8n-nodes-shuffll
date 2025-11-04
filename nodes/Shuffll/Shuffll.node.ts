import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	ILoadOptionsFunctions,
	INodePropertyOptions,
} from 'n8n-workflow';

export class Shuffll implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Shuffll',
		name: 'shuffll',
		icon: 'file:shuffll.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Shuffll API - AI-powered video creation',
		defaults: {
			name: 'Shuffll',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'shuffllApi',
				required: true,
			},
		],
		properties: [
			// Resource selection with clearer labels
			{
				displayName: 'What would you like to do?',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: '🎬 Create & Manage Projects',
						value: 'project',
					},
					{
						name: '📋 Browse Templates',
						value: 'template',
					},
					{
						name: '👥 Invite Collaborators',
						value: 'guest',
					},
				],
				default: 'project',
				description: 'Choose what you want to do with Shuffll',
			},

			// PROJECT OPERATIONS
			{
				displayName: 'Action',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['project'],
					},
				},
				options: [
					{
						name: '➕ Create New Project',
						value: 'create',
						description: 'Start a new video project from scratch',
						action: 'Create a project',
					},
					{
						name: '📄 Create from Template',
						value: 'createFromTemplate',
						description: 'Use a pre-made template to create your project',
						action: 'Create a project from template',
					},
					{
						name: '⬇️ Export Project',
						value: 'export',
						description: 'Download your finished video',
						action: 'Export a project',
					},
				],
				default: 'create',
			},

			// TEMPLATE OPERATIONS
			{
				displayName: 'Action',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['template'],
					},
				},
				options: [
					{
						name: '📚 Get All Templates',
						value: 'getAll',
						description: 'View all available video templates',
						action: 'Get all templates',
					},
					{
						name: '🔍 Get Template Details',
						value: 'get',
						description: 'Get detailed information about a specific template',
						action: 'Get a template',
					},
				],
				default: 'getAll',
			},

			// GUEST OPERATIONS
			{
				displayName: 'Action',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['guest'],
					},
				},
				options: [
					{
						name: '✉️ Send Invitation',
						value: 'invite',
						description: 'Invite someone to collaborate on your project',
						action: 'Invite a guest',
					},
				],
				default: 'invite',
			},

			// ========== PROJECT: CREATE ==========
			{
				displayName: 'Organization',
				name: 'organizationId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getOrganizations',
				},
				required: true,
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['create', 'createFromTemplate'],
					},
				},
				default: '',
				description: 'Select your organization',
			},
			{
				displayName: 'Workspace',
				name: 'workspaceId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getWorkspaces',
					loadOptionsDependsOn: ['organizationId'],
				},
				required: true,
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['create', 'createFromTemplate'],
					},
				},
				default: '',
				description: 'Select your workspace',
			},
			{
				displayName: 'Template',
				name: 'templateId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getTemplates',
					loadOptionsDependsOn: ['organizationId', 'workspaceId'],
				},
				required: true,
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['createFromTemplate'],
					},
				},
				default: '',
				description: 'Choose a template for your video',
			},
			{
				displayName: 'Content Type',
				name: 'promptType',
				type: 'options',
				options: [
					{
						name: '🔗 Website Link',
						value: 'Link',
					},
					{
						name: '💭 Text Prompt',
						value: 'Prompt',
					},
					{
						name: '📝 Full Script',
						value: 'Script',
					},
				],
				required: true,
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['create', 'createFromTemplate'],
					},
				},
				default: 'Link',
				description: 'How do you want to create your video?',
			},
			{
				displayName: 'Your Content',
				name: 'prompt',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				required: true,
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['create', 'createFromTemplate'],
					},
				},
				default: '',
				description: 'Paste your link, prompt, or script here',
			},
			{
				displayName: 'Video Style',
				name: 'recordingType',
				type: 'options',
				options: [
					{
						name: '🤖 AI Avatar',
						value: 'avatar',
					},
					{
						name: '🎤 AI Voiceover Only',
						value: 'ai-voice',
					},
					{
						name: '📹 I\'ll Record Myself',
						value: 'camera',
					},
				],
				required: true,
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['create', 'createFromTemplate'],
					},
				},
				default: 'avatar',
				description: 'Choose how your video will be narrated',
			},
			{
				displayName: 'Optional Settings',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Setting',
				default: {},
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['create', 'createFromTemplate'],
					},
				},
				options: [
					{
						displayName: 'Tone of Voice',
						name: 'toneOfVoice',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getToneOfVoice',
						},
						default: 'Natural',
						description: 'How should the narrator sound?',
					},
					{
						displayName: 'Video Duration',
						name: 'videoLength',
						type: 'options',
						options: [
							{
								name: '⏱️ Short (1-2 min)',
								value: '0.5',
							},
							{
								name: '⏱️ Medium (2-3 min)',
								value: '1',
							},
							{
								name: '⏱️ Mid-Long (4-6 min)',
								value: '2',
							},
							{
								name: '⏱️ Long (7-10 min)',
								value: '3',
							},
						],
						default: '1',
						description: 'Target length for your video',
					},
					{
						displayName: 'Storytelling Style',
						name: 'storyTellingTechnique',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getStorytellingTechniques',
						},
						default: '',
						description: 'Choose a narrative structure',
					},
					{
						displayName: 'Language',
						name: 'language',
						type: 'options',
						options: [
							{
								name: '🌐 Auto-Detect',
								value: 'auto',
							},
							{
								name: '🇬🇧 English',
								value: 'en',
							},
							{
								name: '🇪🇸 Español',
								value: 'es',
							},
							{
								name: '🇫🇷 Français',
								value: 'fr',
							},
							{
								name: '🇮🇱 עברית',
								value: 'iw',
							},
							{
								name: '🇨🇳 中文',
								value: 'zh',
							},
						],
						default: 'auto',
						description: 'Video language',
					},
				],
			},

			// ========== PROJECT: EXPORT ==========
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['export'],
					},
				},
				default: '',
				description: 'The ID of the project to export',
				placeholder: 'Enter project ID',
			},
			{
				displayName: 'Enhance Video Quality',
				name: 'enhance',
				type: 'boolean',
				required: true,
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['export'],
					},
				},
				default: true,
				description: 'Whether to apply AI enhancement during export',
			},
			{
				displayName: 'Webhook URL',
				name: 'webhook',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['export'],
					},
				},
				default: '',
				description: 'URL to notify when export is ready (use a Webhook node)',
				placeholder: 'https://hooks.zapier.com/...',
			},

			// ========== TEMPLATE: GET ALL ==========
			{
				displayName: 'Organization',
				name: 'organizationId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getOrganizations',
				},
				required: true,
				displayOptions: {
					show: {
						resource: ['template'],
						operation: ['getAll', 'get'],
					},
				},
				default: '',
				description: 'Select your organization',
			},
			{
				displayName: 'Workspace',
				name: 'workspaceId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getWorkspaces',
					loadOptionsDependsOn: ['organizationId'],
				},
				required: true,
				displayOptions: {
					show: {
						resource: ['template'],
						operation: ['getAll', 'get'],
					},
				},
				default: '',
				description: 'Select your workspace',
			},
			{
				displayName: 'Template',
				name: 'templateId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getTemplates',
					loadOptionsDependsOn: ['organizationId', 'workspaceId'],
				},
				required: true,
				displayOptions: {
					show: {
						resource: ['template'],
						operation: ['get'],
					},
				},
				default: '',
				description: 'Choose which template to view',
			},

			// ========== GUEST: INVITE ==========
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['guest'],
						operation: ['invite'],
					},
				},
				default: '',
				description: 'The project you want to share',
				placeholder: 'Enter project ID',
			},
			{
				displayName: 'Guest Email',
				name: 'email',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['guest'],
						operation: ['invite'],
					},
				},
				default: '',
				description: 'Email address of the person to invite',
				placeholder: 'colleague@company.com',
			},
			{
				displayName: 'Guest Name',
				name: 'guestName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['guest'],
						operation: ['invite'],
					},
				},
				default: '',
				description: 'Full name of the person',
				placeholder: 'John Doe',
			},
			{
				displayName: 'Send Email Invitation',
				name: 'toSendEmailToGuest',
				type: 'boolean',
				required: true,
				displayOptions: {
					show: {
						resource: ['guest'],
						operation: ['invite'],
					},
				},
				default: true,
				description: 'Whether to automatically email the invitation',
			},
			{
				displayName: 'Notification Webhook (Optional)',
				name: 'guestFinishedWebhook',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['guest'],
						operation: ['invite'],
					},
				},
				default: '',
				description: 'Get notified when the guest completes their work',
				placeholder: 'https://hooks.zapier.com/...',
			},
		],
	};

	methods = {
		loadOptions: {
			async getOrganizations(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const credentials = await this.getCredentials('shuffllApi');
				
				const response = await this.helpers.httpRequest({
					method: 'GET',
					url: 'https://api.shuffll.com/api/v1/auth/organization/list',
					headers: {
						'X-API-KEY': credentials.apiKey as string,
					},
				});

				for (const org of response) {
					returnData.push({
						name: org.name,
						value: org.id,
					});
				}

				return returnData;
			},

			async getWorkspaces(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const organizationId = this.getCurrentNodeParameter('organizationId') as string;
				const returnData: INodePropertyOptions[] = [];

				if (!organizationId) {
					return returnData;
				}

				const credentials = await this.getCredentials('shuffllApi');

				const response = await this.helpers.httpRequest({
					method: 'GET',
					url: `https://api.shuffll.com/api/v1/auth/organization/${organizationId}`,
					headers: {
						'X-API-KEY': credentials.apiKey as string,
					},
				});

				for (const workspace of response.workspaces) {
					returnData.push({
						name: workspace.name,
						value: workspace.id,
					});
				}

				return returnData;
			},

			async getTemplates(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const organizationId = this.getCurrentNodeParameter('organizationId') as string;
				const workspaceId = this.getCurrentNodeParameter('workspaceId') as string;
				const returnData: INodePropertyOptions[] = [];

				if (!organizationId || !workspaceId) {
					return returnData;
				}

				const credentials = await this.getCredentials('shuffllApi');

				const response = await this.helpers.httpRequest({
					method: 'GET',
					url: `https://api.shuffll.com/api/v1/auth/organization/${organizationId}/workspace/${workspaceId}/templates`,
					headers: {
						'X-API-KEY': credentials.apiKey as string,
					},
				});

				for (const template of response) {
					returnData.push({
						name: template.name,
						value: template.id,
					});
				}

				return returnData;
			},

			async getToneOfVoice(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const credentials = await this.getCredentials('shuffllApi');
				
				const response = await this.helpers.httpRequest({
					method: 'GET',
					url: 'https://api.shuffll.com/api/v1/auth/config/tone_of_voice',
					headers: {
						'X-API-KEY': credentials.apiKey as string,
					},
				});

				for (const tone of response.tones) {
					returnData.push({
						name: tone.id,
						value: tone.id,
					});
				}

				return returnData;
			},

			async getStorytellingTechniques(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const credentials = await this.getCredentials('shuffllApi');
				
				const response = await this.helpers.httpRequest({
					method: 'GET',
					url: 'https://api.shuffll.com/api/v1/auth/config/storytelling_techniques',
					headers: {
						'X-API-KEY': credentials.apiKey as string,
					},
				});

				for (const technique of response.techniques) {
					returnData.push({
						name: technique.technique,
						value: technique.technique,
					});
				}

				return returnData;
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		const credentials = await this.getCredentials('shuffllApi');

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'project') {
					if (operation === 'create' || operation === 'createFromTemplate') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const workspaceId = this.getNodeParameter('workspaceId', i) as string;
						const promptType = this.getNodeParameter('promptType', i) as string;
						const prompt = this.getNodeParameter('prompt', i) as string;
						const recordingType = this.getNodeParameter('recordingType', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as any;

						const body: any = {
							prompt,
							promptType,
							recordingType,
							toneOfVoice: additionalFields.toneOfVoice || 'Natural',
							videoLength: additionalFields.videoLength || '1',
							storyTellingTechnique: additionalFields.storyTellingTechnique,
							language: { code: additionalFields.language || 'auto' },
						};

						if (operation === 'createFromTemplate') {
							const templateId = this.getNodeParameter('templateId', i) as string;
							body.customTemplate = { id: templateId };
						}

						const response = await this.helpers.httpRequest({
							method: 'POST',
							url: `https://api.shuffll.com/api/v1/auth/organization/${organizationId}/workspace/${workspaceId}/projects/create`,
							headers: {
								'X-API-KEY': credentials.apiKey as string,
								'Content-Type': 'application/json',
							},
							body,
						});

						returnData.push({ json: response });
					}

					if (operation === 'export') {
						const projectId = this.getNodeParameter('projectId', i) as string;
						const enhance = this.getNodeParameter('enhance', i) as boolean;
						const webhook = this.getNodeParameter('webhook', i) as string;

						const response = await this.helpers.httpRequest({
							method: 'POST',
							url: `https://api.shuffll.com/api/v1/auth/project/${projectId}/edit/export`,
							headers: {
								'X-API-KEY': credentials.apiKey as string,
								'Content-Type': 'application/json',
							},
							body: {
								enhance,
								webhook,
							},
						});

						returnData.push({ json: response });
					}
				}

				if (resource === 'template') {
					if (operation === 'getAll') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const workspaceId = this.getNodeParameter('workspaceId', i) as string;

						const response = await this.helpers.httpRequest({
							method: 'GET',
							url: `https://api.shuffll.com/api/v1/auth/organization/${organizationId}/workspace/${workspaceId}/templates`,
							headers: {
								'X-API-KEY': credentials.apiKey as string,
							},
						});

						for (const template of response) {
							returnData.push({ json: template });
						}
					}

					if (operation === 'get') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const workspaceId = this.getNodeParameter('workspaceId', i) as string;
						const templateId = this.getNodeParameter('templateId', i) as string;

						const response = await this.helpers.httpRequest({
							method: 'GET',
							url: `https://api.shuffll.com/api/v1/auth/organization/${organizationId}/workspace/${workspaceId}/templates/${templateId}`,
							headers: {
								'X-API-KEY': credentials.apiKey as string,
							},
						});

						returnData.push({ json: response });
					}
				}

				if (resource === 'guest') {
					if (operation === 'invite') {
						const projectId = this.getNodeParameter('projectId', i) as string;
						const email = this.getNodeParameter('email', i) as string;
						const guestName = this.getNodeParameter('guestName', i) as string;
						const toSendEmailToGuest = this.getNodeParameter('toSendEmailToGuest', i) as boolean;
						const guestFinishedWebhook = this.getNodeParameter('guestFinishedWebhook', i) as string;

						const response = await this.helpers.httpRequest({
							method: 'POST',
							url: `https://api.shuffll.com/api/v1/auth/project/${projectId}/share/invite`,
							headers: {
								'X-API-KEY': credentials.apiKey as string,
								'Content-Type': 'application/json',
							},
							body: {
								email,
								guestName,
								toSendEmailToGuest,
								guestFinishedWebhook,
								includeInviteInRes: true,
							},
						});

						returnData.push({ json: response });
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}