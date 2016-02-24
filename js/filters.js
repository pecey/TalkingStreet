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

// These maintain whether a blog or outlet has been shown already
var blogsToShow = {};
var outletsToShow = {};

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
		blogs = []
		result["location"] = Object.keys(cityMap[city]);
		$.each(result["location"], function(key, index){
			outlets = _.union(cityMap[city][index]["outlet"],outlets);
			cuisine = _.union(cityMap[city][index]["cuisine"],cuisine);
			blogs = _.union(cityMap[city][index]["blog"],blogs);
		});
		result["outlet"] = outlets;
		result["cuisine"] = cuisine;
		result["blog"] = blogs;	
	}
	// Return sorted lists
	result["location"] = _.sortBy(result["location"]);
	result["cuisine"] = _.sortBy(result["cuisine"]);
	result["outlet"] = result["outlet"].sort(function(a,b){return a-b});
	result["blog"] = result["blog"].sort(function(a,b){return a-b});
	return (result);
}


populateFilters = function(city, location){
	// Fill in location as well as cuisine filters
	// If location undefined, then city has been changed or site has just been opened.
	if(location == undefined || !location){
		results = search(city);
		locations = results.location;
		cuisines = results.cuisine;
		blogsToShow = results.blog;
		outletsToShow = results.outlet;
		// Fill in locations
		populateLocationFilter(locations);
	}
	else{
		if(location.length == 1){
			results = search(city,location[0]);
			cuisines = results.cuisine;
			blogsToShow = results.blog;
			outletsToShow = results.outlet;
		}
		else{
			cuisines =[];
			$.each(location, function(index, area){
				results = search(city, area);
				cuisines = _.union(results.cuisine, cuisines);
				blogsToShow = _.union(results.blog, blogsToShow);
				outletsToShow = _.union(results.outlet, outletsToShow);
			});
		}
	}
	// Fill in cuisines based upon location
	populateCuisineFilter(cuisines);
	// Fill in blogs
	initialiseBlogView(blogsToShow);
	// Fill in outlets
	initialiseOutletView(outletsToShow);
}

searchByCuisine = function(city,location,cuisine){
	/*if(location.length == 1){
		if(cuisine.length == 1){
			results = search(city,location[0], cuisine[0]);
			blogsToShow = results.blog;
			outletsToShow = results.outlet;
		}
		else{
			$.each(cuisine, function(index, type){
				results = search(city,location[0],type);
				blogsToShow = _.union(results.blog, blogsToShow);
				outletsToShow = _.union(results.outlet, outletsToShow);
			});
		}
	}
	else{
		if(cuisine.length == 1){
			$.each(location, function(index, area){
				results = search(city,area,cuisine[0]);
				blogsToShow = _.union(results.blog, blogsToShow);
				outletsToShow = _.union(results.outlet, outletsToShow);
			});
		}
		else{
			$.each(location, function(locIndex, area){
				$.each(cuisine, function(cuisineIndex, type){
					results = search(city,area,type);
					blogsToShow = _.union(results.blog,blogsToShow);
					outletsToShow = _.union(results.outlet, outletsToShow);
				});
			});
		}
	}*/
	$.each(location, function(locIndex, area){
				$.each(cuisine, function(cuisineIndex, type){
					results = search(city,area,type);
					blogsToShow = _.union(results.blog,blogsToShow);
					outletsToShow = _.union(results.outlet, outletsToShow);
				});
			});
	// Fill in blogs
	initialiseBlogView(blogsToShow);
	// Fill in outlets
	initialiseOutletView(outletsToShow);
}

initialiseBlogView = function(blogsToShow){
	$(".blog-list").html("");
		blogs = '<div class="row">';
		if(blogsToShow.length)
			blogs += makeBlogCard(blogsToShow.pop());
		else
			blogs += showErrorMessage();
		if(blogsToShow.length)
			blogs += makeBlogCard(blogsToShow.pop());
		blogs += "</div>";
		$(".blog-list").append(blogs);

		if(blogsToShow.length)
			$(".blogs-view-more").css("display","block");
}
initialiseOutletView = function(outletsToShow){
	$(".outlet-list").html("");
		outlets = '<div class="row">';
		if(outletsToShow.length)
			outlets += makeOutletCard(outletsToShow.pop());
		else
			outlets += showErrorMessage();
		if(outletsToShow.length)
			outlets += makeOutletCard(outletsToShow.pop());
		if(outletsToShow.length)
			outlets += makeOutletCard(outletsToShow.pop());
		outlets += "</div>";
		$(".outlet-list").append(outlets);

		if(outletsToShow.length)
			$(".outlets-view-more").css("display","block");
}
showMoreBlogs = function(){
		blogs = '<div class="row">';
		blogs += makeBlogCard(blogsToShow.pop());
		if(blogsToShow.length)
			blogs += makeBlogCard(blogsToShow.pop());
		else
			$(".blogs-view-more").css("display","none");
		blogs += "</div>";
		$(".blog-list").append(blogs);
}
showMoreOutlets = function(){
		outlets = '<div class="row">';
		outlets += makeOutletCard(outletsToShow.pop());
		if(outletsToShow.length)
			outlets += makeOutletCard(outletsToShow.pop());
		if(outletsToShow.length)
			outlets += makeOutletCard(outletsToShow.pop());
		else
			$(".outlets-view-more").css("display","none");
		outlets += "</div>";
		$(".outlet-list").append(outlets);
}

