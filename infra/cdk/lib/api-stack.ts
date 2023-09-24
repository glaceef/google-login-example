import * as cdk from 'aws-cdk-lib';
import { AllowedMethods, CachePolicy, Distribution, PriceClass, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { HttpOrigin, S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { FunctionUrlAuthType } from 'aws-cdk-lib/aws-lambda';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { RustFunction, Settings } from 'rust.aws-cdk-lambda';
import { makeResourceName } from './utils';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { PolicyDocument, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';

interface ApiStackProps extends cdk.StackProps {
  bucket: Bucket,
  table: Table,
}

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const { bucket, table } = props;

    const lambdaRole = new Role(this, 'LambdaRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      inlinePolicies: {
        DynamoDB: new PolicyDocument({
          statements: [
            new PolicyStatement({
              actions: ['dynamodb:*'],
              resources: ['*'],
            }),
          ]
        }),
        CloudWatchLogs: new PolicyDocument({
          statements: [
            new PolicyStatement({
              actions: ['logs:*'],
              resources: ['*'],
            }),
          ]
        }),
      },
    });

    Settings.WORKSPACE_DIR = '../../apps/api';

    let lambdaApi = new RustFunction(this, 'Api', {
      functionName: makeResourceName('api'),
      timeout: cdk.Duration.seconds(60),
      setupLogging: true,
      logRetention: RetentionDays.ONE_WEEK,
      environment: {
        RUST_BACKTRACE: '1',
        CALLBACK_URL: 'https://d2t22igidsgvxm.cloudfront.net/login/callback',
        TABLE_NAME: table.tableName,
      },
      role: lambdaRole,
    });
    let lambdaFunctionUrl = lambdaApi.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
    });
    let apiOriginUrl = cdk.Fn.select(2, cdk.Fn.split('/', lambdaFunctionUrl.url));

    const s3Origin = new S3Origin(bucket, {
      originId: 'S3Origin',
    });
    const apiOrigin = new HttpOrigin(apiOriginUrl, {
      originId: 'ApiOrigin',
    });
    new Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: s3Origin,
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
      },
      additionalBehaviors: {
        '/api/*': {
          origin: apiOrigin,
          allowedMethods: AllowedMethods.ALLOW_ALL,
          cachePolicy: CachePolicy.CACHING_DISABLED,
          viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        }
      },
      priceClass: PriceClass.PRICE_CLASS_100,
    })
  }
}
