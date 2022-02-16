import * as cdk from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild'
import * as pipelines from 'aws-cdk-lib/pipelines'

import { Construct } from 'constructs';
import { generateInfraLintBuildSpec } from './buildspecs/infra-lint-build-spec';
import { generateInfraTestBuildSpec } from './buildspecs/infra-test-build-spec';
import { MyInfraDeployStage } from './stages/my-infra-deploy-stage';

import * as constants from './config/constants'

export class JsBootcampCdkPipelinesIntroStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.createPullRequestBuilds()

    const pipeline = new pipelines.CodePipeline(this, `${constants.appName}-Pipeline`, {
      synth: this.generateCdkCloudAssemblyStep(),
      dockerEnabledForSynth: true,
      crossAccountKeys: true,
    })

    pipeline.addWave('Infrastructure-QA', {
      pre: [
        new pipelines.CodeBuildStep('Lint', {
          partialBuildSpec: codebuild.BuildSpec.fromObject(generateInfraLintBuildSpec()),
          commands: [],
        }),
        new pipelines.CodeBuildStep('Test', {
          partialBuildSpec: codebuild.BuildSpec.fromObject(generateInfraTestBuildSpec()),
          commands: [],
        }),
      ],
    })

    pipeline.addStage(new MyInfraDeployStage(this, 'MyInfraDeployStage'))
  }

  private createPullRequestBuilds(): void {
    const source = codebuild.Source.gitHub({
      owner: constants.owner,
      repo: constants.repo,
      reportBuildStatus: true,
      webhook: true,
      webhookFilters: [
        codebuild.FilterGroup.inEventOf(
          codebuild.EventAction.PULL_REQUEST_CREATED,
          codebuild.EventAction.PULL_REQUEST_UPDATED,
          codebuild.EventAction.PULL_REQUEST_REOPENED,
        ),
      ],
    })

    new codebuild.Project(this, 'Infrastructure-Lint', {
      source,
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
        computeType: codebuild.ComputeType.SMALL,
      },
      buildSpec: codebuild.BuildSpec.fromObject(generateInfraLintBuildSpec()),
    })

    new codebuild.Project(this, 'Infrastructure-Test', {
      source,
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
        computeType: codebuild.ComputeType.SMALL,
      },
      buildSpec: codebuild.BuildSpec.fromObject(generateInfraTestBuildSpec()),
    })
  }

  private generateCdkCloudAssemblyStep(): pipelines.ShellStep {
    return new pipelines.ShellStep('Synth', {
      input: pipelines.CodePipelineSource.gitHub(`${constants.owner}/${constants.repo}`, constants.branchName),
      commands: ['npm ci', 'npm run build', 'npx cdk synth'],
    })
  }
}
