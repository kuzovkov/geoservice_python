from cgi import parse_qs, escape
# importing pyspatialite
from pyspatialite import dbapi2 as db
import time

DB_DIR = '/home/user1/game1/db/'

def application(environ, start_response):
	status = '200 OK'	
	#start_run=time.clock()
	for key,val in environ.items():
		print '%s : %s' % (key,val)
	d = parse_qs(environ['QUERY_STRING'])
	data = d['data'][0].split(',')
	start_lat = float(data[0])
	start_lng = float(data[1])	
	end_lat = float(data[2])
	end_lng = float(data[3])
	db_file = data[4]
	#print 'db_file='+db_file
	route = getRoute((start_lat,start_lng),(end_lat,end_lng),db_file)
	#end_run=time.clock()
	#exec_run = 'Executing time: ' + str(end_run-start_run)
	response = ""	
	#response = response.join([output,'<br/>',exec_run,'<br/>'] + [str(route)])
	response = response.join([str(route)])	
	response_headers = [('Content-type', 'text/html'),('Access-Control-Allow-Origin','*'),('Content-Length',str(len(response)))]	
	start_response(status, response_headers)
	return [response]

def getRoute(start,end,db_file):
	# creating/connecting the db
	#print 'db_file='+db_file	
	conn = db.connect(DB_DIR + db_file)
	# creating a Cursor
	cur = conn.cursor()
	#sql = 'select node_id, MIN(Distance(geometry,MakePoint('+str(start[1])+','+str(start[0])+'))) as rast from roads_nodes'
	
	sql = 'select node_id, MIN(Pow(('+str(start[1])+'-X(geometry)),2) +Pow(('+str(start[0])+'-Y(geometry)),2)) as rast from roads_nodes'
	rs = cur.execute(sql)	
	for row in rs:
		id_start = row[0]

	sql = 'select node_id, MIN(Pow(('+str(end[1])+'-X(geometry)),2) +Pow(('+str(end[0])+'-Y(geometry)),2)) as rast from roads_nodes'
	rs = cur.execute(sql)	
	for row in rs:
		id_end = row[0]
	
	sql = 'SELECT AsGeoJSON(geometry) AS geometry FROM roads_net WHERE NodeFrom='+str(id_start)+' AND NodeTo='+str(id_end)+' LIMIT 1'
	rs = cur.execute(sql)	
	for row in rs:
		result = row[0]		
	return result
