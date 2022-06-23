import {gql} from "@apollo/client";

export const UPLOAD_FILE_MUTATION = gql`
  mutation UPLOAD_FILE_MUTATION($file: Upload!) {
    upload(file: $file) {
      id
      name
      formats
      url
    }
  }
`;

export const DELETE_FILE_MUTATION = gql`
  mutation DELETE_FILE_MUTATION($input: deleteFileInput!) {
    deleteFile(input: $input) {
      file {
        id
      }
    }
  }
`;
