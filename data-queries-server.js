//node js serve

const { exec } = require('child_process');
const express = require('express');
const app = express();
const port = 3000;

// Define a route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

//Get last 5 events
//http://localhost:3000/data-5events
app.get('/data-5events', (req, res) => {
    const elasticSearchEndpoint = 'https://r1x0rdsre0:anu5034q9c@events-data-1012553474.us-east-1.bonsaisearch.net:443/nasa*/_search';

    const curlCommand = `curl -X GET ${elasticSearchEndpoint} -d '{
        "from":0,"size":5,
        "sort":{"utc":"desc"},
        "query": {
          "match_all": {}
        }
      }' -H "Content-Type: application/json" | jq '.hits.hits[]._source'`;
    exec(curlCommand, (error, stdout, stderr) => {
        if (error) {
            console.error("Error sending event to ElasticSearch:", error);
            return;
        }
        console.log("Get data from ElasticSearch");
        console.log(stdout.toString());
        res.end(stdout.toString());

        //res.end("Response: " + stdout.toString());
    });
});

//Get events by informing factor and date range
//http://localhost:3000/data-informingFactors?start_date=6/27/23&end_date=6/28/23&informingFactor=Large Binocular Telescope
app.get('/data-informingFactors', (req, res) => {
    const elasticSearchEndpoint = 'https://r1x0rdsre0:anu5034q9c@events-data-1012553474.us-east-1.bonsaisearch.net:443/nasa*/_search';
    let { start_date, end_date, informingFactor } = req.query
    const curlCommand = `curl -X GET ${elasticSearchEndpoint} -d '{
        "query": {
            "bool": {
              "must": [],
              "filter": [
                {
                  "match_all": {}
                },
                {
                  "match_phrase": {
                    "informingFactor": "${informingFactor}"
                  }
                },
                {
                  "range": {
                    "utc": {
                      "gte": "${new Date(start_date).toISOString()}",
                      "lte": "${new Date(end_date).toISOString()}",
                      "format": "strict_date_optional_time"
                    }
                  }
                }
              ],
              "should": [],
              "must_not": []
            }
          }
      }' -H "Content-Type: application/json" | jq '.hits.hits[]._source'`;
    exec(curlCommand, (error, stdout, stderr) => {
        if (error) {
            console.error("Error sending event to ElasticSearch:", error);
            return;
        }
        console.log("Get data from ElasticSearch");
        res.end(stdout.toString());

        //res.end("Response: " + stdout.toString(),40);
    });
});

//Get events by date range
//http://localhost:3000/data-times?start_date=6/27/23&end_date=6/28/23
app.get('/data-times', (req, res) => {
    const elasticSearchEndpoint = 'https://r1x0rdsre0:anu5034q9c@events-data-1012553474.us-east-1.bonsaisearch.net:443/nasa*/_search';
    let { start_date, end_date } = req.query
    const curlCommand = `curl -X GET ${elasticSearchEndpoint} -d '{
        "query": {
            "bool": {
              "must": [],
              "filter": [
                {
                  "match_all": {}
                },
                {
                  "exists": {
                    "field": "utc"
                  }
                  },
                {
                  "range": {
                    "utc": {
                      "gte": "${new Date(start_date).toISOString()}",
                      "lte": "${new Date(end_date).toISOString()}",
                      "format": "strict_date_optional_time"
                    }
                  }
                }
              ],
              "should": [],
              "must_not": []
            }
          }
      }' -H "Content-Type: application/json" | jq '.hits.hits[]._source'`;
    exec(curlCommand, (error, stdout, stderr) => {
        if (error) {
            console.error("Error sending event to ElasticSearch:", error);
            return;
        }
        console.log("Get data from ElasticSearch");
        res.end(stdout.toString());

        //res.end("Response: " + stdout.toString(),40);
    });
});
// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});