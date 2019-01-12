'use strict'

module.exports = {
  siteMetadata: {
    title: 'twopennycode',
    description: 'A blog about my journey to learn new things.',
    siteUrl: 'https://twopennycode.com',
    author: {
      name: 'Simon Korzunov',
      url: 'https://twitter.com/twopSK'
    }
  },
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'content',
        path: `${__dirname}/src/content`
      }
    },

    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-responsive-iframe',
            options: {
              wrapperStyle: 'margin-bottom: 1rem'
            }
          },
          {
            resolve: 'gatsby-remark-prismjs',
            options: { classPrefix: 'language-', noInlineHighlight: true }
            // options: {
            //   // Class prefix for <pre> tags containing syntax highlighting;
            //   // defaults to 'language-' (eg <pre class="language-js">).
            //   // If your site loads Prism into the browser at runtime,
            //   // (eg for use with libraries like react-live),
            //   // you may use this to prevent Prism from re-processing syntax.
            //   // This is an uncommon use-case though;
            //   // If you're unsure, it's best to use the default value.
            //   classPrefix: 'language-',
            //   // This is used to allow setting a language for inline code
            //   // (i.e. single backticks) by creating a separator.
            //   // This separator is a string and will do no white-space
            //   // stripping.
            //   // A suggested value for English speakers is the non-ascii
            //   // character '›'.
            //   inlineCodeMarker: null,
            //   // This lets you set up language aliases.  For example,
            //   // setting this to '{ sh: "bash" }' will let you use
            //   // the language "sh" which will highlight using the
            //   // bash highlighter.
            //   aliases: {},
            //   // This toggles the display of line numbers globally alongside the code.
            //   // To use it, add the following line in src/layouts/index.js
            //   // right after importing the prism color scheme:
            //   //  `require("prismjs/plugins/line-numbers/prism-line-numbers.css");`
            //   // Defaults to false.
            //   // If you wish to only show line numbers on certain code blocks,
            //   // leave false and use the {numberLines: true} syntax below
            //   showLineNumbers: false,
            //   // If setting this to true, the parser won't handle and highlight inline
            //   // code used in markdown i.e. single backtick code like `this`.
            //   noInlineHighlight: true
            // }
          },
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants',
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 1140,
              quality: 90,
              linkImagesToOriginal: false
            }
          }
        ]
      }
    },
    'gatsby-transformer-json',
    {
      resolve: 'gatsby-plugin-canonical-urls',
      options: {
        siteUrl: 'https://twopennycode.com'
      }
    },
    'gatsby-plugin-emotion',
    'gatsby-plugin-typescript',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    'gatsby-plugin-react-helmet'
  ]
}
