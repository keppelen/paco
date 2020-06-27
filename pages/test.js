import fetch from 'isomorphic-unfetch'

const Test = ({ posts }) => {
  return (
    <div>
      {posts.map(post => {
        return (
          <div>
            <h1>{post.title}</h1>
            <p>{post.body}</p>
          </div>
        )
      })}
    </div>
  )
}

export default Test

export const getStaticProps = async () => {
  const { posts } = await (await fetch('https://coil.paco.vercel.app')).json()

  return {
    props: {
      posts
    },
    unstable_revalidate: 1
  }
}
