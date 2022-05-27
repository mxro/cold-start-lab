import { Handler, APIGatewayProxyEventV2 } from 'aws-lambda';

import { hrtime } from 'node:process';
import { Timing } from 'timings';

import { getBucketName, connect } from 's3';

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
  const s3 = await connect();

  timings.push({
    title: 'Connected to S3',
    measurement: `${(hrtime.bigint() - start) / BigInt(1000000)}`,
  });
  start = hrtime.bigint();

  try {
    const res = await s3
      .getObject({
        Bucket: await getBucketName(),
        Key: 'dummy-user',
      })
      .promise();
    if (!res.Body) {
      throw new Error('Cannot load body');
    }
    const data = JSON.parse(res.Body.toString());
    timings.push({
      title: 'Object retrieved from S3',
      measurement: `${(hrtime.bigint() - start) / BigInt(1000000)}`,
    });

    start = BigInt(-1);
    return {
      message: `Hello, ${data.name}!`,
      timings,
    };
  } catch (e) {
    await s3
      .putObject({
        Bucket: await getBucketName(),
        Key: 'dummy-user',
        Body: JSON.stringify({
          email: 'dummy-user@dummy.com',
          name: 'Dummy User',
        }),
      })
      .promise();
    timings.push({
      title: 'Object created on S3',
      measurement: `${(hrtime.bigint() - start) / BigInt(1000000)}`,
    });

    start = BigInt(-1);
    return {
      message: 'Created object, try again!',
      timings,
    };
  }
};
