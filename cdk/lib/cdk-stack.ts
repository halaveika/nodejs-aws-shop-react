import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucketName = 'halaveika-nodejs-aws-shop-react';

    const bucket = new s3.Bucket(this, 'MyAppBucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
      bucketName
    });

    const distribution = new cloudfront.CloudFrontWebDistribution(this, 'MyAppDistribution', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket,
          },
          behaviors: [{ isDefaultBehavior: true }],
        },
      ],
    });

    new BucketDeployment(this, 'DeployStaticAssets', {
      sources: [Source.asset('../../../dist/')], 
      destinationBucket: bucket,
      distribution,
    });
  }
}


