<?php ?>
<html>
<head>
	<title>Talking Street</title>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.5/css/materialize.min.css">
	<link href='https://fonts.googleapis.com/css?family=Open+Sans:400,300,600' rel='stylesheet' type='text/css'>
</head>
<body>
	<style type="text/css">
	#container{
		text-align: center;
		display: table;
		width: 100%;
		height: 100%;
		background:url('traveller.jpg') fixed no-repeat;
		background-size: cover;
		background-position: center;
	}
	#container-wrapper{
		display: table-cell;
		vertical-align: middle;
		width: 100%;
	}
	#city-filter{
		width: 50%;
    	margin: 0 auto;
    	padding: 0px 10px;
	}
	#city-filter select{
		text-align: center;
		background: white;
		color: black;
	}
	#city-filter select:focus{
		border-bottom: 1px solid #26a69a;
    	box-shadow: 0 1px 0 0 #26a69a;
	}
	#attribution{
		position: absolute;
		bottom: 0px;
		right: 0px;
		background: rgba(0,0,0,0.5);
		color: white;
		font-size:15px;
		padding: 10px 
	}
	#brand-logo{
		width: 100%;
		position: absolute;
		top: 0px;
		left: 0px;
	}
	#brand-logo img{
		position: absolute;
		top: 20px;
		left: 20px;
	}
	#branding-line{
		font-size: 2em;
		color: white;
		padding: 10px 0px;
		font-family: "Open Sans";
		font-weight: 300;
	}
	body{
		font-family: "Open Sans";
	}
	select{
		font-weight: 300;
		font-size: 20px;
		margin-top: 20px;
	}
	input.select-dropdown{
		color: white;
		text-align: center;
		font-size: 1.5em!important;
	}
	</style>
	<div id="container">
		<div id="container-wrapper" style="background:rgba(0,0,0,0.5);">
		<div id="brand-logo">
			<img src="http://talkingstreet.in/wp-content/uploads/2015/02/talking-street.png">
		</div>
		<div style="padding:5%">
			<div id="branding-line">Discover street food around you.</div>
			<div id="city-filter">
				<select>
					<option value="" disabled selected>Choose your city</option>
				</select>
			</div>
		</div>
		</div>
		<div id="attribution">Original image from <a href="http://photos.bucketlistly.com/post/136518941771">BucketListly Photos</a></div>
	</div>
	<script type="text/javascript" src="http://code.jquery.com/jquery-2.2.0.min.js"></script>
	<script type="text/javascript" src="underscore.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.5/js/materialize.min.js"></script>
	<script type="text/javascript">
		var cityMap = {};
		$(function(){
				$.ajax({
				url:'location.listing.json',
				success:function(location){
					makeCityMap(location);

				}
			});
		});
		makeCityMap = function(location){
			console.log(location);
			$.each(location, function(index, result){
				var parent = result.parent;
				if (parent == "NULL")
					parent = "root";
				var name = result.name;
				console.log("Processing index : "+name+" with parent : "+parent);
				// If parent city is present, then add the location and initialise with empty list
				if(cityMap.hasOwnProperty(parent)){
					console.log(name);
					cityMap[parent][name]=[];
				}
				// If parent city not present, first add the parent city and then initialise with empty list 
				else{
					cityMap[parent] = {};
					cityMap[parent][name]=[];
					console.log("Initialising parent with name : "+name);
				}
			});
			console.log(cityMap);
			var cities = _.keys(cityMap);
			var select = "";
			$.each(cities,function(index, result){
				select+="<option>"+result+"</option>";
			});
			console.log(select);
			$('select').append(select).material_select();
		}
	</script>
</body>
</html>