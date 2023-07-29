const { exec } = require("child_process");

/*
Responsibilities:
Executing a curl command to send events to Elasticsearch
*/
async function sendEventToElasticSearch(eventBody, context, offset, sequenceNumber) {
  try {
    const elasticSearchEndpoint =
      "https://r1x0rdsre0:anu5034q9c@events-data-1012553474.us-east-1.bonsaisearch.net:443/nasa/_doc";
    const curlCommand = `curl -X POST ${elasticSearchEndpoint} -H "Content-Type: application/json" -d '${JSON.stringify(
      eventBody
    )}'`;

    exec(curlCommand, (error, stdout, stderr) => {
      if (error) {
        console.error("Error sending event to Elasticsearch:", error);
        return;
      }
      console.log("Event sent to Elasticsearch");
      console.log("Response:", stdout);
      context.updateCheckpoint({ offset, sequenceNumber }).catch(console.error);
    });
  } catch (error) {
    console.log("Error sending event to Elasticsearch:", error);
  }
}

module.exports = { sendEventToElasticSearch };
