/* ### HAPI-LAB SPECIFIC CODE START ### */
const PROXY_ENV_KEYS = [
    'HTTP_PROXY',
    'HTTPS_PROXY',
    'ALL_PROXY',
    'NO_PROXY',
    'http_proxy',
    'https_proxy',
    'all_proxy',
    'no_proxy'
] as const;

type AgentProxyMode = 'inherit' | 'isolated' | 'off';

function normalizeMode(rawMode: string | undefined): AgentProxyMode {
    const mode = rawMode?.trim().toLowerCase();
    if (mode === 'isolated' || mode === 'off') {
        return mode;
    }
    return 'inherit';
}

function setProxyPair(env: NodeJS.ProcessEnv, upperKey: string, lowerKey: string, value: string): void {
    env[upperKey] = value;
    env[lowerKey] = value;
}

export function buildAgentProxyEnv(baseEnv: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
    const env: NodeJS.ProcessEnv = { ...baseEnv };
    const mode = normalizeMode(process.env.HAPI_AGENT_PROXY_MODE);

    if (mode !== 'inherit') {
        for (const key of PROXY_ENV_KEYS) {
            delete env[key];
        }
    }

    if (mode === 'off') {
        return env;
    }

    const httpProxy = process.env.HAPI_AGENT_HTTP_PROXY?.trim();
    const httpsProxy = process.env.HAPI_AGENT_HTTPS_PROXY?.trim();
    const allProxy = process.env.HAPI_AGENT_ALL_PROXY?.trim();
    const noProxy = process.env.HAPI_AGENT_NO_PROXY?.trim();

    if (httpProxy) {
        setProxyPair(env, 'HTTP_PROXY', 'http_proxy', httpProxy);
    }
    if (httpsProxy) {
        setProxyPair(env, 'HTTPS_PROXY', 'https_proxy', httpsProxy);
    }
    if (allProxy) {
        setProxyPair(env, 'ALL_PROXY', 'all_proxy', allProxy);
    }
    if (noProxy) {
        setProxyPair(env, 'NO_PROXY', 'no_proxy', noProxy);
    }

    return env;
}
/* ### HAPI-LAB SPECIFIC CODE END ### */
