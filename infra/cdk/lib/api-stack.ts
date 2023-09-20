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

interface ApiStackProps extends cdk.StackProps {
  bucket: Bucket,
  table: Table,
}

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const { bucket, table } = props;

    Settings.WORKSPACE_DIR = '../../apps/api';

    let lambdaApi = new RustFunction(this, 'Api', {
      functionName: makeResourceName('api'),
      timeout: cdk.Duration.seconds(60),
      setupLogging: true,
      logRetention: RetentionDays.ONE_WEEK,
      environment: {
        USERS_TABLE_NAME: table.tableName,
      },
    });
    let lambdaFunctionUrl = lambdaApi.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
      // cors: {
      //   allowedOrigins: ['http://localhost:8080'],
      //   allowedMethods: [HttpMethod.GET],
      // },
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
