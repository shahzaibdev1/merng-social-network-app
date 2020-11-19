import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  Card,
  Divider,
  Grid,
  Icon,
  Image,
  Label,
} from "semantic-ui-react";
import Moment from "react-moment";
import { Link } from "react-router-dom";

function PostCard(props) {
  let { username, createdAt, body, id, likeCount, commentCount } = props.data;
  return (
    <Card centered fluid>
      <Card.Content>
        <Image
          avatar
          floated="right"
          src="https://react.semantic-ui.com/images/avatar/large/molly.png"
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          <Moment format="MM:HH DD/MM/YYYY">{createdAt}</Moment>
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button as="div" labelPosition="right">
          <Button color="blue" basic>
            <Icon name="heart" />
            Like
          </Button>
          <Label as="a" basic color="blue" pointing="left">
            {likeCount}
          </Label>
        </Button>

        <Button as="div" labelPosition="right">
          <Button color="teal" basic>
            <Icon name="chat" />
            Comment
          </Button>
          <Label as="a" basic color="teal" pointing="left">
            {commentCount}
          </Label>
        </Button>

        <Divider hidden />
        <Button inverted color="red">
          Delete
        </Button>
      </Card.Content>
    </Card>
  );
}

PostCard.propTypes = {
  data: PropTypes.object.isRequired,
};

export default PostCard;
