const fs = require("fs")
const ankiIcon = fs.readFileSync(require.resolve('./src/icons/anki.svg'), 'utf8')

const admonitions = {
  customTypes: {
    anki: {
      keyword: "anki",
      ifmClass: "anki",
      emoji: "❗️",
      svg: ankiIcon,
    },
  }
}

const presets = [
  [
    '@docusaurus/preset-classic',
    {
      showcase: {
      },
      docs: {
        sidebarPath: require.resolve('./sidebars.js'),
        editUrl: 'https://github.com/hgiesel/closet/edit/master/website/',
        admonitions,
      },
      theme: {
        customCss: require.resolve('./src/css/custom.css'),
      },
    },
  ],
]

module.exports = {
  title: 'Closet',
  tagline: 'The web framework for flashcards',
  url: 'https://closetengine.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.
  plugins: [
    'loaders',
  ],
  stylesheets: [
    "https://fonts.googleapis.com/icon?family=Material+Icons",
  ],
  themeConfig: {
    hideableSidebar: true,
    navbar: {
      title: 'Closet',
      logo: {
        alt: 'Closet logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          to: 'docs/showcase/',
          activeBasePath: 'showcase',
          label: 'Showcase',
          position: 'left',
        },
        {
          to: 'docs/tryit/',
          activeBasePath: 'tryit',
          label: 'Try it online',
          position: 'left',
        },
        {
          to: 'docs/installation/',
          activeBasePath: 'installation',
          label: 'Installation',
          position: 'left',
        },
        {
          href: 'https://github.com/hgiesel/closet',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Style Guide',
              to: 'docs/',
            },
            {
              label: 'Second Doc',
              to: 'docs/doc2/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/docusaurus',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: 'blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/facebook/docusaurus',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
    },
  },
  presets,
};
