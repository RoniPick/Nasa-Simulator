import json
import redis

r = redis.Redis(
  host= 'engaging-flamingo-37264.upstash.io',
  port= '37264',
  password= '6603de326e414020a35aee64c592604a'
)


# Read JSON file
with open('BSC.json', 'r') as file:
    json_data = json.load(file)

# Set data in Redis
r.set('data', json.dumps(json_data))

# Retrieve data from Redis
data_from_redis = json.loads(r.get('data'))

#Print the retrieved data
print(data_from_redis)