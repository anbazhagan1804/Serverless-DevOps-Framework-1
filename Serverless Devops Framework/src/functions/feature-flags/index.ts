import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { Metrics } from '@aws-lambda-powertools/metrics';
import { Tracer } from '@aws-lambda-powertools/tracer';

const logger = new Logger({ serviceName: 'feature-flags' });
const metrics = new Metrics({ namespace: 'ServerlessDevOps' });
const tracer = new Tracer({ serviceName: 'feature-flags' });

const ddbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddbClient);

interface FeatureFlag {
  featureKey: string;
  environment: string;
  enabled: boolean;
  description?: string;
  percentage?: number;
  lastModified: string;
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const featureKey = event.pathParameters?.featureKey;
  const environment = process.env.STAGE || 'dev';

  if (!featureKey) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Feature key is required' }),
    };
  }

  try {
    switch (event.httpMethod) {
      case 'GET':
        return await getFeatureFlag(featureKey, environment);
      case 'PUT':
        return await updateFeatureFlag(featureKey, environment, event.body);
      default:
        return {
          statusCode: 405,
          body: JSON.stringify({ message: 'Method not allowed' }),
        };
    }
  } catch (error) {
    logger.error('Error processing request', { error });
    metrics.addMetric('FeatureFlagError', 'Count', 1);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};

async function getFeatureFlag(
  featureKey: string,
  environment: string
): Promise<APIGatewayProxyResult> {
  const command = new GetCommand({
    TableName: process.env.FEATURE_FLAGS_TABLE,
    Key: {
      featureKey,
      environment,
    },
  });

  const result = await docClient.send(command);
  metrics.addMetric('GetFeatureFlag', 'Count', 1);

  if (!result.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Feature flag not found' }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result.Item),
  };
}

async function updateFeatureFlag(
  featureKey: string,
  environment: string,
  body: string | null
): Promise<APIGatewayProxyResult> {
  if (!body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Request body is required' }),
    };
  }

  const featureFlag: FeatureFlag = {
    ...JSON.parse(body),
    featureKey,
    environment,
    lastModified: new Date().toISOString(),
  };

  const command = new PutCommand({
    TableName: process.env.FEATURE_FLAGS_TABLE,
    Item: featureFlag,
  });

  await docClient.send(command);
  metrics.addMetric('UpdateFeatureFlag', 'Count', 1);

  return {
    statusCode: 200,
    body: JSON.stringify(featureFlag),
  };
} 