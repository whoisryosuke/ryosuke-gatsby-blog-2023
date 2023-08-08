import React from "react"
import { graphql } from "gatsby"

export default function ArchivePage({ data }) {
    console.log('data', data)
  return (
    <>
    {data.allMdx.nodes.map((node) => {

      return <h2>{node.frontmatter.title}</h2>
    })}
    </>
  )
}

export const query = graphql`
  query {
    allMdx {
        nodes{
            frontmatter {
                title
                date(formatString: "MMMM DD, YYYY")
                tags
                cover_image
            }
        }
    }
  }
`