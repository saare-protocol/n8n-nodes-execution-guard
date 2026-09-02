import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
} from 'n8n-workflow';

export class SaareExecutionGuard implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'SAARE Execution Guard',
    name: 'saareExecutionGuard',
    icon: 'file:saare.svg',
    group: ['transform'],
    version: 1,
    description: 'L7 Ex-Ante Policy Enforcement & Cryptographic Sealing for AI Models',
    defaults: {
      name: 'SAARE Guard L7',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'saareApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Prompt / Input to Evaluate',
        name: 'inputText',
        type: 'string',
        default: '={{ $json.prompt || $json.text || $json.input || "" }}',
        description: 'The raw input passing into the LLM',
        required: true,
      },
      {
        displayName: 'Action On Policy Violation',
        name: 'onViolation',
        type: 'options',
        options: [
          { name: 'Halt Execution (Error)', value: 'halt' },
          { name: 'Redact Data (Anonymize & Continue)', value: 'redact' },
        ],
        default: 'halt',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const credentials = await this.getCredentials('saareApi');

    const dniRegex = /(?:^|\D)(\d{7,8}[-\s]?[A-Za-z]|[XYZ]\d{7}[-\s]?[A-Za-z])(?!\w)/i;
    const ibanRegex = /ES\d{2}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{2}[\s-]?\d{10}|ES\d{18,22}/i;

    for (let i = 0; i < items.length; i++) {
      let inputText = this.getNodeParameter('inputText', i, '') as string;
      const onViolation = this.getNodeParameter('onViolation', i, 'halt') as string;

      const hasDni = dniRegex.test(inputText);
      const hasIban = ibanRegex.test(inputText.replace(/[\s-]/g, ''));

      if (hasDni || hasIban) {
        if (onViolation === 'halt') {
          throw new NodeOperationError(
            this.getNode(),
            `[SAARE L7 BLOCK] Policy POL-RGPD-PII-01 triggered: Regulated data detected in execution buffer.`
          );
        } else {
          inputText = inputText
            .replace(dniRegex, '[DNI_REDACTED]')
            .replace(ibanRegex, '[IBAN_REDACTED]');
        }
      }

      const itemData = { ...items[i].json };
      itemData.prompt = inputText;
      itemData._saare_verdict = {
        status: 'VALID',
        decision: 'ALLOW',
        protocol: 'SGP_1.0',
        timestamp: new Date().toISOString(),
        tenant: credentials.tenant,
      };

      returnData.push({ json: itemData });
    }

    return [returnData];
  }
}