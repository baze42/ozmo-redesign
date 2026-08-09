import { describe, expect, it, vi } from 'vitest';

import { createVercelDeploymentTracker } from '../../../src/lib/vercel/deployments';

describe('createVercelDeploymentTracker', () => {
  it('queries Vercel deployments by project, target, branch, and deploy hook job timestamp', async () => {
    const fetcher = vi.fn(
      async (_input: string | URL | Request, _init?: RequestInit) =>
        new Response(
          JSON.stringify({
            deployments: [
              {
                uid: 'dpl_ready',
                url: 'ozmo-ready.vercel.app',
                readyState: 'READY',
                source: 'git',
                meta: {},
                createdAt: Date.parse('2026-08-09T12:03:03.000Z'),
                buildingAt: Date.parse('2026-08-09T12:03:10.000Z'),
                ready: Date.parse('2026-08-09T12:04:40.000Z'),
                errorCode: null,
                errorMessage: null,
              },
              {
                uid: 'dpl_ready',
                url: 'ozmo-ready.vercel.app',
                readyState: 'READY',
                source: 'api-trigger-git-deploy',
                meta: { deployHookId: 'hook_ozmo', deployHookJobId: 'job_ready' },
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

    const deployment = await tracker.findLatestDeployHookDeployment({
      jobId: 'job_ready',
      deployHookId: 'hook_ozmo',
      createdAt: new Date('2026-08-09T12:02:00.000Z'),
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
    expect(String(url)).toContain('state=BUILDING%2CREADY%2CERROR%2CCANCELED%2CBLOCKED');
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
      source: 'api-trigger-git-deploy',
      deployHookId: 'hook_ozmo',
      deployHookJobId: 'job_ready',
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
      tracker.findLatestDeployHookDeployment({
        jobId: 'job_failed',
        deployHookId: 'hook_ozmo',
        createdAt: new Date('2026-08-09T12:02:00.000Z'),
      }),
    ).rejects.toThrow('Vercel deployments request failed with HTTP 401');
  });

  it('matches by deploy hook id when deployment job metadata is not available', async () => {
    const fetcher = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            deployments: [
              {
                uid: 'dpl_competing',
                url: 'ozmo-other.vercel.app',
                readyState: 'READY',
                source: 'api-trigger-git-deploy',
                meta: { deployHookId: 'hook_other' },
                createdAt: Date.parse('2026-08-09T12:03:30.000Z'),
                buildingAt: Date.parse('2026-08-09T12:03:40.000Z'),
                ready: Date.parse('2026-08-09T12:04:50.000Z'),
              },
              {
                uid: 'dpl_ozmo',
                url: 'ozmo-rebuild.vercel.app',
                readyState: 'READY',
                source: 'api-trigger-git-deploy',
                meta: { deployHookId: 'hook_ozmo' },
                createdAt: Date.parse('2026-08-09T12:02:30.000Z'),
                buildingAt: Date.parse('2026-08-09T12:02:40.000Z'),
                ready: Date.parse('2026-08-09T12:03:50.000Z'),
              },
            ],
          }),
          { status: 200 },
        ),
    );
    const tracker = createVercelDeploymentTracker({
      apiToken: 'vercel-token',
      projectId: 'prj_ozmo',
      fetcher,
    });

    const findByHookId = tracker.findLatestDeployHookDeployment as (input: {
      jobId: string;
      deployHookId: string;
      createdAt: Date;
    }) => ReturnType<typeof tracker.findLatestDeployHookDeployment>;
    const deployment = await findByHookId({
      jobId: 'job_queued',
      deployHookId: 'hook_ozmo',
      createdAt: new Date('2026-08-09T12:02:00.000Z'),
    });

    expect(deployment?.id).toBe('dpl_ozmo');
    expect(deployment).toMatchObject({
      deployHookJobId: null,
      deployHookId: 'hook_ozmo',
    });
  });

  it('matches deploy hook metadata without depending on one Vercel source string', async () => {
    const tracker = createVercelDeploymentTracker({
      apiToken: 'vercel-token',
      projectId: 'prj_ozmo',
      fetcher: vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              deployments: [
                {
                  uid: 'dpl_ozmo',
                  url: 'ozmo-rebuild.vercel.app',
                  readyState: 'READY',
                  source: 'git-deploy-hook',
                  meta: { deployHookId: 'hook_ozmo' },
                  createdAt: Date.parse('2026-08-09T12:02:30.000Z'),
                  buildingAt: Date.parse('2026-08-09T12:02:40.000Z'),
                  ready: Date.parse('2026-08-09T12:03:50.000Z'),
                },
              ],
            }),
            { status: 200 },
          ),
      ),
    });
    const deployment = await tracker.findLatestDeployHookDeployment({
      jobId: 'job_queued',
      deployHookId: 'hook_ozmo',
      createdAt: new Date('2026-08-09T12:02:00.000Z'),
    });

    expect(deployment).toMatchObject({
      id: 'dpl_ozmo',
      source: 'git-deploy-hook',
      deployHookId: 'hook_ozmo',
    });
  });
});
