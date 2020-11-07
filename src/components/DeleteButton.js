import React, { useState } from "react";

import { useMutation } from "@apollo/react-hooks";
import { Button, Icon, Confirm } from "semantic-ui-react";
import gql from "graphql-tag";

import { FETCH_POSTS_QUERY } from "../utils/graphql";
import MyPopup from "../utils/MyPopup";
// in order to use this component either in deleting a post or deleting a component, we are goindg to make the mutation dynamic
function DeleteButton({ postId, commentId, callback }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;
  const [deletePostOrMutation] = useMutation(mutation, {
    variables: {
      postId,
      commentId,
    },
    update(proxy) {
      console.log("deleted succes");
      setConfirmOpen(false);
      if (!commentId) {
        const data = proxy.readQuery({ query: FETCH_POSTS_QUERY });
        data.getPosts = data.getPosts.filter((p) => p.id !== postId);
        proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
      } else {
        const data = proxy.readQuery({ query: FETCH_POSTS_QUERY });

        proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
      }
      if (callback) callback();
    },
    onError(err) {
      setConfirmOpen(false);
      console.log(err);
    },
  });
  return (
    <>
      <MyPopup content={commentId ? "Delete Comment" : "Delete Post"}>
        <Button
          as="div"
          color="red"
          floated="right"
          onClick={() => setConfirmOpen(true)}
        >
          <Icon name="trash" style={{ margin: 0 }} />
        </Button>
      </MyPopup>

      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrMutation}
      />
    </>
  );
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;
const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;
export default DeleteButton;