populateCuisineFilter = function(cuisines){
	$("#cuisine-desktop-modal-content").html("");
		$.each(cuisines, function(index,cuisine){
			$("#cuisine-desktop-modal-content").append('<p><input type="checkbox" name="cuisine" id="'+cuisine+'-checkbox-modal" value="'+cuisine+'"><label for="'+cuisine+'-checkbox-modal">'+cuisine+'</label></p>')
		});
}

populateLocationFilter = function(locations){
	$("#location-desktop-modal-content").html("");
		$.each(locations, function(index, location){
			$("#location-desktop-modal-content").append('<p><input type="checkbox" name="location" id="'+location+'-checkbox-modal" value="'+location+'"><label for="'+location+'-checkbox-modal">'+location+'</label></p>');
	});
}
showErrorMessage = function(){
	return "No results found";
}
makeBlogCard = function(postId){
	result = totalMap[postId];
	if(result == undefined || !result)
		return false;

	blogCard =	'<div class="col s12 l6">';
    blogCard +=	'<div class="blog-card card medium">';
    blogCard += '<div class="blog-image card-image">';
    blogCard += '<div class="chip custom-chip experience-chip">Experience</div>';
    blogCard += '<img src="'+result.image_url+'" />';
    blogCard += '<a href="http://talkingstreet.in/'+result.link+'">';
    blogCard += '<span class="card-title">'+result.post_title+'</span></a>';
    blogCard += '</div><div class="card-content">';
    blogCard += '<p><em style="color: #F44336">By Anandi Bandopadhyay</em></p><hr>';
    blogCard +=	'<p><i class="material-icons">place</i>'+result.parent+'</p>';
    if (!result.cuisine || result.cuisine == undefined)
    	result.cuisine = "Unavailable";
    blogCard +=	'<p><i class="material-icons">local_dining</i>'+result.cuisine+'</p></div></div></div>';

    return blogCard;
}

makeOutletCard = function(postId){
	result = totalMap[postId];
	if(result == undefined || !result)
		return false;
	outletCard = '<div class="col s12 l4">';
	outletCard += '<div class="card">';
    outletCard += '<div class="card-image">';
    outletCard += '<div class="chip custom-chip outlet-chip">Outlet</div>';
    outletCard += '<img src="'+result.image_url+'"/>';
    outletCard += '<a href="http://talkingstreet.in/'+result.link+'"><span class="card-title">'+result.post_title+'</span></a>';
    outletCard += '<div class="sharing"><i class="material-icons">share</i></div></div>';
    outletCard += '<div class="card-content"><div class="row">';
    outletCard += '<div class="col l8 s6 location-name">'+result.location+'</div>';
    outletCard += '<div class="col l4 s4 card-icons"><a target="_blank" href="http://maps.google.com/?q='+result.lat+','+result.long+'"><i class="material-icons">place</i></a><i class="material-icons" id="info-circle">error</i></div></div><hr />';
    outletCard += '<div class="best-for">';
    $.each(_.sample(result.best_for.split(","),3),function(index,item){
    	outletCard += '<p><i class="material-icons" class="best-for-icon">grade</i><span style="margin:5px">'+item.trim()+'</span></p>';
    });            
    outletCard += '</div>';
    outletCard += '<div class="info">';
    if(result.phone_number)
    	outletCard += '<p><i class="material-icons">phone</i><span>'+result.phone_number+'</span></p>';
    if(result.open_on)
    	outletCard += '<p><i class="material-icons">access_time</i><span>'+result.open_on+'</span></p>';
    if(result.phone_number || result.open_on)
    	outletCard += '<hr>';
    if(result.seating)
    	outletCard += '<p>Seating : '+result.seating+'</p>';
    outletCard += '</div></div></div></div>';

    return outletCard;
}

/**/
$(document).ready(function(){
      $.ajax({
        url:'data/location.listing.json',
        success:function(response){
          init(response);
          $.ajax({
              url:'data/final_results.json',
              success: function(cuisine){
                fillMaps(cuisine);
                //searchByCuisine("Bangalore",["Indira Nagar"],["Chaat"]);
                populateFilters("Bangalore");
              }
            });
        }
      });
    });


// Get all selected values
var locations = $('input[name="location"]:checked').map(function() {
    return this.value;
}).get();

var cuisines = $('input[name="location"]:checked').map(function() {
    return this.value;
}).get();