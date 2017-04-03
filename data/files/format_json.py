import json
def format(file_name, label):
  f = open('../files/' + file_name, 'r')
  data = json.load(f)
  new_file = {'label' : label, 'data' : data}
  f.close()
  f = open(file_name, 'w')
  f.write(json.dumps(new_file))

format('motherjones.json', 'liberal')
format('nymag.json', 'liberal')
format('salon.json', 'liberal')
format('nypost.json', 'conservative')
format('townhall.json', 'conservative')
