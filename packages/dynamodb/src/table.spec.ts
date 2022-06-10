import assert from 'assert';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import { Entity, Table } from 'dynamodb-toolbox';
import { User, UserEntity, UserKey } from './entities';
import {
  getTableName,
  connect,
  stopLocalDynamoDB,
  connectTable,
} from './table';

// needs to be long to download Docker image etc.
jest.setTimeout(60000);

describe('DynamoDB Table', () => {
  it('Should connect to local table', async () => {
    const tableName = await getTableName();
    assert(tableName);
    const dynamoDB = await connect();
    assert(dynamoDB);
    const tableInfo = await dynamoDB
      .describeTable({ TableName: tableName })
      .promise();

    assert(tableInfo.Table?.TableStatus === 'ACTIVE');
    const dynamoDB2 = await connect();
    assert(dynamoDB2);
  });

  it('Should be able to instantiate Toolbox table', async () => {
    const dynamoDB = await connect();
    const table1 = await connectTable({ client: dynamoDB });
    assert(table1);
    const table2 = await connectTable({
      documentClient: new DynamoDB.DocumentClient({ service: dynamoDB }),
    });
    assert(table2);
    const table3 = await connectTable();
    assert(table3);
  });

  afterAll(async () => {
    await stopLocalDynamoDB();
  });
});
