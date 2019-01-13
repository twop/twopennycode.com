import * as React from 'react'
import { Link, graphql } from 'gatsby'

// require('prismjs/themes/prism-tomorrow.css')
// import Helmet from 'react-helmet'

import 'prismjs/themes/prism-tomorrow.css'

// import 'prism-themes/themes/prism-atom-dark.css'

import { Page } from '../components/Page'
import { Container } from '../components/Container'
import IndexLayout from '../layouts'
import Bio from '../components/Bio'
import { margins } from '../styles/variables'
import styled from '@emotion/styled'
import { SubTitle } from '../components/SubTitle'

// const IndexPage = () => (
//   <IndexLayout>
//     <Page>
//       <Container>
//         <Bio />
//         <h1>Hi people</h1>
//         <p>Welcome to your new Gatsby site.</p>
//         <p>Now go build something great.</p>
//         <Link to="/page-2/">Go to page 2</Link>
//       </Container>
//     </Page>
//   </IndexLayout>
// )

interface BlogIndexProps {
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
    allMarkdownRemark: {
      edges: Post[]
    }
  }
}

type Post = {
  node: {
    excerpt: string
    frontmatter: {
      title: string
      date: string
    }
    fields: {
      slug: string
    }
  }
}

const PostTitle = styled.h3`
  margin-bottom: ${margins.s};
`

const BioContainer = styled.div`
  margin-top: ${margins.xl};
  margin-bottom: ${margins.xl};
`

const BlogIndex: React.SFC<BlogIndexProps> = ({ data }) => {
  const posts = data.allMarkdownRemark.edges

  return (
    <IndexLayout>
      <Page>
        <Container>
          <BioContainer>
            <Bio />
          </BioContainer>
          {posts.map(({ node: { fields, excerpt, frontmatter } }) => {
            return (
              <div key={fields.slug}>
                <PostTitle>
                  <Link style={{ boxShadow: 'none' }} to={fields.slug}>
                    {frontmatter.title}
                  </Link>
                </PostTitle>
                <SubTitle txt={frontmatter.date} />
                <p dangerouslySetInnerHTML={{ __html: excerpt }} />
              </div>
            )
          })}
        </Container>
      </Page>
    </IndexLayout>
  )
}
// <Layout location={this.props.location} title={siteTitle}>
//   <Helmet htmlAttributes={{ lang: 'en' }} meta={[{ name: 'description', content: siteDescription }]} title={siteTitle} />
//   <Bio />

// </Layout>

export default BlogIndex
export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
          }
        }
      }
    }
  }
`
