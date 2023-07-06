//node js serve

const { exec } = require('child_process');
const express = require('express');
const pf = require('fs');
if (!pf.existsSync('./images')) {
  const pythonfile = exec('python -u sun_information.py');
}
const app = express();
const port = 3000;
const path = require('path');
const { error } = require('console');
const fs = require('fs'); // for reading json files
const Redis = require('ioredis');
const cli = require('nodemon/lib/cli');

/*
If the frontend and backend servers are running on different ports or domains,
 you might need to enable CORS headers in the backend server to allow cross-origin requests from the frontend.
*/
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Define a route
app.get('/', (req, res) => {
  //res.send('Hello, World!');
  // res.sendFile(path.join(__dirname, 'public', 'index.html'));

});

//Get last 5 events
//http://localhost:3000/data-5events
app.get('/data-5events', (req, res) => {
  const elasticSearchEndpoint = 'https://r1x0rdsre0:anu5034q9c@events-data-1012553474.us-east-1.bonsaisearch.net:443/nasa*/_search';

  const curlCommand = `curl -X GET ${elasticSearchEndpoint} -d '{
    "from": 0,
    "size": 5,
    "sort": {"utc": "desc"},
    "query": {"match_all": {}}
  }' -H "Content-Type: application/json"`;

  exec(curlCommand, (error, stdout, stderr) => {
    if (error) {
      console.error("Error sending event to Elasticsearch:", error);
      return res.status(500).send("Error retrieving data from Elasticsearch");
    }
  
    try {
      const data = JSON.parse(stdout);
      console.log("Retrieved data from Elasticsearch:", data);

      res.json(data.hits.hits.map(hit => hit._source));
    } catch (e) {
      console.error("Error parsing data from Elasticsearch:", e);
      res.status(500).send("Error parsing data from Elasticsearch");
    }
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

http://localhost:3000/data-brightsTAR?start_date=6/27/23&end_date=6/28/23&bright_star=K5III
app.get('/data-brightStar', (req, res) => {
  const elasticSearchEndpoint = 'https://r1x0rdsre0:anu5034q9c@events-data-1012553474.us-east-1.bonsaisearch.net:443/nasa*/_search';
  let { start_date, end_date, bright_star } = req.query
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
                    "Title": "${bright_star}"
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

app.get('/redis', (req, res) => {
  const client = new Redis("redis://default:6603de326e414020a35aee64c592604a@engaging-flamingo-37264.upstash.io:37264");
  // upload BSC.json to Upstash
  const jsonData = fs.readFileSync('./redis/BSC.json', 'utf-8');
  client.set('BSC', jsonData, (error, result) => {
    if (error) {
      console.log(error);
    } else {
      console.log('BSC.json uploaded to Upstash');
    }
  });
  //get BSC.json from Upstash
  const data = client.get('BSC');
  console.log('BSC.json downloaded from Upstash');

  client.quit();
  res.end("Uploading and downloading BSC.json from Upstash");

});
// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});