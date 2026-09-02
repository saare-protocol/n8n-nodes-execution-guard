# SAARE Execution Guard — n8n Community Node

Official Layer 7 (L7) Execution Authorization and DLP Compliance Guard node for n8n AI workflows, built on the SGP 1.0 (Secure Governance Protocol).

## Overview
This node intercepts and evaluates prompts and LLM-directed workloads inline within n8n workflows before external API dispatch. It enforces:
- Ex-Ante Data Loss Prevention (DLP): Real-time pattern interception for national IDs (DNI/NIE), IBANs, and sensitive PII.
- Zero-Disk Plaintext Architecture: Pure in-memory (RAM-only) inspection with immediate buffer sanitization.
- Cryptographic Attestation: Deterministic execution permits sealed with Ed25519 signatures and RFC 3161 audit timestamps.
- Regulatory Alignment: Enterprise controls compliant with EU AI Act (Art. 15), DORA, and GDPR (Art. 9).

## Installation
In your n8n instance, navigate to:
Settings > Community Nodes > Install a community node

Enter:
@saare/n8n-nodes-execution-guard

## Credentials Setup
1. Add a SAARE Control Plane API credential in your n8n workspace.
2. Provide your SAARE API Key and Tenant Identifier (configured via your SAARE GRC Console).

## Usage
Insert the SAARE Execution Guard node immediately upstream of any model execution node (OpenAI, Anthropic, LangChain Agents, or custom HTTP nodes).

## License
Apache-2.0
