import * as constant from "./constant.js";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  DeleteCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import { STATUS_CODE, response } from "./responseMessage.js";

const handler = async (event) => {
  try {
    const client = new DynamoDBClient({ region: constant.REGION });
    const docClient = DynamoDBDocumentClient.from(client);

    const eventBody = JSON.parse(event.body);

    const getCommand = new GetCommand({
      TableName: constant.ORDERS_TABLE_NAME,
      Key: {
        id: eventBody.id,
        CustomerId: eventBody.customerId,
      },
    });
    const item = await docClient.send(getCommand);

    if (!item.Item) {
      return response(STATUS_CODE.NOT_FOUND);
    }
    if (!item.Item && eventBody.customerId != item.Item.CustomerId) {
      return response(STATUS_CODE.FORBIDDEN);
    }

    const command = new DeleteCommand({
      TableName: constant.ORDERS_TABLE_NAME,
      Key: {
        id: eventBody.id,
        CustomerId: eventBody.customerId,
      },
    });

    const responseBody = await docClient.send(command);
    return response(STATUS_CODE.SUCCESS, null, JSON.stringify(responseBody));
  } catch (error) {
    return response(STATUS_CODE.BAD_REQUEST, null, JSON.stringify(error));
  }
};
export { handler };
