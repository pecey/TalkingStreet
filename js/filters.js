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

var selectedCity = "Bangalore";
/* Maps */
/* To be used for archive */
try{
var map = map = new google.maps.Map(document.getElementById('map'), {
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
var geocoder = new google.maps.Geocoder();
var infowindow;
var mapLocationData = [];
var markers = [];
}
catch(e){
	console.log(e);
}

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
		formattedCuisine = [];
		$.each(result.cuisine.split(","), function(index, cuisines){
			$.each(cuisines.split("/"), function(index, cuisine){
					cuisine = cuisine.trim();
					formattedCuisine.push(cuisine)
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
			result.cuisine = formattedCuisine.join(", ");				
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
			result["location"] = [location];
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
	if(location == undefined || !location || location.length<1){
		results = search(city);
		locations = results.location;
		cuisines = results.cuisine;
		blogsToShow = results.blog;
		outletsToShow = results.outlet;
		mapLocationData = [];
		if(isArchiveTemplate())
			deleteMarkers();
		// Fill in locations
		populateLocationFilter(locations);
		// Fill in outlets
		initialiseOutletView(outletsToShow, true);
	}
	else{
		mapLocationData = [];
		if(isArchiveTemplate())
			deleteMarkers();

		if(location.length == 1){
			results = search(city,location[0]);
			cuisines = results.cuisine;
			blogsToShow = results.blog;
			outletsToShow = results.outlet;
			
		}
		else{
			cuisines =[];
			blogsToShow = [];
			outletsToShow = [];
			$.each(location, function(index, area){
				results = search(city, area);
				cuisines = _.union(results.cuisine, cuisines);
				blogsToShow = _.union(results.blog, blogsToShow);
				console.log(outletsToShow);
				console.log(results);
				outletsToShow = _.union(results.outlet, outletsToShow);
				console.log(outletsToShow);
			});
		}
		// Fill in outlets
		initialiseOutletView(outletsToShow, false);
	}
	// Fill in cuisines based upon location
	populateCuisineFilter(cuisines);
	// Fill in blogs
	initialiseBlogView(blogsToShow);
	
}

searchByCuisine = function(city,location,cuisine){
	if(location == undefined || !location || location.length<1){
		location = Object.keys(cityMap[city]);
	}
	blogsToShow = [];
	outletsToShow = [];
	mapLocationData = [];
	if(isArchiveTemplate())
		deleteMarkers();
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
	initialiseOutletView(outletsToShow, false);
}

initialiseBlogView = function(blogsToShow){
	// If no blogs then remove the block
	if(blogsToShow.length == 0){
		$(".blog-list").css("display","none");
	}
	else
		$(".blog-list").css("display","block");
	$(".blog-list").html("");
	$(".blogs-view-more").css("display","none");
	blogs = '<div class="row">';
	if(blogsToShow.length)
		blogs += makeBlogCard(blogsToShow.pop());
	else
		blogs += showErrorMessage();
	if(blogsToShow.length)
		blogs += makeBlogCard(blogsToShow.pop());
	blogs += "</div>";
	$(".blog-list").append(blogs);

	if(blogsToShow.length > 0)
		$(".blogs-view-more").css("display","block");
}
initialiseOutletView = function(outletsToShow, showLess){
	$(".outlet-list").html("");
	$(".outlet-view-more").css("display","none");
	counter = 0;
	outlets = "";
	$.each(outletsToShow, function(index,outlet){
		counter += 1;
		if(counter == 1)
			outlets += "<div class='row'>";
		outletCard = makeOutletCard(outlet);
		outlets += outletCard;
		if(counter == 3){
			outlets += "</div>";
			counter = 0;
		}
		if(showLess == true && counter == 0){
			$(".outlet-view-more").css("display","block");
			return false;
		}
	});	
	$(".outlet-list").append(outlets);
	if(isArchiveTemplate())
		redrawMap(mapLocationData);
}
showMoreBlogs = function(){
		if(blogsToShow.length == 0){
			$(".blogs-view-more").css("display","none");
			return false;
		}
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
		if(outletsToShow.length == 0){
			$(".outlets-view-more").css("display","none");
			return false;
		}
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
		if(isArchiveTemplate())
			redrawMap(mapLocationData);
}

populateCuisineFilter = function(cuisines){
	$("#cuisine-collapsible-body").html("");
	$.each(_.sample(cuisines,5), function(index, cuisine){
		console.log(cuisine);
		$("#cuisine-collapsible-body").append('<p><input type="checkbox" onclick="applyQuickCuisineFilter(this)" name="cuisine" id="'+cuisine+'-checkbox-collapsible" value="'+cuisine+'"><label for="'+cuisine+'-checkbox-collapsible">'+cuisine+'</label></p>');
		$("#cuisine-modal-body").append('<p><input type="checkbox" onclick="applyQuickCuisineFilter(this)" name="cuisine" id="'+cuisine+'-checkbox-bottom-modal" value="'+cuisine+'"><label for="'+cuisine+'-checkbox-bottom-modal">'+cuisine+'</label></p>');
	});	
	if(cuisines.length>5){
		$(".cuisine-collapsible-body-view-more").css("display","block");
		$(".cuisine-modal-body-view-more").css("display","block");
		$("#cuisine-desktop-modal-content").html("");
		$.each(cuisines, function(index,cuisine){
			$("#cuisine-desktop-modal-content").append('<p><input type="checkbox" onclick="checkboxUIHack(this)" name="cuisine" id="'+cuisine+'-checkbox-modal" value="'+cuisine+'"><label for="'+cuisine+'-checkbox-modal">'+cuisine+'</label></p>')
		});
	}
}

populateLocationFilter = function(locations){
	console.log("Rearranging");
	$("#location-collapsible-body").html("");
	$.each(_.sample(locations,5), function(index, location){
		$("#location-collapsible-body").append('<p><input type="checkbox" onclick="applyQuickLocationFilter(this)" name="location" id="'+location+'-checkbox-collapsible" value="'+location+'"><label for="'+location+'-checkbox-collapsible">'+location+'</label></p>');
		$("#location-modal-body").append('<p><input type="checkbox" onclick="applyQuickLocationFilter(this)" name="location" id="'+location+'-checkbox-bottom-modal" value="'+location+'"><label for="'+location+'-checkbox-bottom-modal">'+location+'</label></p>');
	});
	if(locations.length > 5){
		$(".location-collapsible-body-view-more").css("display","block");
		$(".location-modal-body-view-more").css("display","block");
		$("#location-desktop-modal-content").html("");
			$.each(locations, function(index, location){
				$("#location-desktop-modal-content").append('<p><input type="checkbox" onclick="checkboxUIHack(this)" name="location" id="'+location+'-checkbox-modal" value="'+location+'"><label for="'+location+'-checkbox-modal">'+location+'</label></p>');
		});
	}
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
    if (result["cuisine"].length > 0)
       blogCard +=	'<p><i class="material-icons">local_dining</i>'+result.cuisine+'</p></div></div></div>';

    return blogCard;
}

makeOutletCard = function(postId){

	result = totalMap[postId];
	if(result == undefined || !result)
		return false;

	temp = [];
	temp.push(result.post_title);
	temp.push(result.lat);
	temp.push(result.long);
	mapLocationData.push(temp);


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

applyLocationFilter = function(){
	// Close the modal
	$('#location-desktop-modal').closeModal();
	// Get all locations
	var locations = $('input[name="location"]:checked').map(function() {
   		return this.value;
	}).get();
	// Get unique values
	locations = _.uniq(locations, isUniq);
	populateFilters(selectedCity, locations);	
}

applyCuisineFilter = function(){
	// Close the modal
	$("#cuisine-desktop-modal").closeModal();
	// Get selected locations
	var locations = $('input[name="location"]:checked').map(function() {
   		return this.value;
	}).get();
	// Get selected cuisines
	var cuisines = $('input[name="cuisine"]:checked').map(function() {
    return this.value;
	}).get();
	console.log(cuisines);
	// Get unique values
	locations = _.uniq(locations, isUniq);
	cuisines = _.uniq(cuisines, isUniq);
	searchByCuisine(selectedCity, locations, cuisines);
}

checkboxUIHack = function(e){
	name = $(e).val();
	modal_name =  name+"-checkbox-modal";
	bottom_modal_name =name+"-checkbox-bottom-modal"; 
	collapsible_name = name+"-checkbox-collapsible";
	modal_element_id = "input[id='"+modal_name+"']";
	bottom_modal_element_id = "input[id='"+bottom_modal_name+"']";
	collapsible_element_id = "input[id='"+collapsible_name+"']";
	if($(e).prop("checked")){
		$(modal_element_id).prop("checked",true);
		$(bottom_modal_element_id).prop("checked",true);
		$(collapsible_element_id).prop("checked",true);
	}
	else{
		$(modal_element_id).prop("checked",false);
		$(bottom_modal_element_id).prop("checked",false);
		$(collapsible_element_id).prop("checked",false);
	}
}

applyQuickLocationFilter = function(e){
	checkboxUIHack(e);
	applyLocationFilter();
}


applyQuickCuisineFilter = function(e){
	checkboxUIHack(e);
	applyCuisineFilter();
}

/* Helper function for _.uniq */

function isUniq(item) {
    return String(item);
}

/* Functions for map */

changeMapCenter = function(center){
	console.log("Changing map center to ",center);
	console.log(map);
	console.log(geocoder);
 geocoder.geocode({address:center}, function(results, status){
 if (status == google.maps.GeocoderStatus.OK) {
    map.setCenter(results[0].geometry.location);
  }
});
}

redrawMap = function(locations){
	for (i = 0; i < locations.length; i++) {  
	  marker = new google.maps.Marker({
	    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
	    map: map
	  });

	  google.maps.event.addListener(marker, 'click', (function(marker, i) {
	    return function() {
	      infowindow.setContent(locations[i][0]);
	      infowindow.open(map, marker);
	    }
	  })(marker, i));
	 
	 markers.push(marker);
	}
}

initialiseMap = function(locations){
  geocoder.geocode({address:selectedCity}, function(results, status){
     if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
      }
  });
  infowindow = new google.maps.InfoWindow();

    var marker, i;
    if(locations){
    		for (i = 0; i < locations.length; i++) {  
		  marker = new google.maps.Marker({
		    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
		    map: map
		  });

		  google.maps.event.addListener(marker, 'click', (function(marker, i) {
		    return function() {
		      infowindow.setContent(locations[i][0]);
		      infowindow.open(map, marker);
		    }
		  })(marker, i));

		  markers.push(marker);
		}
    }
}

function deleteMarkers() {
	console.log(markers);
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
  console.log(markers);
}

/* Detect archive template*/
isArchiveTemplate = function(){
	//return $("body").hasClass("archive");	
	return true;
}

/* Kick things off */
/*$(document).ready(function(){
	$.getJSON('//talkingstreet.in/wp-content/themes/jupiter-child/js/location.listing.json', function(response){
		init(response);
		$.getJSON('//talkingstreet.in/wp-content/themes/jupiter-child/js/final_results.json', function(cuisine){
			fillMaps(cuisine);
			if(isArchiveTemplate)
				initialiseMap();
            populateFilters(selectedCity);
		});
	});
});*/
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
	            if(isArchiveTemplate)
	            	initialiseMap();
	            populateFilters(selectedCity);
	          }
	        });
	    }
	  });
});


