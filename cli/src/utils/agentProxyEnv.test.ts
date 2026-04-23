/* ### HAPI-LAB SPECIFIC CODE START ### */
import { afterEach, describe, expect, it } from 'vitest';
import { buildAgentProxyEnv } from './agentProxyEnv';

describe('buildAgentProxyEnv', () => {
    const originalAgentProxyMode = process.env.HAPI_AGENT_PROXY_MODE;
    const originalAgentHttpProxy = process.env.HAPI_AGENT_HTTP_PROXY;
    const originalAgentHttpsProxy = process.env.HAPI_AGENT_HTTPS_PROXY;
    const originalAgentAllProxy = process.env.HAPI_AGENT_ALL_PROXY;
    const originalAgentNoProxy = process.env.HAPI_AGENT_NO_PROXY;

    afterEach(() => {
        if (originalAgentProxyMode === undefined) delete process.env.HAPI_AGENT_PROXY_MODE;
        else process.env.HAPI_AGENT_PROXY_MODE = originalAgentProxyMode;
        if (originalAgentHttpProxy === undefined) delete process.env.HAPI_AGENT_HTTP_PROXY;
        else process.env.HAPI_AGENT_HTTP_PROXY = originalAgentHttpProxy;
        if (originalAgentHttpsProxy === undefined) delete process.env.HAPI_AGENT_HTTPS_PROXY;
        else process.env.HAPI_AGENT_HTTPS_PROXY = originalAgentHttpsProxy;
        if (originalAgentAllProxy === undefined) delete process.env.HAPI_AGENT_ALL_PROXY;
        else process.env.HAPI_AGENT_ALL_PROXY = originalAgentAllProxy;
        if (originalAgentNoProxy === undefined) delete process.env.HAPI_AGENT_NO_PROXY;
        else process.env.HAPI_AGENT_NO_PROXY = originalAgentNoProxy;
    });

    it('inherits existing proxy settings by default', () => {
        delete process.env.HAPI_AGENT_PROXY_MODE;
        delete process.env.HAPI_AGENT_HTTP_PROXY;

        const env = buildAgentProxyEnv({
            HTTP_PROXY: 'http://127.0.0.1:8080',
            http_proxy: 'http://127.0.0.1:8080'
        });

        expect(env.HTTP_PROXY).toBe('http://127.0.0.1:8080');
        expect(env.http_proxy).toBe('http://127.0.0.1:8080');
    });

    it('isolates agent proxy and applies custom values', () => {
        process.env.HAPI_AGENT_PROXY_MODE = 'isolated';
        process.env.HAPI_AGENT_HTTP_PROXY = 'http://127.0.0.1:7897';
        process.env.HAPI_AGENT_ALL_PROXY = 'socks5://127.0.0.1:7897';

        const env = buildAgentProxyEnv({
            HTTP_PROXY: 'http://corp-proxy:8080',
            HTTPS_PROXY: 'http://corp-proxy:8080'
        });

        expect(env.HTTP_PROXY).toBe('http://127.0.0.1:7897');
        expect(env.http_proxy).toBe('http://127.0.0.1:7897');
        expect(env.ALL_PROXY).toBe('socks5://127.0.0.1:7897');
        expect(env.all_proxy).toBe('socks5://127.0.0.1:7897');
        expect(env.HTTPS_PROXY).toBeUndefined();
    });

    it('disables proxy for agent when mode is off', () => {
        process.env.HAPI_AGENT_PROXY_MODE = 'off';
        process.env.HAPI_AGENT_HTTP_PROXY = 'http://127.0.0.1:7897';

        const env = buildAgentProxyEnv({
            HTTP_PROXY: 'http://corp-proxy:8080',
            HTTPS_PROXY: 'http://corp-proxy:8080',
            ALL_PROXY: 'socks5://corp-proxy:1080'
        });

        expect(env.HTTP_PROXY).toBeUndefined();
        expect(env.HTTPS_PROXY).toBeUndefined();
        expect(env.ALL_PROXY).toBeUndefined();
        expect(env.http_proxy).toBeUndefined();
    });
});
/* ### HAPI-LAB SPECIFIC CODE END ### */
