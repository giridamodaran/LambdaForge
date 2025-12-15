import { Snippet, CodeLanguage } from '../types';

const snippets: Snippet[] = [
  // Node.js Snippets
  {
    id: 'node-s3-get',
    title: 'S3 Get Object',
    description: 'Retrieve an object from S3 using AWS SDK v3',
    language: 'nodejs',
    code: `import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
const s3 = new S3Client({});

// In your handler:
const command = new GetObjectCommand({
  Bucket: "my-bucket",
  Key: "my-key"
});
const response = await s3.send(command);
const str = await response.Body.transformToString();`
  },
  {
    id: 'node-dynamo-put',
    title: 'DynamoDB Put Item',
    description: 'Insert an item into DynamoDB',
    language: 'nodejs',
    code: `import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// In your handler:
await docClient.send(new PutCommand({
  TableName: "MyTable",
  Item: { pk: "123", data: "value" }
}));`
  },
  
  // Python Snippets
  {
    id: 'py-s3-get',
    title: 'S3 Get Object',
    description: 'Retrieve an object from S3 using Boto3',
    language: 'python',
    code: `import boto3

s3 = boto3.client('s3')

# In your handler:
response = s3.get_object(Bucket='my-bucket', Key='my-key')
content = response['Body'].read().decode('utf-8')`
  },
  {
    id: 'py-dynamo-put',
    title: 'DynamoDB Put Item',
    description: 'Insert an item into DynamoDB',
    language: 'python',
    code: `import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('MyTable')

# In your handler:
table.put_item(
    Item={
        'pk': '123',
        'data': 'value'
    }
)`
  },

  // Java Snippets
  {
    id: 'java-s3-get',
    title: 'S3 Get Object',
    description: 'Retrieve an object using AWS SDK for Java v2',
    language: 'java',
    code: `import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.core.sync.ResponseTransformer;

// Initialize client (can be done statically or in constructor)
S3Client s3 = S3Client.create();

// In your handler:
String content = s3.getObject(
    GetObjectRequest.builder().bucket("my-bucket").key("my-key").build(),
    ResponseTransformer.toUtf8String()
);`
  }
];

export const snippetService = {
  getSnippets: (language: CodeLanguage): Snippet[] => {
    return snippets.filter(s => s.language === language || s.language === 'all');
  },
  
  searchSnippets: (query: string, language: CodeLanguage): Snippet[] => {
    const lowerQuery = query.toLowerCase();
    return snippets.filter(s => 
      (s.language === language || s.language === 'all') &&
      (s.title.toLowerCase().includes(lowerQuery) || s.description.toLowerCase().includes(lowerQuery))
    );
  }
};
