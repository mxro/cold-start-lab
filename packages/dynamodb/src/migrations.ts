import { InputMigrations } from 'umzug/lib/types';
import { DynamoDBContext } from '@goldstack/template-dynamodb';

import { marshall } from '@aws-sdk/util-dynamodb';

import { connectTable } from './table';
import { User, UserEntity } from './entities';

/**
 * Umzug migrations applied during connection see https://github.com/sequelize/umzug#migrations
 */
export const createMigrations = (): InputMigrations<DynamoDBContext> => {
  return [
    {
      name: 'create-dummy-user',
      up: async (context) => {
        const table = await connectTable({
          client: context.context.client,
        });
        const Users = UserEntity(table);
        await Users.put({
          pk: 'dummy-user@dummy.com',
          sk: 'Dummy User',
        });
      },
    },
  ];
};
