import { InputMigrations } from 'umzug/lib/types';
import { DynamoDBContext } from '@goldstack/template-dynamodb';

import { marshall } from '@aws-sdk/util-dynamodb';
import { connectTable, UserEntity } from './table';
import DynamoDB from 'aws-sdk/clients/dynamodb';

/**
 * Umzug migrations applied during connection see https://github.com/sequelize/umzug#migrations
 */
export const createMigrations = (): InputMigrations<DynamoDBContext> => {
  return [
    {
      name: '00-dummy-migration',
      async up({ context }) {
        await context.client
          .putItem({
            TableName: context.tableName,
            Item: marshall({
              pk: '#DUMMY',
              sk: 'hello-world',
            }),
          })
          .promise();
      },
      async down({ context }) {
        await context.client
          .deleteItem({
            TableName: context.tableName,
            Key: marshall({
              pk: '#DUMMY',
              sk: 'hello-world',
            }),
          })
          .promise();
      },
    },
    {
      name: '01-hello-world-migration',
      async up({ context }) {
        const table = await connectTable({
          client: context.client,
        });
        const Users = UserEntity(table);
        await Users.put({
          email: 'dummy-user@dummy.com',
          name: 'Dummy User',
          registered: 'true',
        });
      },
      async down({ context }) {
        const table = await connectTable({
          documentClient: new DynamoDB.DocumentClient({
            service: context.client,
          }),
        });
        const Users = UserEntity(table);
        await Users.delete({
          email: 'dummy-user@dummy.com',
          registered: 'true',
        });
      },
    },
  ];
};
