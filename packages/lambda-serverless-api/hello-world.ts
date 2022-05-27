import { Handler, APIGatewayProxyEventV2 } from 'aws-lambda';

import { hrtime } from 'node:process';
import { Timing } from 'timings';

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
  start = BigInt(-1);
  return {
    message: 'Hello, world!',
    timings,
  };
};
