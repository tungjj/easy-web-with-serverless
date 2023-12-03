import * as constant from "./constant.js";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { STATUS_CODE, response } from "./responseMessage.js";

export const handler = async (event) => {
  try {
    const client = new DynamoDBClient({ region: constant.REGION });
    const docClient = DynamoDBDocumentClient.from(client);

    const eventBody = JSON.parse(event.body);

    const updateCommand = new UpdateCommand({
      TableName: constant.ORDERS_TABLE_NAME,
      Key: {
        id: eventBody.id,
        CustomerId: eventBody.customerId,
      },
      UpdateExpression:
        "set #foodType = :newFoodType, #foodName = :newFoodName, #orderPrice = :newPrice ",

      ExpressionAttributeValues: {
        ":newFoodType": eventBody.foodType,
        ":newFoodName": eventBody.foodName,
        ":newPrice": eventBody.orderPrice,
      },
      ExpressionAttributeNames: {
        "#foodType": "FoodType",
        "#foodName": "FoodName",
        "#orderPrice": "OrderPrice",
      },
      ReturnValues: "ALL_NEW",
    });

    const responseBody = await docClient.send(updateCommand);

    return response(STATUS_CODE.SUCCESS, null, JSON.stringify(responseBody));
  } catch (error) {
    return response(STATUS_CODE.BAD_REQUEST, null, JSON.stringify(error));
  }
};
