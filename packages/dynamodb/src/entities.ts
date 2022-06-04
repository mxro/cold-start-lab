import { Table, Entity } from 'dynamodb-toolbox';
import DynamoDB from 'aws-sdk/clients/dynamodb';

export type User = {
  email: string;
  name: string;
  registered: string;
};

export type UserKey = {
  email: string;
  registered: string;
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
      email: {
        partitionKey: true,
      },
      registered: {
        sortKey: true,
      },
      name: 'string',
    },
    table,
  } as const);

  return e;
}
