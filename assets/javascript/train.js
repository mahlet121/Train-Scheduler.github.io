 // Initialize Firebase
 console.log("testing");

 var config = {
   apiKey: "AIzaSyDh5RddNcLfILIZDtQfADsmWEPyGM1uoiQ",
   authDomain: "train-ceb7f.firebaseapp.com",
   databaseURL: "https://train-ceb7f.firebaseio.com",
   projectId: "train-ceb7f",
   storageBucket: "train-ceb7f.appspot.com",
   messagingSenderId: "553788325340"
 };
 firebase.initializeApp(config);

 // Create a variable to reference the database.
 var database = firebase.database();

 //All of our connections will be stored in this directory.
 var connectionsRef = database.ref("/connections");

 // '.info/connected' is a boolean value, true if the client is connected and false if they are not.
 var connectedRef = database.ref(".info/connected");


 // Initial Values
 var name = "";
 var destination = "";
 var frequency = "";
 var firstTime = "";
 var nextArrival;
 var minutesAway;

 // Capture Button Click
 $("#click-button").on("click", function(event) {
   event.preventDefault();

   // Grabbed values from text boxes
   name = $("#name").val().trim();
   destination = $("#destination").val().trim();
   firstTime = $("#time").val().trim();
   frequency = $("#fmin").val().trim();

   console.log(name);
   console.log(destination);
   console.log(frequency);

   // First Time (pushed back 1 year to make sure it comes before current time)
   var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
   console.log(firstTimeConverted);

   // Current Time
   var currentTime = moment();
   console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

   // Difference between the times
   var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
   console.log("DIFFERENCE IN TIME: " + diffTime);

   // Time apart (remainder)
   var tRemainder = diffTime % frequency;
   console.log(tRemainder);

   // Minute Until Train
   var tMinutesTillTrain = frequency - tRemainder;
   console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);


   var nextTrain = moment().add(tMinutesTillTrain, "minutes");
   console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm a"));
   var tMinute = moment(nextTrain).format("hh:mm a");

   // Code for handling the push
   database.ref().push({
     name: name,
     destination: destination,
     frequency: frequency,
     firstTime: firstTime,
     nextArrival: tMinute,
     minutesAway: tMinutesTillTrain,

     dateAdded: firebase.database.ServerValue.TIMESTAMP
   });

 });


 // Firebase watcher + initial loader + .on("child_added"
 database.ref().orderByChild("dateAdded").on("child_added", function(snapshot) {
   // storing the snapshot.val() in a variable for convenience
   var sv = snapshot.val();

   // Console.loging the last user's data
   console.log(sv.name);
   console.log(sv.destination);
   console.log(sv.frequency);
   console.log(sv.firstTime);
   console.log(sv.nextArrival);
   console.log(sv.minutesAway);

   //Display the users input from Firebase
   $(".myTable1").append("<tr><td>" + sv.name + "</td><td>" + sv.destination + "</td><td>" + sv.frequency + "</td><td>" + sv.nextArrival + "</td><td>" + sv.minutesAway + "</td></tr>");

   // Handle the errors
 }, function(errorObject) {
   console.log("Errors handled: " + errorObject.code);
 });
