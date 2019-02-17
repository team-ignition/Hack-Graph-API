for i in {1..20}
do
  curl -X POST \
  https://7teikvy6sh.execute-api.us-east-1.amazonaws.com/dev/whoiam \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -H 'postman-token: 77b5ce00-d27d-4fb0-c57b-4464f8c470a1' \
  -d '{ "account": "0xE23B318A7956639646710A2Be01944b153ECC367" }'
done
