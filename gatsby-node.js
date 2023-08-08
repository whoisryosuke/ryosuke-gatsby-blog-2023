const path = require("path");
const { createFilePath } = require(`gatsby-source-filesystem`);
const blogPostTemplate = path.resolve(`./src/templates/blog-post.tsx`);

/**
 * Custom Webpack config
 *
 * Adds aliases for paths (like components)
 * so you don't get lost in relative hell -> '../../../'
 */
exports.onCreateWebpackConfig = ({ config, actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        "@components": path.join(__dirname, "./src/components"),
        "@theme": path.join(__dirname, "./src/theme"),
      },
    },
  });
};

/**
 * Generate and slug to MDX content
 */
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;

  if (node.internal.type === "Mdx") {
    const value = createFilePath({ node, getNode, basePath: `content` });
    createNodeField({
      // Name of the field you are adding
      name: "slug",
      // Individual MDX node
      node,
      // Generated value based on filepath with "blog" prefix. We
      // don't need a separating "/" before the value because
      // createFilePath returns a path with the leading "/".
      value: `/${node.frontmatter.section}${value}`,
    });
  }
};

/**
 * Create pages for MDX content
 */
exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  const result = await graphql(`
    query {
      allMdx {
        nodes {
          id
          fields {
            slug
          }
          internal {
            contentFilePath
          }
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild("Error loading MDX result", result.errors);
  }

  // Create blog post pages.
  const posts = result.data.allMdx.nodes;

  // you'll call `createPage` for each result
  posts.forEach((node) => {
    createPage({
      // As mentioned above you could also query something else like frontmatter.title above and use a helper function
      // like slugify to create a slug
      path: node.fields.slug,
      // Provide the path to the MDX content file so webpack can pick it up and transform it into JSX
      component: `${blogPostTemplate}?__contentFilePath=${node.internal.contentFilePath}`,
      // You can use the values in this context in
      // our page layout component
      context: { id: node.id },
    });
  });
};
