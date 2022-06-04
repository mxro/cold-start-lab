import { Handler, APIGatewayProxyEventV2 } from 'aws-lambda';
import { Timing } from 'timings';
import { connectTable, UserEntity } from 'dynamodb';

import { hrtime } from 'node:process';

type ProxyHandler = Handler<APIGatewayProxyEventV2, any>;

let start = hrtime.bigint();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handler: ProxyHandler = async (event, context) => {
  const timings: Timing[] = [];
  if (start !== BigInt(-1)) {
    timings.push({
      title: 'Cold start',
      measurement: `${(hrtime.bigint() - start) / BigInt(1000000)}`,
    });
  } else {
    timings.push({
      title: 'Cold start (not required)',
      measurement: '0',
    });
  }
  start = hrtime.bigint();
  const table = await connectTable();

  timings.push({
    title: 'Connected to DynamoDB',
    measurement: `${(hrtime.bigint() - start) / BigInt(1000000)}`,
  });
  start = hrtime.bigint();
  const Users = UserEntity(table);

  const { Item: user } = await Users.get({
    email: 'dummy-user@dummy.com',
    registered: 'true',
  });

  timings.push({
    title: 'Retrieved item from DynamoDB',
    measurement: `${(hrtime.bigint() - start) / BigInt(1000000)}`,
  });
  const res = {
    message: `Hello, ${user.name}!`,
    timings: timings,
  };
  start = BigInt(-1);
  return res;
};
