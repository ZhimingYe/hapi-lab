import { AgentRegistry } from '@/agent/AgentRegistry';
import { AcpSdkBackend } from '@/agent/backends/acp';
/* ### HAPI-LAB SPECIFIC CODE START ### */
import { buildAgentProxyEnv } from '@/utils/agentProxyEnv';
/* ### HAPI-LAB SPECIFIC CODE END ### */

function buildEnv(): Record<string, string> {
    /* ### HAPI-LAB SPECIFIC CODE START ### */
    const agentEnv = buildAgentProxyEnv(process.env);
    /* ### HAPI-LAB SPECIFIC CODE END ### */
    return Object.keys(agentEnv).reduce((acc, key) => {
        const value = agentEnv[key];
        if (typeof value === 'string') {
            acc[key] = value;
        }
        return acc;
    }, {} as Record<string, string>);
}

export function registerGeminiAgent(yolo: boolean): void {
    const args = ['--experimental-acp'];
    if (yolo) args.push('--yolo');

    AgentRegistry.register('gemini', () => new AcpSdkBackend({
        command: 'gemini',
        args,
        env: buildEnv()
    }));
}
