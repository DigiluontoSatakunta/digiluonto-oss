import { gql } from "@apollo/client";

export const GROUP_HISTORY_LIST = gql`
  query GroupHistoryList($oids: [ID!]) {
    groups(where: { id_in: $oids }, sort: "name:asc") {
      id
      name
    }
  }
`;

export const GROUPBYID = gql`
  query GroupById($id: ID!) {
    group(id: $id) {
      id
      name
      welcome
      description
      textColor
      primaryColor
      secondaryColor
      showPublicContent
      homepageUrl
      homepageTitle
      showMascot
      numberOfJourneys
      numberOfPlaces
      latitude
      longitude
      cover {
        id
        url
        formats
      }
      desktopCover {
        id
        url
      }
      logo {
        id
        url
        formats
      }
      dataSources {
        id
        name
        slug
      }
      locale
      localizations {
        id
        locale
      }
      vessels {
        id
        name
        mmsi
      }
    }
  }
`;

export const GROUPLIST = gql`
  query GroupList {
    groups(sort: "name:ASC") {
      id
      name
    }
  }
`;
