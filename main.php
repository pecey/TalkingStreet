<?php ?><html>
<head>
	<title>Talking Street</title>
  <link rel="stylesheet" href=
  "https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.5/css/materialize.min.css"
  type="text/css" />
  <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,300,600' rel=
  'stylesheet' type='text/css' />
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"
  type="text/css" />
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
  <style type="text/css">
/*<![CDATA[*/
.custom-container{
	width: 85%;
	margin: 0 auto;
}
                body{
                        font-family: "Open Sans";
                        font-weight: 300
                }
                .input-field{
                        width: 50%;
                        margin: 0 auto!important;
                }
                nav{
                        background: black;
                        margin-bottom: 3em;
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
        .blog-image{
                max-height: 100%;
        }
        .custom-chip{
                position: absolute;
                z-index: 10;
            top: 10px;
            left: 10px;
            box-shadow: 1px 1px 1px #2F2D2D;
        }
        .card-image{
                position: relative;
        }
  .card-title{
        background: rgba(0,0,0,0.5);
        width: 100%;
  }
  .card-content{
        width: 100%;
        display:inline-block;
        font-size: 13px;
  }
  .card-content .row{
  	margin-bottom: 10px;
  }
  .card-map{
        width: 45%;
        display: inline-block;
        padding-right: 0px;
        margin-left: 5px;
  }
  .card-map iframe{
        width: 100%;
  }
  hr{
        border-color: red;
  }
  .location-name{
        display: inline-block;
  }
  .card-icons{
        display: inline;
 
  }
  .card-icons i{
  	font-size: 18px!important;
  }
  .info{
        display: none;
  }
  .page-footer{
  	background: #1a1f23!important;
  	color: white;
  }
  .experience-chip{
  	background: #69f0ae;
  }
  .outlet-chip{
  	background: #ffd740;
  }
  .rating{
  	position: absolute;
    right: 10px;
    bottom: -15px;
    z-index: 10;
    color: white;
    background: #FF2C2C;
    padding: 10px;
    border-radius: 50%;
    box-shadow: 1px 1px 1px #5A5A5A;
  }
  .input-field{
  	background: white;
    height: 60%
  }
  .mobile-only-filters{
  	background: #ccc;
  }
  /*]]>*/
  </style>
</head>

<body>
<nav>
  <div class="nav-wrapper">
  	<ul id="nav-mobile" class="right">
       <li><a href="sass.html"><i class="material-icons left">account_circle</i>Hello, Foodie</a></li>
    </ul>
    <div id="brand-logo"><img src=
    "http://talkingstreet.in/wp-content/uploads/2015/02/talking-street.png" /></div>

    <form>
    	<div class="valign-wrapper" style="height: 100%;">
      <div class="input-field valign">
        <input type="text" class="left custom-search" placeholder="Search" />
      </div>
  </div>
    </form>

  </div>
</nav>
<div class="row hide-on-large-only mobile-only-filters">
	<div class="container">
		<div class="col m4 s4 center"><i class="material-icons">place</i>Bangalore</div>
		<div class="col m4 s4 center"><i class="material-icons">explore</i>Location</div>
		<div class="col m4 s4 center"><i class="material-icons">local_dining</i>Category</div>
	</div>
</div>
  <div class="custom-container">
    <div class="row" >
      <div class="col l2 hide-on-med-and-down">
        <ul class="collapsible" data-collapsible="accordion">
          <li>
            <div class="collapsible-header">
              <i class="material-icons">place</i>Bangalore
            </div>

            <div class="collapsible-body">
              <p>Lorem ipsum dolor sit amet.</p>
            </div>
          </li>

          <li>
            <div class="collapsible-header active">
              <i class="material-icons">explore</i>Location
            </div>

            <div class="collapsible-body">
              <p>Lorem ipsum dolor sit amet.</p>
            </div>
          </li>

          <li>
            <div class="collapsible-header">
              <i class="material-icons">local_dining</i>Category
            </div>

            <div class="collapsible-body">
              <p>Lorem ipsum dolor sit amet.</p>
            </div>
          </li>
        </ul>
      </div>

      <div class="col s10">
        <div class="row">
          <div class="col s12 l6">
            <div class="blog-card card medium">
              <div class="blog-image card-image">
                <div class="chip custom-chip experience-chip">
                  Experience
                </div><img src="traveller.jpg" /><span class="card-title">Blog
                Title</span>
              </div>
            </div>
          </div>

          <div class="col s12 l6">
            <div class="blog-card card medium">
              <div class="blog-image card-image">
                <div class="chip custom-chip experience-chip">
                  Experience
                </div><img src="traveller.jpg" /><span class="card-title">Blog
                Title</span>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col s6 l4">
            <div class="card">
              <div class="card-image">
                <div class="chip custom-chip outlet-chip">
                  Outlet
                </div><img src=
                "traveller.jpg" />
                <span class="card-title">Kota Kachori</span>
                <div class="rating"><i class="material-icons" style="font-size: 18px;">thumb_up</i></div>
              </div>
              
              <div class="card-content">
                <p data-longitude="77.5639761" data-latitude="13.0334194" style=
                "text-align:center"></p>

             	<div class="row">
	                <div class="col l6 s8" class="location-name">
	                  Koromangala
	                </div>

	                <div class="col l6 s4 card-icons">
	                  <i class="material-icons">place</i>
	                  <i class="material-icons">error</i>
	                  <i class="material-icons">share</i>
	                </div>
            	</div>
                <hr />

                <div class="best-for">
                  <p><i class="material-icons" style=
                  "font-size:15px">grade</i><span style="margin:5px">Pyaz
                  Kachoris</span></p>

                  <p><i class="material-icons" style=
                  "font-size:15px">grade</i><span style="margin:5px">Chole
                  Bhature</span></p>

                  <p><i class="material-icons" style=
                  "font-size:15px">grade</i><span style="margin:5px">Jalebi</span></p>

                  <p><i class="material-icons" style=
                  "font-size:15px">grade</i><span style="margin:5px">Sweets</span></p>

                  <p><i class="material-icons" style=
                  "font-size:15px">grade</i><span style="margin:5px">Sabudana
                  Khichdi</span></p>
                </div>

                <div class="info">
                  <p>Phone Number</p>

                  <p>Timing</p>

                  <p>Seating</p>
                </div>
              </div>
            </div>
          </div>

          <div class="col s6 l4">
            <div class="card">
              <div class="card-image">
                <div class="chip custom-chip outlet-chip">
                  Outlet
                </div><img src=
                "traveller.jpg" />
                <span class="card-title">Kota Kachori</span>
                  <div class="rating"><i class="material-icons" style="font-size: 18px;">thumb_up</i></div>
              </div>

              <div class="card-content">
                <p data-longitude="77.5639761" data-latitude="13.0334194" style=
                "text-align:center"></p>
 				<div class="row">
	                <div class="col l6 s8" class="location-name">
	                  Koromangala
	                </div>

	                <div class="col l6 s4 card-icons">
	                  <i class="material-icons">place</i>
	                  <i class="material-icons">error</i>
	                  <i class="material-icons">share</i>
	                </div>
            	</div>
                <hr />

                <div class="best-for">
                  <p><i class="material-icons" style=
                  "font-size:15px">grade</i><span style="margin:5px">Pyaz
                  Kachoris</span></p>

                  <p><i class="material-icons" style=
                  "font-size:15px">grade</i><span style="margin:5px">Chole
                  Bhature</span></p>

                  <p><i class="material-icons" style=
                  "font-size:15px">grade</i><span style="margin:5px">Jalebi</span></p>

                  <p><i class="material-icons" style=
                  "font-size:15px">grade</i><span style="margin:5px">Sweets</span></p>

                  <p><i class="material-icons" style=
                  "font-size:15px">grade</i><span style="margin:5px">Sabudana
                  Khichdi</span></p>
                </div>

                <div class="info">
                  <p>Phone Number</p>

                  <p>Timing</p>

                  <p>Seating</p>
                </div>
              </div>
            </div>
          </div>

          <div class="col s6 l4">
            <div class="card">
              <div class="card-image">
                <div class="chip custom-chip outlet-chip">
                  Outlet
                </div><img src=
                "traveller.jpg" />
                <span class="card-title">Kota Kachori</span>
                <div class="rating"><i class="material-icons" style="font-size: 18px;">thumb_up</i></div>
              </div>

              <div class="card-content">
                <p data-longitude="77.5639761" data-latitude="13.0334194" style=
                "text-align:center"></p>
                <div class="row">
	                <div class="col l6 s8" class="location-name">
	                  Koromangala
	                </div>

	                <div class="col l6 s4 card-icons">
	                  <i class="material-icons">place</i>
	                  <i class="material-icons">error</i>
	                  <i class="material-icons">share</i>
	                </div>
            	</div>
                <hr />

                <div class="best-for">
                  <p><i class="material-icons" style=
                  "font-size:15px">grade</i><span style="margin:5px">Pyaz
                  Kachoris</span></p>

                  <p><i class="material-icons" style=
                  "font-size:15px">grade</i><span style="margin:5px">Chole
                  Bhature</span></p>

                  <p><i class="material-icons" style=
                  "font-size:15px">grade</i><span style="margin:5px">Jalebi</span></p>

                  <p><i class="material-icons" style=
                  "font-size:15px">grade</i><span style="margin:5px">Sweets</span></p>

                  <p><i class="material-icons" style=
                  "font-size:15px">grade</i><span style="margin:5px">Sabudana
                  Khichdi</span></p>
                </div>

                <div class="info">
                  <p>Phone Number</p>

                  <p>Timing</p>

                  <p>Seating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col s2">
      	<div class="row">
      		<div class="col s12" style="height:200px; background: #ccc"></div>
      		<div class="col s12" style="height:200px; background: #ccc"></div>
      		<div class="col s12" style="height:200px; background: #ccc"></div>

      	</div>
      </div>
    </div>
  </div>
  <footer class="page-footer">
  	<div class="container">
  		<div class="row">
  			<div class="col s4 center-align">
  				<h5>Talking Street</h5>
  				<ul>
  					<li>about us</li>
  					<li>suggest a joint</li>
  					<li>meet the team</li>
  					<li>street food club</li>
  					<li>hygiene</li>
  				</ul>
  			</div>
  			<div class="col s4 center-align">
  				<h5>Connect with us</h5>
  				<div class="row">
  					<i class="fa fa-facebook"></i>
  					<i class="fa fa-twitter"></i>
  					<i class="fa fa-google-plus"></i>
  				</div>
  			</div>
  			<div class="col s4 center-align">
  				<h5>Contact</h5>
  				<div class="row">
  					<div class="col s12">Drop a mail to <a href="mailto:hello@talkingstreet.in">hello@talkingstreet.in</a></div>
  				</div>
  			</div>
  		</div>
  	</div>
  	<div class="footer-copyright">
  		<div class="container center-align">
  			Copyright &copy; 2016. www.talkingstreet.in. All rights reserved.
  		</div>
  	</div>
  </footer>
  <script type="text/javascript" src="http://code.jquery.com/jquery-2.2.0.min.js">
</script><script type="text/javascript" src="underscore.js">
</script><script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.5/js/materialize.min.js" type=
"text/javascript">
</script>
</body>
</html>
