import * as cdk from 'aws-cdk-lib'

import { Construct } from 'constructs'
import { MyInfraStack } from '../my-infra-stack'

import * as constants from '../config/constants'

export class MyInfraDeployStage extends cdk.Stage {
  constructor(scope: Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props)

    const stack = new MyInfraStack(this, `${constants.appName}-MyInfraStack`)

    cdk.Tags.of(stack).add('Env', 'Production')
    cdk.Tags.of(stack).add('Product', 'MyAwesomeProduct')
    cdk.Tags.of(stack).add('System', 'MyAwesomeSystem')
    cdk.Tags.of(stack).add('Repo', 'https://github.com/Junglescout/js-bootcamp-cdk-pipelines-intro')
  }
}
