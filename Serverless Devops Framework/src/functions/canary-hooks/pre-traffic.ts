import { Context } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { Metrics } from '@aws-lambda-powertools/metrics';
import { Tracer } from '@aws-lambda-powertools/tracer';

const logger = new Logger({ serviceName: 'canary-pre-traffic' });
const metrics = new Metrics({ namespace: 'ServerlessDevOps' });
const tracer = new Tracer({ serviceName: 'canary-pre-traffic' });

interface CanaryEvent {
  functionName: string;
  functionVersion: string;
  aliasName: string;
}

export const handler = async (
  event: CanaryEvent,
  context: Context
): Promise<void> => {
  logger.info('Starting pre-traffic canary validation', { event });

  try {
    // Add your custom health checks here
    // For example:
    // 1. Check if the function can connect to its dependencies
    // 2. Verify the function's configuration
    // 3. Run smoke tests
    // 4. Check memory usage
    // 5. Verify environment variables

    // Example health check (replace with actual checks)
    const healthChecks = [
      checkFunctionConfiguration(event),
      checkDependencies(event),
      checkMemoryUsage(event),
    ];

    await Promise.all(healthChecks);

    metrics.addMetric('CanaryPreTrafficSuccess', 'Count', 1);
    logger.info('Pre-traffic canary validation successful', { event });
  } catch (error) {
    metrics.addMetric('CanaryPreTrafficFailure', 'Count', 1);
    logger.error('Pre-traffic canary validation failed', { error, event });
    throw error; // This will cause the canary deployment to fail
  }
};

async function checkFunctionConfiguration(event: CanaryEvent): Promise<void> {
  // Add your function configuration checks here
  logger.info('Checking function configuration', { event });
  // Example: Verify environment variables, memory settings, etc.
}

async function checkDependencies(event: CanaryEvent): Promise<void> {
  // Add your dependency checks here
  logger.info('Checking dependencies', { event });
  // Example: Verify database connections, external service availability, etc.
}

async function checkMemoryUsage(event: CanaryEvent): Promise<void> {
  // Add your memory usage checks here
  logger.info('Checking memory usage', { event });
  // Example: Verify memory usage is within acceptable limits
} 