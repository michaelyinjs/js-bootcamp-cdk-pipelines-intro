export const generateInfraLintBuildSpec = () => ({
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
      commands: ['npm run lint'],
    },
  },
  reports: {
    eslint: { files: 'eslint.xml', 'base-directory': './' },
  },
})
