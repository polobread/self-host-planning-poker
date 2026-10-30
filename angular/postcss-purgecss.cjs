const purgecss = require('@fullhuman/postcss-purgecss');

// Keep runtime classes created by ng-bootstrap and Angular bindings.
module.exports = () => purgecss({
  content: ['./src/**/*.{html,ts}'],
  safelist: {
    standard: ['html', 'body', 'd-block'],
    deep: [/^offcanvas/, /tooltip/, /^modal/, /^toast/, /^show/, /^hide/, /^hiding$/, /^fade$/, /^collaps/]
  }
});
module.exports.postcss = true;
