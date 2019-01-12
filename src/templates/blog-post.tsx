import React from 'react'
import { graphql } from 'gatsby'

import { Page } from '../components/Page'
import { Container } from '../components/Container'
import IndexLayout from '../layouts'
import { margins } from '../styles/variables'
import { SubTitle } from '../components/SubTitle'

import Bio from '../components/Bio'

interface PostTemplateProps {
  data: {
    site: {
      siteMetadata: {
        title: string
        description: string
        author: {
          name: string
          url: string
        }
      }
    }
    markdownRemark: {
      id: string
      html: string
      excerpt: string
      frontmatter: {
        title: string
        date: string
      }
    }
  }
}

// const PageTemplate: React.SFC<PostTemplateProps> = ({ data }) => (
//   <IndexLayout>
//     <Page>
//       <Container>
//         <h1>{data.markdownRemark.frontmatter.title}</h1>
//         <div dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }} />
//       </Container>
//     </Page>
//   </IndexLayout>
// )

const BlogPostTemplate: React.SFC<PostTemplateProps> = ({ data }) => {
  const post = data.markdownRemark
  // const siteTitle = data.site.siteMetadata.title
  // const siteDescription = post.excerpt
  // const { previous, next } = this.props.pageContext

  //   <IndexLayout>
  //   <Page>
  //     <Container>
  //       <h1>{data.markdownRemark.frontmatter.title}</h1>
  //       <div dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }} />
  //     </Container>
  //   </Page>
  // </IndexLayout>

  return (
    <IndexLayout>
      <Page>
        <Container>
          <h1>{post.frontmatter.title}</h1>
          <SubTitle txt={post.frontmatter.date} />
          <div dangerouslySetInnerHTML={{ __html: post.html }} />
          <hr style={{ marginBottom: margins.m }} />
          <Bio />

          {/* <ul
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              listStyle: 'none',
              padding: 0
            }}
          >
            <li>
              {previous && (
                <Link to={previous.fields.slug} rel="prev">
                  ← {previous.frontmatter.title}
                </Link>
              )}
            </li>
            <li>
              {next && (
                <Link to={next.fields.slug} rel="next">
                  {next.frontmatter.title} →
                </Link>
              )}
            </li>
          </ul> */}
        </Container>
      </Page>
    </IndexLayout>
  )
}

export const query = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        description
        author {
          name
          url
        }
      }
    }

    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`

export default BlogPostTemplate
