/* Filters for Talking Street */
/* Depends on jQuery and underscoreJS */

/*
*	City : Major city
*	Location : Sub area within a city
* 	Cuisine : The kind of food to search for.
*/


/*
* Retrieval of values
* List of cities : Object.keys(cityMap["NULL"]) 
* List of locations of a particular city : Object.keys(cityMap["Bangalore"])
* List of outlet IDs of a particular location(Koramangala) in a particular city(Bangalore) : cityMap["Bangalore"]["Koramangala"]["outlet"]
* List of cuisine avaiable in a particular location (Koramangala) in a particular city (Bangalore) : cityMap["Bangalore"]["Koramangala"]["cuisine"]
* List of cuisines : Object.keys(cuisineMap) 
* 
*/

/*
*
*	cityMap = 	{"Bangalore" = 	[									
										"Koromangala" : 		{
																	"outlet" : 	[	OutletIds		],
																	"cuisine": 	[	cuisineNames	]
																},
										"Old Airport Road" : 	{
																	"outlet" : 	[	OutletIds		],
																	"cuisine": 	[	cuisineNames	]
																}
									
								],
				}
*
*/



/*
* Globals
*/
var cityMap = {};
/*
*	cityMap['Bangalore'] = {'Koromangala':[], 'Indiranagar':[]}
*/

var cuisineMap = {};
var totalMap = {};

init = function(response){

				$.each(response, function(index, result){
					// For each location, get the parent of the location.
					var parent = result.parent;
					var name = result.name;
					// If parent city not present in cityMap key list, add it and initialise value as object
					if(!cityMap.hasOwnProperty(parent)){
						cityMap[parent]=[];
					}
					// Insert the location and initialise to empty list
					cityMap[parent][name]={outlet:[], cuisine:[], blog:[]};
				});

}

fillMaps = function(data){
	$.each(data, function(index, result){
		// Sometimes cuisine is listed as a string separated by commas.
		console.log(result);
		$.each(result.cuisine.split(","), function(index, cuisines){
			$.each(cuisines.split("/"), function(index, cuisine){
					cuisine = cuisine.trim();
					if(cuisine){
						if(cuisineMap.hasOwnProperty(cuisine)){
							cuisineMap[cuisine].push(result.ID);
						}
						else{
							cuisineMap[cuisine] = [result.ID];
						}
						if(result.parent && result.location){
							if(result.best_for)
								if(cityMap[result.parent][result.location]["cuisine"].indexOf(cuisine) == -1)
									cityMap[result.parent][result.location]["cuisine"].push(cuisine);
						}
					}
			});			
		});

		// Save the outlet info in the object
		totalMap[result.ID]=result;
		
		if(result.parent){
				if(result.location){
					if(result.best_for)
						cityMap[result.parent][result.location]["outlet"].push(result.ID);
					else
						cityMap[result.parent][result.location]["blog"].push(result.ID);
					}
				}


	});
}


search = function(city, location, cuisine){
	console.log("Search query for "+city+","+location+","+cuisine);
	result = {}
	if(!city)
		return false;
	if(location){
			result["location"] = location;
		if(cuisine){
			result["outlet"] = _.intersection(cityMap[city][location]["outlet"],cuisineMap[cuisine]);
			result["blog"] = _.intersection(cityMap[city][location]["blog"],cuisineMap[cuisine]);
			result["cuisine"] = cuisine;
		}
		else{
			result["cuisine"] = cityMap[city][location]["cuisine"];
			result["outlet"] = cityMap[city][location]["outlet"];
			result["blog"] = cityMap[city][location]["blog"];
		}
	}
	else if(cuisine){
		locations = []
		outlets = []
		blogs = []
		$.each(Object.keys(cityMap[city]), function(key, index){
			if(cityMap[city][index]["cuisine"].indexOf(cuisine) != -1){
				locations.push(index);
				outlets = _.union(_.intersection(cityMap[city][index]["outlet"], cuisineMap[cuisine]), outlets);
				blogs =  _.union(_.intersection(cityMap[city][index]["blog"], cuisineMap[cuisine]), blogs);
			}
		});
		result["location"] = locations;
		result["outlet"] = outlets;
		result["cuisine"] = cuisine;
		result["blog"] = blogs;
	}
	else{
		outlets = []
		cuisine = []
		result["location"] = Object.keys(cityMap[city]);
		$.each(result["location"], function(key, index){
			outlets = _.union(cityMap[city][index]["outlet"],outlets);
			cuisine = _.union(cityMap[city][index]["cuisine"],cuisine);
			blogs = _.union(cityMap[city][index]["blogs"],blogs);
		});
		result["outlet"] = outlets;
		result["cuisine"] = cuisine;
		result["blog"] = blogs;	
	}
	return (result);
}