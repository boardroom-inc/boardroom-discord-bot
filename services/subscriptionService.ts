import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import { v4 as uuid } from 'uuid';
import { ISubscription } from '../models';

class SubscriptionService {
  public tableName: string;
  public docClient: DynamoDB.DocumentClient;

  constructor(tableName: string = 'subscriptions') {
    this.tableName = tableName;
    this.docClient = new DynamoDB.DocumentClient();
  }

  async list() {
    let subscriptions: ISubscription[] = [];
    const TableName = this.tableName;

    let ExclusiveStartKey: DynamoDB.DocumentClient.Key | undefined;
    while (true) {
      const result = await this.docClient.scan({ TableName, ExclusiveStartKey }).promise();
      const items = ((result.Items || [])).map(item => {
        item.lastCheck = item.lastCheck ? new Date(item.lastCheck) : null;
        return item;
      });

      subscriptions = subscriptions.concat(items as ISubscription[]);

      if (! result.LastEvaluatedKey) {
        break;
      }

      ExclusiveStartKey = result.LastEvaluatedKey;
    }

    return subscriptions;
  }

  async create(subscription: Partial<ISubscription>) {
    const id = uuid();
    const lastCheck = subscription.lastCheck ? subscription.lastCheck.toISOString() : null;
    const Item = { id, ...subscription, lastCheck };
    const TableName = this.tableName;

    await this.docClient.put({ TableName, Item }).promise();
    return { ...subscription, id } as ISubscription;
  }

  async update(Item: ISubscription) {
    const TableName = this.tableName;
    const Key = { id: Item.id };

    const ExpressionAttributeNames: { [key: string]: any } = {};
    const ExpressionAttributeValues: { [key: string]: any } = {};
    const ReturnValues = 'ALL_NEW';

    let UpdateExpression = 'SET ';
    Object.entries(Item).forEach(([key, value], index, array) => {
      if (key === 'id') {
        return;
      }

      UpdateExpression += `#${key} = :${key}`;
      ExpressionAttributeNames[`#${key}`] = key;
      if (value instanceof Date) {
        ExpressionAttributeValues[`:${key}`] = value.toISOString();
      } else {
        ExpressionAttributeValues[`:${key}`] = value;
      }

      if (index !== array.length - 1) {
        UpdateExpression += ', ';
      }
    });

    const result = await this.docClient.update({
      TableName,
      Key,
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      ReturnValues
    }).promise();

    return result.Attributes as ISubscription;
  }

  async delete(id: string) {
    const TableName = this.tableName;
    const Key = { id };
    await this.docClient.delete({ TableName, Key }).promise();
  }
}

export default SubscriptionService;
