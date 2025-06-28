import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'WCINYP Resource Hub',
  tagline: 'Weill Cornell Imaging at NewYork-Presbyterian Resources',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://wcinyp-resources.netlify.app',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'rdrlabs', // Usually your GitHub org/user name.
  projectName: 'src-wcinyp', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese,
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/rdrlabs/src-wcinyp/tree/main/',
        },
        blog: false, // Disable blog feature
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'WCINYP Resources',
      logo: {
        alt: 'WCINYP Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Resources',
        },
        {
          href: '/docs/emergency',
          position: 'left',
          label: '🚨 Emergency',
          className: 'navbar-emergency-link',
        },
        {
          href: 'https://github.com/rdrlabs/src-wcinyp',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Quick Links',
          items: [
            {
              label: 'MRI Manual',
              to: '/docs/mri-manual',
            },
            {
              label: 'Contact Directory',
              to: '/docs/contacts',
            },
            {
              label: 'Emergency Procedures',
              to: '/docs/emergency',
            },
          ],
        },
        {
          title: 'Departments',
          items: [
            {
              label: 'Radiology',
              href: '#',
            },
            {
              label: 'Breast Imaging',
              href: '#',
            },
            {
              label: 'Administration',
              href: '#',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Scheduling Guidelines',
              to: '/docs/scheduling',
            },
            {
              label: 'Safety Protocols',
              to: '/docs/safety',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Weill Cornell Imaging at NewYork-Presbyterian.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;