import * as cdk from 'aws-cdk-lib';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { makeResourceName } from './utils';

export class InitStack extends cdk.Stack {
  readonly bucket: Bucket;
  readonly table: Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.bucket = new Bucket(this, 'FrontendBucket', {
      bucketName: makeResourceName('frontend'),
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    });

    this.table = new Table(this, 'UsersTable', {
      tableName: 'google-login-example-users',
      partitionKey: {
        name: 'user_id',
        type: AttributeType.STRING,
      },
      readCapacity: 1,
      writeCapacity: 1,
    });
  }
}
