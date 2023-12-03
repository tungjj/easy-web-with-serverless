import { randomUUID } from "crypto";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import * as constant from "./constant.js";
import { STATUS_CODE, response } from "./responseMessage.js";

const handler = async (event) => {
  try {
    const client = new DynamoDBClient({ region: constant.REGION });
    const docClient = DynamoDBDocumentClient.from(client);

    const eventBody = JSON.parse(event.body);

    const realFoodType = eventBody.foodType
      ? eventBody.foodType
      : constant.FOOD_TYPE.defaultFood;
    const realFoodName =
      realFoodType == constant.FOOD_TYPE.defaultFood
        ? constant.FOOD_TYPE.defaultFood
        : eventBody.foodName;
    const realPrice =
      realFoodType == constant.FOOD_TYPE.defaultFood ? "35" : "0";

    const command = new PutCommand({
      TableName: constant.ORDERS_TABLE_NAME,
      Item: {
        id: `${randomUUID()}`,
        CustomerId: eventBody.customerId,
        Customer: eventBody.customer,
        CustomerEmail: eventBody.customerEmail,
        FoodType: realFoodType,
        FoodName: realFoodName,
        State: constant.ORDER_STATUS.NEW,
        OrderPrice: +realPrice,
        OrderTime: +(new Date().getTime() / 1000),
      },
    });

    const responseBody = await docClient.send(command);
    return response(STATUS_CODE.SUCCESS, null, JSON.stringify(responseBody));
  } catch (error) {
    return response(STATUS_CODE.BAD_REQUEST, null, JSON.stringify(error));
  }
};

export { handler };
