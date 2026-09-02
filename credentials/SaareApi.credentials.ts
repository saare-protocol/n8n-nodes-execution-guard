import {
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class SaareApi implements ICredentialType {
  name = 'saareApi';
  displayName = 'SAARE Control Plane API';
  documentationUrl = 'https://console.saare.es';
  properties: INodeProperties[] = [
    {
      displayName: 'API Base URL',
      name: 'baseUrl',
      type: 'string',
      default: 'https://api.saare.es/api/v1',
      required: true,
    },
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
    },
    {
      displayName: 'Tenant Domain / ID',
      name: 'tenant',
      type: 'string',
      default: 'AUDITORIA_EMPRESA',
      required: true,
    },
  ];
}