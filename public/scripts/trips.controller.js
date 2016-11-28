var app = angular.module("Airbnb");


var TripControllerFn = function ($http,tripsService) {
	
	var vm = this;

	vm.rate = 1;
  	vm.max = 5;
  	vm.isReadonly = false;

  	vm.hoveringOver = function(value) {
    vm.overStar = value;
    //alert(vm.overStar);
    //vm.percent = 100 * (value / vm.max);
  };
	

  	vm.uploadPic = function(tripId){
  		console.log("in photo upload");

		filepicker.pick(
		  {
		    mimetype: 'image/*',
		    container: 'modal',
		    services: ['COMPUTER', 'FACEBOOK', 'INSTAGRAM', 'GOOGLE_DRIVE', 'DROPBOX']
		  },
		  function(Blob){
		    console.log(JSON.stringify(Blob.url));
		    //vm.user.profilepic=Blob.url;
		    vm.trips[tripId].photo = Blob.url;
		    console.log(vm.trips[tripId].photo);
		    //vm.trips[tripId].uploadButton = true;

		    //vm.UpdateProfile();
		  },
		  function(FPError){
		    console.log(FPError.toString());
		  });

	}


	vm.rateHost = function(tripId) {

		var temp = vm.trips[tripId];
/*
		angular.forEach(temp,function(temp) {
			if(temp.trip_id == tripId)
			{
				temp.reviewDiv = 1;
			}
		});*/
		vm.trips[tripId].reviewDiv = 1;

		//vm.trips.reviewDiv = 1;
	}

	vm.trips ={};
	
	vm.temp = function() {
		console.log("inside star");
	}

	vm.submitReview = function(tripId) {
		console.log(vm.trips[tripId]);

		$http.post('/submitReviewForTrip',vm.trips[tripId]).
		then(function(response) {
			if(response.status == 200)
			{
				vm.trips[tripId].submitted = 1;
			}
			else
			{
				vm.trips[tripId].submitted = 0;
			}
		});
	}

	vm.rating = 0;
	var getTrips = function(){
		tripsService.getTrips().
		then(function (response) {
			console.log(response);


/*			if(response.length!=0){
              angular.forEach(response,function(response) {
              if(!response.property.propertyPictures || response.property.propertyPictures.length==0){
                response.property.propertyPictures = ["public/images/room-list-images/room-1-a.png"];
              }
              response.rating = 0;
              response.rate = 1;
              response.review = "";
              response.reviewDiv = 0;
              //response.submitted = 2;
              $http.post('/getRatingsForTrip',{"host_id":response.host_id}).
              then(function(rating) {
              	if(rating.status == 200)
              	{
              		//response.rating = 0;
              		
              		
              		console.log("kad fjdaf"+rating.data.result.feedback);
              		if(rating.data.result != null)
              		{
	              		response.rating = 1;
	              		response.rate = rating.data.result.ratings;
	              		response.review = rating.data.result.feedback;

	              		console.log("adfbhadbfa"+response.review);
              		}
              	}
              });

            })}*/

			if(response.length!=0){
	            angular.forEach(response,function(response) {
	            if(!response.property.propertyPictures || response.property.propertyPictures.length==0){
	              response.property.propertyPictures = ["public/images/room-list-images/room-1-a.png"];
	            }
	            response.rating = 0;
	            response.rate = 1;
	            response.review = "";
	            response.reviewDiv = 0;


				if(response.Reviews.length != 0)
				{
					console.log("Review exists"+response.Reviews);
	              		response.rating = 1;
	              		response.rate = response.Reviews[0].ratings;// rating.data.result.ratings;
	              		response.review = response.Reviews[0].feedback;// rating.data.result.feedback;
	              		response.photo = response.Reviews[0].photo;
	              		if(response.photo == null)
	              		{
	              			response.photoFlag = 0;
	              		}	
	              		else
	              		{
	              			response.photoFlag = 1;
	              		}
	              		console.log(response.rating+":::"+response.rate+":::"+response.review);
				}

              //response.submitted = 2;
/*              $http.post('/getRatingsForTrip',{"host_id":response.host_id}).
              then(function(rating) {
              	if(rating.status == 200)
              	{
              		//response.rating = 0;
              		
              		
              		console.log("kad fjdaf"+rating.data.result.feedback);
              		if(rating.data.result != null)
              		{
	              		response.rating = 1;
	              		response.rate = rating.data.result.ratings;
	              		response.review = rating.data.result.feedback;

	              		console.log("adfbhadbfa"+response.review);
              		}
              	}
              });*/

            })}


			vm.trips = response;
		});
		console.log("fewrctwatcretcerceetet"+vm.trips);
	}
	getTrips();
};

app.controller("TripsController",TripControllerFn);