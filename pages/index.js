import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { PrismicLink } from "apollo-link-prismic";
import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import gql from "graphql-tag";

const client = new ApolloClient({
  link: PrismicLink({
      uri: process.env.PRISMIC_ACCESS_API,
      accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  }),
  cache: new InMemoryCache()
});

export const getStaticProps = async () => {
  const data = await client.query({
    query: gql`
      query{
        allBlogs{
          edges{
            node{
              title,
              content,
              _meta{
                id,
                uid,
                type,
              }
            }
          }
        }
      }
    `
  }).then((res) => {
    return res.data.allBlogs.edges
  })

  const posts = await data

  return {
    props: {
      posts
    }
  }
}


export default function Home({ posts }) {
  console.log(posts)
  return (
    <div>
      <Head>
        <title>My Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
          <ul>
          {
            posts.map((post) => (
              <li key={post.node._meta.uid}>
                <Link href = {`blog/${post.node._meta.uid}`}>
                  <a>{ post.node.title[0].text }</a>
                </Link>
              </li>
            ))
          }
          </ul>
      </main>
    </div>
  )
}
