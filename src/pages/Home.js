import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";

import { Grid, Transition } from "semantic-ui-react";

import { AuthContext } from "../context/auth";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { FETCH_POSTS_QUERY } from "../utils/graphql";

const Home = () => {
  const { user } = useContext(AuthContext);
  //   give getPosts an alias "Posts"
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);
  //   if (posts) {
  //     console.log(posts);
  //   }
  //   const posts = data.getPosts;

  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {user && (
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )}
        {loading ? (
          <h1>Loading Posts ...</h1>
        ) : //  if there is posts
        data ? (
          data.getPosts &&
          data.getPosts.map((post) => (
            <Transition.Group>
              {
                <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                  <PostCard post={post} />
                </Grid.Column>
              }
            </Transition.Group>
          ))
        ) : null}
      </Grid.Row>
    </Grid>
  );
};

export default Home;
