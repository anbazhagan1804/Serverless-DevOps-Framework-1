import { Context } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { Metrics } from '@aws-lambda-powertools/metrics';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { CloudWatchClient, GetMetricStatisticsCommand } from '@aws-sdk/client-cloudwatch';

const logger = new Logger({ serviceName: 'canary-post-traffic' });
const metrics = new Metrics({ namespace: 'ServerlessDevOps' });
const tracer = new Tracer({ serviceName: 'canary-post-traffic' });

const cloudWatch = new CloudWatchClient({});

interface CanaryEvent {
  functionName: string;
  functionVersion: string;
  aliasName: string;
  startTime: string;
  endTime: string;
}

interface MetricThreshold {
  metricName: string;
  threshold: number;
  comparison: 'greater' | 'less';
}

const METRIC_THRESHOLDS: MetricThreshold[] = [
  {
    metricName: 'Errors',
    threshold: 1,
    comparison: 'greater',
  },
  {
    metricName: 'Duration',
    threshold: 1000, // 1 second
    comparison: 'greater',
  },
  {
    metricName: 'Throttles',
    threshold: 0,
    comparison: 'greater',
  },
];

export const handler = async (
  event: CanaryEvent,
  context: Context
): Promise<void> => {
  logger.info('Starting post-traffic canary validation', { event });

  try {
    const validationResults = await Promise.all(
      METRIC_THRESHOLDS.map((threshold) =>
        validateMetric(event, threshold)
      )
    );

    const hasFailures = validationResults.some((result) => !result.passed);
    if (hasFailures) {
      const failures = validationResults
        .filter((result) => !result.passed)
        .map((result) => result.metricName);
      
      metrics.addMetric('CanaryPostTrafficFailure', 'Count', 1);
      logger.error('Post-traffic canary validation failed', {
        event,
        failedMetrics: failures,
      });
      throw new Error(`Canary validation failed for metrics: ${failures.join(', ')}`);
    }

    metrics.addMetric('CanaryPostTrafficSuccess', 'Count', 1);
    logger.info('Post-traffic canary validation successful', { event });
  } catch (error) {
    metrics.addMetric('CanaryPostTrafficError', 'Count', 1);
    logger.error('Error during post-traffic canary validation', { error, event });
    throw error;
  }
};

async function validateMetric(
  event: CanaryEvent,
  threshold: MetricThreshold
): Promise<{ metricName: string; passed: boolean }> {
  const command = new GetMetricStatisticsCommand({
    Namespace: 'AWS/Lambda',
    MetricName: threshold.metricName,
    Dimensions: [
      {
        Name: 'FunctionName',
        Value: event.functionName,
      },
      {
        Name: 'Resource',
        Value: `${event.functionName}:${event.functionVersion}`,
      },
    ],
    StartTime: new Date(event.startTime),
    EndTime: new Date(event.endTime),
    Period: 60,
    Statistics: ['Sum'],
  });

  try {
    const response = await cloudWatch.send(command);
    const datapoints = response.Datapoints || [];
    const total = datapoints.reduce((sum, point) => sum + (point.Sum || 0), 0);

    const passed =
      threshold.comparison === 'greater'
        ? total <= threshold.threshold
        : total >= threshold.threshold;

    logger.info('Metric validation result', {
      metricName: threshold.metricName,
      total,
      threshold: threshold.threshold,
      passed,
    });

    return {
      metricName: threshold.metricName,
      passed,
    };
  } catch (error) {
    logger.error('Error validating metric', {
      error,
      metricName: threshold.metricName,
    });
    throw error;
  }
} 