import { DynamoDBClient, CreateTableCommand } from "@aws-sdk/client-dynamodb";
import { STATUS_CODE, response } from "./responseMessage";
// import constant from "./constant";

const handler = async (event) => {
  try {
    const client = new DynamoDBClient({ region: "ap-southeast-1" });
    const eventBody = JSON.parse(event.body);

    var paramTotalTable = {
      TableName: eventBody.tableName,
      KeySchema: [{ AttributeName: "CustomerId", KeyType: "HASH" }],
      AttributeDefinitions: [
        { AttributeName: "CustomerId", AttributeType: "S" },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    };
    const command = new CreateTableCommand(paramTotalTable);
    const responseBody = await client.send(command);

    return response(STATUS_CODE.SUCCESS, null, JSON.stringify(responseBody));
  } catch (error) {
    return response(STATUS_CODE.BAD_REQUEST, null, JSON.stringify(error));
  }
};
export { handler };
