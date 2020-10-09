const { transform } = require('@babel/core');
const jestPreset = require('babel-preset-jest');

module.exports = {
  process(src, filename) {
    const hackedSrc =
      `import ReactDOM from 'react-dom';\n` +
      src.replace(
        /(export const (.*) = )/g,
        `
it('$2', () => {
  const element = <$2 {...$2.args} />;
  ReactDOM.render(element, document.createElement('div'));
});
$1`
      );

    const result = transform(hackedSrc, {
      filename,
      presets: [jestPreset],
    });

    return result ? result.code : src;
  },
};
