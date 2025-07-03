const path = require('path');

module.exports = function (context, options) {
  return {
    name: 'tailwind-config',
    configurePostCss(postCssOptions) {
      // Append TailwindCSS v4 PostCSS plugin
      postCssOptions.plugins.push(require('@tailwindcss/postcss'));
      return postCssOptions;
    },
  };
};