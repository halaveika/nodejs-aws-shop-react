import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib/core';
import { CdkStack, CdkStackProps } from '../lib/cdk-stack';

const app = new cdk.App();
const stackProps: CdkStackProps = {
  bucketName: 'halaveika-nodejs-aws-shop-react',
  env: {
    region: 'us-east-1' // add your region
  }
};
new CdkStack(app, 'React-shop', stackProps);