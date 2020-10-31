import React from "react";
import { Card, Image, Button, Icon, Label } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";
export default function PostCard({
  post: { body, createdAt, id, username, likeCount, commentCount, likes },
}) {
  const likePost = () => {
    console.log("like post");
  };
  function commentOnPost() {
    console.log("comment on Post");
  }
  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/molly.png"
        />
        <Card.Header>{username}</Card.Header>
        {/* fromNow will make it like for 1 our ago for example , true to remove "go" */}
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow(true)}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button as="div" labelPosition="right" onClick={likePost}>
          <Button color="teal" basic>
            <Icon name="heart" />
          </Button>
          <Label basic color="teal" pointing="left">
            {likeCount}
          </Label>
        </Button>
        <Button as="div" labelPosition="right" onClick={commentOnPost}>
          <Button color="blue" basic>
            <Icon name="comments" />
          </Button>
          <Label basic color="blue" pointing="left">
            {commentCount}
          </Label>
        </Button>
      </Card.Content>
    </Card>
  );
}
