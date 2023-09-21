#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ApiStack } from '../lib/api-stack';
import { InitStack } from '../lib/init-stack';
import { PROJECT_NAME } from '../lib/utils';

const app = new cdk.App();

const initStack = new InitStack(app, 'init-stack', {
  stackName: `${PROJECT_NAME}-init-stack`,
});

const apiStack = new ApiStack(app, 'api-stack', {
  stackName: `${PROJECT_NAME}-api-stack`,
  bucket: initStack.bucket,
  table: initStack.table,
});
apiStack.addDependency(initStack);
