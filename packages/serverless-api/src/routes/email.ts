import { Handler, APIGatewayProxyEventV2 } from 'aws-lambda';

import { hrtime } from 'node:process';
import { Timing } from 'timings';

import { connect, getFromDomain } from 'email-send';

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
  await ses
    .sendEmail({
      Source: `noreply@${await getFromDomain()}`,
      Destination: {
        ToAddresses: ['maxrohde.public@gmail.com'],
      },
      Message: {
        Subject: {
          Data: 'Hello from Cold Start Lab',
        },
        Body: {
          Text: {
            Data: "This is a test email from the 'Cold Start Lab'",
          },
        },
      },
    })
    .promise();

  timings.push({
    title: 'Email sent via SES',
    measurement: `${(hrtime.bigint() - start) / BigInt(1000000)}`,
  });

  start = BigInt(-1);
  return {
    message: 'Email sent!',
    timings,
  };
};
