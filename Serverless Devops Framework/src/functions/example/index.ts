import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { Metrics } from '@aws-lambda-powertools/metrics';
import { Tracer } from '@aws-lambda-powertools/tracer';

const logger = new Logger({ serviceName: 'example-function' });
const metrics = new Metrics({ namespace: 'ServerlessDevOps' });
const tracer = new Tracer({ serviceName: 'example-function' });

const ddbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddbClient);

interface FeatureFlag {
  enabled: boolean;
  percentage?: number;
}

async function isFeatureEnabled(featureKey: string, environment: string): Promise<boolean> {
  const command = new GetCommand({
    TableName: process.env.FEATURE_FLAGS_TABLE,
    Key: {
      featureKey,
      environment,
    },
  });

  try {
    const result = await docClient.send(command);
    const featureFlag = result.Item as FeatureFlag | undefined;

    if (!featureFlag) {
      logger.info('Feature flag not found', { featureKey, environment });
      return false;
    }

    if (!featureFlag.enabled) {
      logger.info('Feature flag is disabled', { featureKey, environment });
      return false;
    }

    if (featureFlag.percentage !== undefined) {
      const random = Math.random() * 100;
      const isEnabled = random < featureFlag.percentage;
      logger.info('Feature flag percentage check', {
        featureKey,
        environment,
        percentage: featureFlag.percentage,
        random,
        isEnabled,
      });
      return isEnabled;
    }

    return true;
  } catch (error) {
    logger.error('Error checking feature flag', { error, featureKey, environment });
    metrics.addMetric('FeatureFlagCheckError', 'Count', 1);
    return false;
  }
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const environment = process.env.STAGE || 'dev';
  const newFeatureEnabled = await isFeatureEnabled('new-feature', environment);

  try {
    // Example of using feature flags to control functionality
    if (newFeatureEnabled) {
      metrics.addMetric('NewFeatureUsed', 'Count', 1);
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'New feature is enabled!',
          timestamp: new Date().toISOString(),
          environment,
        }),
      };
    }

    // Fallback to old behavior
    metrics.addMetric('OldFeatureUsed', 'Count', 1);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Using standard feature',
        timestamp: new Date().toISOString(),
        environment,
      }),
    };
  } catch (error) {
    logger.error('Error processing request', { error });
    metrics.addMetric('RequestError', 'Count', 1);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
}; 