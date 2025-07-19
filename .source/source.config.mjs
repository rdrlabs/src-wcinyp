// source.config.ts
import { defineDocs, defineConfig } from "fumadocs-mdx/config";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
var { docs, meta } = defineDocs({
  dir: "content/docs"
});
var source_config_default = defineConfig({
  lastModifiedTime: "git",
  mdxOptions: {
    remarkPlugins: [remarkMath],
    // IMPORTANT: rehypeKatex must come BEFORE other rehype plugins
    rehypePlugins: (plugins) => [
      [rehypeKatex, {
        // KaTeX options
        output: "html",
        throwOnError: false,
        errorColor: "#cc0000"
      }],
      ...plugins
      // Default plugins (including syntax highlighter) come after
    ],
    rehypeCodeOptions: {
      langs: [
        "javascript",
        "typescript",
        "jsx",
        "tsx",
        "json",
        "yaml",
        "markdown",
        "mdx",
        "bash",
        "python",
        "css",
        "html",
        "xml",
        "latex",
        // For math/LaTeX highlighting
        "tex"
        // TeX/LaTeX
      ],
      themes: {
        light: "github-light",
        dark: "github-dark"
      }
    }
  }
});
export {
  source_config_default as default,
  docs,
  meta
};
