/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getClickCount = /* GraphQL */ `
  query GetClickCount($id: ID!) {
    getClickCount(id: $id) {
      id
      count
      description
      lat
      lon
      createdAt
      updatedAt
    }
  }
`;
export const listClickCounts = /* GraphQL */ `
  query ListClickCounts(
    $filter: ModelClickCountFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listClickCounts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        count
        description
        lat
        lon
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
