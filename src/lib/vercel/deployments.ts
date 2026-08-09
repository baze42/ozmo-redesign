export type VercelDeploymentState =
  | 'BLOCKED'
  | 'BUILDING'
  | 'CANCELED'
  | 'DELETED'
  | 'ERROR'
  | 'INITIALIZING'
  | 'QUEUED'
  | 'READY';

export interface VercelDeploymentRecord {
  id: string;
  url: string | null;
  state: VercelDeploymentState;
  source: string | null;
  deployHookId: string | null;
  deployHookJobId: string | null;
  createdAt: Date;
  buildingAt: Date | null;
  readyAt: Date | null;
  errorCode: string | null;
  errorMessage: string | null;
}

export interface VercelDeploymentTracker {
  findLatestDeployHookDeployment(input: {
    jobId: string;
    deployHookId?: string | null;
    createdAt: Date;
  }): Promise<VercelDeploymentRecord | null>;
}

export function createVercelDeploymentTracker(options: {
  apiToken: string;
  projectId: string;
  teamId?: string;
  target?: string;
  branch?: string;
  timeoutMs?: number;
  fetcher?: typeof fetch;
}): VercelDeploymentTracker {
  const fetcher = options.fetcher ?? globalThis.fetch.bind(globalThis);
  const timeoutMs = options.timeoutMs ?? 10_000;

  return {
    async findLatestDeployHookDeployment(input) {
      const url = new URL('https://api.vercel.com/v7/deployments');
      url.searchParams.set('projectId', options.projectId);
      url.searchParams.set('since', String(input.createdAt.getTime()));
      url.searchParams.set('limit', '10');
      url.searchParams.set('state', 'BUILDING,READY,ERROR,CANCELED,BLOCKED');

      if (options.target) {
        url.searchParams.set('target', options.target);
      }

      if (options.branch) {
        url.searchParams.set('branch', options.branch);
      }

      if (options.teamId) {
        url.searchParams.set('teamId', options.teamId);
      }

      const response = await fetcher(url.toString(), {
        headers: {
          authorization: `Bearer ${options.apiToken}`,
        },
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (!response.ok) {
        throw new Error(`Vercel deployments request failed with HTTP ${response.status}.`);
      }

      const body = (await response.json()) as { deployments?: unknown };
      const deployments = Array.isArray(body.deployments) ? body.deployments : [];

      return deployments
        .map(normalizeDeployment)
        .filter((deployment): deployment is VercelDeploymentRecord => deployment !== null)
        .filter((deployment) => matchesDeployHookJob(deployment, input))
        .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime())[0] ?? null;
    },
  };
}

function normalizeDeployment(value: unknown): VercelDeploymentRecord | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const record = value as Record<string, unknown>;
  const id = readString(record.uid) ?? readString(record.id);
  const state = readDeploymentState(record.readyState) ?? readDeploymentState(record.state);
  const createdAt = readTimestamp(record.createdAt) ?? readTimestamp(record.created);

  if (!id || !state || !createdAt) {
    return null;
  }

  return {
    id,
    url: readString(record.url),
    state,
    source: readString(record.source),
    deployHookId: readDeployHookId(record.meta),
    deployHookJobId: readDeployHookJobId(record.meta),
    createdAt,
    buildingAt: readTimestamp(record.buildingAt),
    readyAt:
      readTimestamp(record.ready) ??
      readTimestamp(record.readyAt) ??
      readTimestamp(record.buildErrorAt) ??
      readTimestamp(record.canceledAt) ??
      readTimestamp(record.deletedAt),
    errorCode: readString(record.errorCode),
    errorMessage: readString(record.errorMessage),
  };
}

function matchesDeployHookJob(
  deployment: VercelDeploymentRecord,
  input: { jobId: string; deployHookId?: string | null; createdAt: Date },
) {
  if (deployment.deployHookJobId) {
    return (
      deployment.deployHookJobId === input.jobId &&
      (!input.deployHookId ||
        !deployment.deployHookId ||
        deployment.deployHookId === input.deployHookId)
    );
  }

  return (
    Boolean(input.deployHookId) &&
    deployment.deployHookId === input.deployHookId &&
    deployment.source === 'api-trigger-git-deploy' &&
    deployment.createdAt.getTime() >= input.createdAt.getTime()
  );
}

function readDeployHookId(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  const record = value as Record<string, unknown>;

  return readString(record.deployHookId) ?? readString(record.deploy_hook_id);
}

function readDeployHookJobId(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  const record = value as Record<string, unknown>;

  return (
    readString(record.deployHookJobId) ??
    readString(record.deploy_hook_job_id) ??
    readString(record.jobId) ??
    readString(record.job_id)
  );
}

function readString(value: unknown) {
  return typeof value === 'string' && value.trim() !== '' ? value : null;
}

function readDeploymentState(value: unknown): VercelDeploymentState | null {
  if (typeof value !== 'string') {
    return null;
  }

  if (
    value === 'BLOCKED' ||
    value === 'BUILDING' ||
    value === 'CANCELED' ||
    value === 'DELETED' ||
    value === 'ERROR' ||
    value === 'INITIALIZING' ||
    value === 'QUEUED' ||
    value === 'READY'
  ) {
    return value;
  }

  return null;
}

function readTimestamp(value: unknown) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return null;
  }

  return new Date(value);
}
