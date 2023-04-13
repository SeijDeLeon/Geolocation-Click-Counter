/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createClickCount = /* GraphQL */ `
  mutation CreateClickCount(
    $input: CreateClickCountInput!
    $condition: ModelClickCountConditionInput
  ) {
    createClickCount(input: $input, condition: $condition) {
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
export const updateClickCount = /* GraphQL */ `
  mutation UpdateClickCount(
    $input: UpdateClickCountInput!
    $condition: ModelClickCountConditionInput
  ) {
    updateClickCount(input: $input, condition: $condition) {
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
export const deleteClickCount = /* GraphQL */ `
  mutation DeleteClickCount(
    $input: DeleteClickCountInput!
    $condition: ModelClickCountConditionInput
  ) {
    deleteClickCount(input: $input, condition: $condition) {
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
