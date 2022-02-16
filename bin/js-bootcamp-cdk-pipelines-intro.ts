#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { JsBootcampCdkPipelinesIntroStack } from '../lib/js-bootcamp-cdk-pipelines-intro-stack';

const app = new cdk.App();

// DON'T FORGET TO CREATE CODEBUILD PROJECT FOR
// GITHUB SOURCE AUTHENTICATION ON ACLOUD GURU

new JsBootcampCdkPipelinesIntroStack(app, 'JsBootcampCdkPipelinesIntroStack');
