import { Handler, APIGatewayProxyEventV2 } from 'aws-lambda';
import { Timing } from 'timings';
import { connect, getFromDomain } from 'email-send';

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
  const ses = await connect();

  timings.push({
    title: 'Connected to SES',
    measurement: `${(hrtime.bigint() - start) / BigInt(1000000)}`,
  });
  start = hrtime.bigint();

  const fromDomain = await getFromDomain();
  console.log(fromDomain);
  await ses
    .sendEmail({
      Destination: {
        ToAddresses: ['maxrohde.public' + '@gm' + 'ail.com'],
      },
      Message: {
        Body: {
          Text: {
            Data: 'Hello, world!',
          },
        },
        Subject: {
          Data: 'SES Cold start test',
        },
      },
      Source: `noreply@${fromDomain}`,
    })
    .promise();
  timings.push({
    title: 'Email sent call completed',
    measurement: `${(hrtime.bigint() - start) / BigInt(1000000)}`,
  });
  const res = {
    timings: timings,
  };
  start = BigInt(-1);
  return res;
};
