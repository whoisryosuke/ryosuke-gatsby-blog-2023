import React from "react"
import { graphql } from "gatsby"
import { MDXProvider } from "@mdx-js/react"
import MDXComponents from "../components/mdx-components"

export default function BlogPostTemplate({ data, children }) {
  return (
    <>
      <h1>{data.mdx.frontmatter.title}</h1>
      <MDXProvider components={MDXComponents}>
        {children}
      </MDXProvider>
    </>
  )
}

export const query = graphql`
  query($id: String!) {
    mdx(id: { eq: $id }) {
      frontmatter {
        title
      }
    }
  }
`