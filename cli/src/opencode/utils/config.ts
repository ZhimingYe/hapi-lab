/* ### HAPI-LAB SPECIFIC CODE START ### */
import { buildAgentProxyEnv } from '@/utils/agentProxyEnv';
/* ### HAPI-LAB SPECIFIC CODE END ### */

export function buildOpencodeEnv(): NodeJS.ProcessEnv {
    /* ### HAPI-LAB SPECIFIC CODE START ### */
    return buildAgentProxyEnv(process.env);
    /* ### HAPI-LAB SPECIFIC CODE END ### */
}
