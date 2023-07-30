const Redis = require("ioredis");

/*
Responsibilities: Retrieving data from Redis
*/
function getDataFromRedis(callback) {
  const redis = new Redis(
    "redis://default:6603de326e414020a35aee64c592604a@engaging-flamingo-37264.upstash.io:37264"
  );

  redis.get("BSC", function (error, result) {
    if (error) {
      console.log(error);
      throw error;
    } else {
      const jsonData = JSON.parse(result);
      const randomIndex = Math.floor(Math.random() * jsonData.length);
      const randomItem = jsonData[randomIndex];
      const randomRA = randomItem.RA;
      const randomDEC = randomItem.DEC;
      const randomTitle = randomItem["Title HD"];
      callback(randomRA, randomDEC, randomTitle);
    }
    redis.quit();
  });
}

module.exports = { getDataFromRedis };