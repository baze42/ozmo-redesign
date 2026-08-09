import { describe, expect, it, vi } from 'vitest';

import { createVercelDeploymentTracker } from '../../../src/lib/vercel/deployments';

describe('createVercelDeploymentTracker', () => {
  it('queries Vercel deployments by project, target, branch, and since timestamp', async () => {
    const fetcher = vi.fn(
      async (_input: string | URL | Request, _init?: RequestInit) =>
        new Response(
          JSON.stringify({
            deployments: [
              {
                uid: 'dpl_ready',
                url: 'ozmo-ready.vercel.app',
                readyState: 'READY',
                createdAt: Date.parse('2026-08-09T12:02:03.000Z'),
                buildingAt: Date.parse('2026-08-09T12:02:10.000Z'),
                ready: Date.parse('2026-08-09T12:06:40.000Z'),
                errorCode: null,
                errorMessage: null,
              },
            ],
          }),
          { status: 200 },
        ),
    );
    const tracker = createVercelDeploymentTracker({
      apiToken: 'vercel-token',
      projectId: 'prj_ozmo',
      teamId: 'team_ozmo',
      target: 'production',
      branch: 'main',
      fetcher,
    });

    const deployment = await tracker.findLatestDeploymentStartedAfter({
      since: new Date('2026-08-09T12:02:00.000Z'),
    });

    expect(fetcher).toHaveBeenCalledTimes(1);
    const firstCall = fetcher.mock.calls[0];
    expect(firstCall).toBeDefined();
    const [url, init] = firstCall;
    expect(String(url)).toContain('https://api.vercel.com/v7/deployments?');
    expect(String(url)).toContain('projectId=prj_ozmo');
    expect(String(url)).toContain('target=production');
    expect(String(url)).toContain('branch=main');
    expect(String(url)).toContain(`since=${Date.parse('2026-08-09T12:02:00.000Z')}`);
    expect(String(url)).toContain('teamId=team_ozmo');
    expect(init).toMatchObject({
      headers: {
        authorization: 'Bearer vercel-token',
      },
    });
    expect(deployment).toEqual({
      id: 'dpl_ready',
      url: 'ozmo-ready.vercel.app',
      state: 'READY',
      createdAt: new Date('2026-08-09T12:02:03.000Z'),
      buildingAt: new Date('2026-08-09T12:02:10.000Z'),
      readyAt: new Date('2026-08-09T12:06:40.000Z'),
      errorCode: null,
      errorMessage: null,
    });
  });

  it('throws when Vercel rejects the deployments request', async () => {
    const tracker = createVercelDeploymentTracker({
      apiToken: 'vercel-token',
      projectId: 'prj_ozmo',
      fetcher: vi.fn(async () => new Response('Unauthorized', { status: 401 })),
    });

    await expect(
      tracker.findLatestDeploymentStartedAfter({
        since: new Date('2026-08-09T12:02:00.000Z'),
      }),
    ).rejects.toThrow('Vercel deployments request failed with HTTP 401');
  });
});
