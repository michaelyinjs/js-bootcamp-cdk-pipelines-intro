export const generateInfraTestBuildSpec = () => ({
  version: 0.2,
  env: {
    shell: 'bash',
  },
  phases: {
    install: {
      'runtime-versions': {
        nodejs: '14',
      },
      commands: ['npm install'],
    },
    build: {
      commands: ['npm run test'],
    },
  },
  reports: {
    jest: { files: 'junit.xml', 'base-directory': './' },
  },
})
