import { Table, Entity } from 'dynamodb-toolbox';
import DynamoDB from 'aws-sdk/clients/dynamodb';

export type User = {
  pk: string;
  sk: string;
};

export type UserKey = {
  pk: string;
  sk: string;
};

export function createTable<Name extends string>(
  dynamoDB: DynamoDB.DocumentClient,
  tableName: string
): Table<Name, 'pk', 'sk'> {
  return new Table({
    name: tableName,
    partitionKey: 'pk',
    sortKey: 'sk',
    DocumentClient: dynamoDB,
  });
}

export function UserEntity<Name extends string>(
  table: Table<Name, 'pk', 'sk'>
): Entity<User, UserKey, typeof table> {
  const e = new Entity<User, UserKey, typeof table>({
    name: 'User',
    attributes: {
      pk: { partitionKey: true },
      sk: { sortKey: true },
    },
    table,
  } as const);

  return e;
}
