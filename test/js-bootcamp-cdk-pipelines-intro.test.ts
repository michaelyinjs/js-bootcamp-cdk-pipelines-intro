import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { MyInfraStack } from '../lib/my-infra-stack';

test('SQS Queue Created', () => {
  const app = new cdk.App();

  const stack = new MyInfraStack(app, 'MyInfraStack');

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::SQS::Queue', {
    VisibilityTimeout: 300,
  });
});
