max=30
for i in `seq 2 $max`
do
    echo $i "\n"
    wget --quiet \
  --method POST \
  --header 'content-type: application/json' \
  --header 'cache-control: no-cache' \
  --header 'postman-token: 97ff69bc-5477-aef8-fe34-d3586786344f' \
  --body-data '{ "account": "0xE23B318A7956639646710A2Be01944b153ECC367" }' \
  --output-document \
  - https://7teikvy6sh.execute-api.us-east-1.amazonaws.com/dev/whoiam
done
