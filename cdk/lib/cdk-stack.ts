import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cdk from 'aws-cdk-lib';
import { aws_s3 as s3 } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';

export interface CdkStackProps extends cdk.StackProps {
  bucketName: string;
  env: {
    region: string
  }
}

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CdkStackProps) {
    super(scope, id, props);

    const { bucketName } = props;

    const bucket = new s3.Bucket(this, 'MyAppBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      accessControl: s3.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
      websiteIndexDocument: "index.html",
      bucketName
    });

    const originAccessIdentity = new cloudfront.OriginAccessIdentity(this, 'OriginAccessIdentity');
    bucket.grantRead(originAccessIdentity);

    const distribution = new cloudfront.CloudFrontWebDistribution(this, 'MyAppDistribution', {
          originConfigs: [
            {
              s3OriginSource: {
                s3BucketSource: bucket,
                originAccessIdentity,
              },
              behaviors: [{ isDefaultBehavior: true }],
            },
          ],
        }
    );

    new BucketDeployment(this, 'DeployStaticAssets', {
      sources: [Source.asset('../dist')],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ['/*'],
    });

    new cdk.CfnOutput(this, 'bucketUrl', {
      value: bucket.bucketWebsiteUrl,
      exportName: 'bucketUrl',
    });
  }
}