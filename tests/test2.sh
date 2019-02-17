
max=10
for i in `seq 2 $max`
do
   echo $i
    curl -X POST \
  https://7teikvy6sh.execute-api.us-east-1.amazonaws.com/dev/whoiam \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -H 'postman-token: 0e2a7694-e5fd-071e-660f-dc7f47044da4' \
  -d '{ "account": "0xE23B318A7956639646710A2Be01944b153ECC367" }'
done
