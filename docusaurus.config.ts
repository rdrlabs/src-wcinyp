import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'My Site',
  tagline: 'Dinosaurs are cool',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://wcinyp.netlify.app',
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

  plugins: [
    './plugins/tailwind-config.cjs',
    './plugins/alias-config.cjs',
  ],
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
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'WCINYP MRI Manual',
      logo: {
        alt: 'WCINYP Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Knowledgebase',
        },
        {
          to: '/providers',
          position: 'left',
          label: 'Providers',
        },
        {
          to: '/document-hub',
          position: 'left',
          label: 'Document Hub',
        },
        {
          to: '/form-generator',
          position: 'left',
          label: 'Form Generator',
        },
        {
          href: 'https://fed.nyp.org/idp/startSSO.ping?PartnerSpId=https%3A%2F%2Fnyp.workspaceair.com%2FSAAS%2FAPI%2F1.0%2FGET%2Fmetadata%2Fsp.xml&RelayState=ctx_cfc35e6f-9722-4493-9f9f-38bc88773c8b&SAMLRequest=nVNdj5swEPwryNI9gglJE7BCIpo0baRrLwq5PvTl5JjlzirY1Hbu4993IaGK1FwqVUILrNc745n1dP5aV94zGCu1SskgCIkHSuhCqseU3O9Wfkzms6nlddWw7OCe1BZ%2BHcA6D%2Fcpy7qFlByMYppbaZniNVjmBMuzr7csCkLWGO200BXxMmvBOARaaGUPNZgczLMUcL%2B9TcmTc41llKq3JnjR5qdtuAAuTSB0TfMsyylHeNoCUgO2wRZAvCVSkYq7jn3fooQiaNto80hl0VDruHF5fhc0eKr5Bn8UYjfrIu123Ayzm2iFzyVoTLfg%2BMo2a4yoEMbPn3YYa3C84I7jp20CFIR4K20EdDqlpORVS3G9TMmDKMXwA4xLP5lEkT8aJUM%2FKZPSH8Z7EceTyVDE%2B4fxOBpNwihGD9bWHmCtkLlyKYnCaOSHiR8lu8GIRSGLBsEkjH8Qb3MS96NUR8uuObE%2FFln2Zbfb%2BJu7fNc1eJYFmG9YnZJLChDvez8e2IQch4F1BM3ZFFyH5r31ZPZvo1FpijpTVJn2GtOjwlN6ht7PZct9vdzoSoo3L6sq%2FbIwwB38sQBdqbl7n%2BEgGHQZWfhlV8oOyjYgZCmhILTHOY0%2BFJ3BOMQOXt1Jj%2FPUosLjbqH8H3Wulgkm2taYPuN3kuQSgdlx7V3m9O97PfsN&OrgName=NYP',
          label: 'EPIC',
          position: 'right',
        },
        {
          type: 'html',
          position: 'right',
          value: '<a href="https://outlook.office365.com/mail/" target="_blank" rel="noopener noreferrer">Outlook</a>',
        },
        {
          type: 'html', 
          position: 'right',
          value: '<a href="https://teams.microsoft.com/" target="_blank" rel="noopener noreferrer">Teams</a>',
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;