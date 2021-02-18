module.exports = {
  presets: [require.resolve('@docusaurus/core/lib/babel/preset')],
  plugins: [[
    "prismjs", {
      languages: ["javascript", "css", "html"],
      plugins: ["line-numbers", "show-language"],
      theme: "tomorrow",
      css: true
    },
  ]],
};
