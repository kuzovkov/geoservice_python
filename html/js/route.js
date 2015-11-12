/**модуль получения маршрутов**/
var Route =
{
	/** используемый сервис маршрутов, допустимые значения
	* 'spatialite_python', 'spatialite_nodejs'
	**/
	service: 'spatialite_python', 
	
	/**функция получения маршрутов
    * @param start, end начальная и конечная точки в виде {lat:lat, lng:lng}
	* @param enemies объекты описывающие юнитов противника в виде [{lat:lat, lng:lng, radius:radius}, ...]
    * @param callback функция обратного вызова в которую передается результат
    **/
    getRoute: function(start,end,enemies,callback){   
		if(Route.service == 'spatialite_php' ){
			Route.getRouteSpatialitePHP(start,end,callback);
		}else if(Route.service == 'spatialite_python' ){
			Route.getRouteSpatialitePython(start,end,callback);
		}else if ( Route.service == 'spatialite_nodejs' ){
            Route.getRouteSpatialiteNodeJs(start,end,callback);
        }else{
			callback([]);
		}
	},
	
    /**
    * получение маршрута от сервиса на PHP
    * @param start, end начальная и конечная точки в виде {lat:lat, lng:lng}
    * @param callback функция обратного вызова в которую передается результат
    **/
    
    getRouteSpatialitePHP: function(start,end,callback){
		var db_file = selectRegion.value;
		var params = 'data=' + [start.lat,start.lng,end.lat,end.lng,db_file,scale].join(',');
		//console.log(params);
		Ajax.sendRequest('GET', 'http://php_spa.loc/srv2.php', params, function(res) {
			//console.log(res.coordinates);
            callback(Route.reverse(res.coordinates));
		});
	},
	
    /**
    * получение маршрута от сервиса на Python
    * @param start, end начальная и конечная точки в виде {lat:lat, lng:lng}
    * @param callback функция обратного вызова в которую передается результат
    **/
    
    getRouteSpatialitePython: function(start,end,callback){
		var db_file = selectRegion.value;
		var bounds = map.getBounds();
		var params = 'data=' + [start.lat,start.lng,end.lat,end.lng,db_file, scale].join(',');
								//bounds['_southWest'].lat,bounds['_southWest'].lng,
								//bounds['_northEast'].lat,bounds['_northEast'].lng].join(',');
		//console.log(params);
		Ajax.sendRequest('GET', 'http://py_spa.loc/route', params, function(res) {
			//console.log(res.coordinates);
            callback(Route.reverse(res.coordinates));
		});
	},
		
	/**
    * получение маршрута от сервиса на NodeJs
    * @param start, end начальная и конечная точки в виде {lat:lat, lng:lng}
    * @param callback функция обратного вызова в которую передается результат
    **/
    
    getRouteSpatialiteNodeJs: function(start,end,callback){
		var db_file = selectRegion.value;
		var bounds = map.getBounds();
		var params = 'data=' + [start.lat,start.lng,end.lat,end.lng,db_file, scale].join(',');
								//bounds['_southWest'].lat,bounds['_southWest'].lng,
								//bounds['_northEast'].lat,bounds['_northEast'].lng].join(',');
		console.log(params);
		Ajax.sendRequest('GET', 'http://127.0.0.1:8000/route', params, function(route) {
			console.log(route);
            callback(Route.reverse(route));
		});
	},
    
   

	
	/**
    * получение маршрута от сервиса на PHP
    * @param start, end начальная и конечная точки в виде {lat:lat, lng:lng, radius:radius}
    * @param callback функция обратного вызова в которую передается результат
    **/
    
    getNearest: function(start, callback){
		var db_file = selectRegion.value;
		var params = 'data=' + [start.lat,start.lng,db_file,scale].join(',')
		//console.log(params);
		if (Route.service == 'spatialite_python'){
			var url = 'http://py_spa.loc/nearest';
		}else if( Route.service == 'spatialite_nodejs'){
			var url = 'http://127.0.0.1:8000/nearest';
		}
		
		
		Ajax.sendRequest('GET', url, params, function(result) {
			//console.log(JSON.stringify(result));
            callback(result);
		});
	},
	
	/**
	* обмен местами широты о долготы в массиве точек маршрута
	**/
	reverse: function(route){
	    var reverse_route = [];
	    for (var i = 0; i < route.length; i++){
		var dot = [route[i][1], route[i][0]];
		reverse_route.push(dot);
	    }
	    return reverse_route;
	}
    
}