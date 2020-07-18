import DynamoDBWrapper from 'noodle-dynamo';

const AWS_REGION = 'us-east-2';

let dynamoDbClient = null;

function fetchDynamoClient(credentials) {
  if (dynamoDbClient === null) {
    dynamoDbClient = new DynamoDBWrapper(credentials, AWS_REGION);
  }

  return dynamoDbClient;
}

export default function readProjectData(credentials, projectName) {
  const dynamoClient = fetchDynamoClient(credentials);

  const expressionProjectName = projectName || '';

  const table = 'ProjectData';
  const expression = 'projectName = :projectName';
  const expressionData = {
    ':projectName': expressionProjectName,
  };

  return dynamoClient.readTable(table, expression, expressionData);
}
