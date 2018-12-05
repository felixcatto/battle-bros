module.exports = {
  presets: [
    ['@babel/env', {
      targets: {
        node: true,
      },
      useBuiltIns: 'usage',
    }],
  ],
  plugins: [
    ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
  ],
};
