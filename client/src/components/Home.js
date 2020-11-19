import { gql, useQuery } from "@apollo/client";
import React from "react";
import {
  Dimmer,
  Divider,
  Grid,
  Header,
  Image,
  Loader,
  Segment,
} from "semantic-ui-react";
import PostCard from "./common/PostCard";

export default function Home() {
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);
  console.log(data);
  return (
    <div>
      <Divider horizontal>
        <Header as="h4">Your Post Feed</Header>
      </Divider>

      <Grid stackable divided="vertically">
        <Grid.Row>
          {loading ? (
            <Segment placeholder padded="very" color="grey" size="massive">
              <Dimmer active>
                <Loader>Loading, Please Wait</Loader>
              </Dimmer>

              <Image
                src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png"
                size="massive"
              />
            </Segment>
          ) : (
            data &&
            data.getPosts.map((post) => (
              <Grid.Column width="8">
                <PostCard data={post} />
              </Grid.Column>
            ))
          )}
        </Grid.Row>
      </Grid>
    </div>
  );
}

const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      body
      createdAt
      username
      likeCount
      commentCount
    }
  }
`;
