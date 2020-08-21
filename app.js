/* Requiring the installed modules that will be used inside this app */

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

app.use(bodyParser.urlencoded({extended: true})); //we need this to use the req.body.blabla, so we can request the data the user types on our frontpage and store them into the server (our variables)
app.use(express.static("public")); //in order to use our local custom css and our images of the frontend webpage we gotta use this.

/* What we did in the above line is: we created a public directory and stored inside the images directory and the css file,
 * because they are local unlike bootstrap which is online, and would work anyways with the server, so we could use our local,
 * configurations in the server, so the front page would work with all its bootstrap and custom local styling.*/


app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
}); //setting the front page of our server to be the signup.html

/* No need to do what is commented bellow, when we have success or failure (see below in the app.post) */

// app.get("/success", function(req, res) {
//   res.sendFile(__dirname + "/success.html");
// }); //setting the /success page
//
// app.get("/failure", function(req, res) {
//   res.sendFile(__dirname + "/failure.html");
// }); //setting the /failure page

app.post("/", function(req, res) {
  var firstName = req.body.firstName; //storing the name that the user types in the front inside the var firstName.
  var lastName = req.body.lastName;
  var eMail = req.body.eMail;
  // console.log("First name is: " + firstName + "\n" + "Last name is: " + lastName + "\n" + "Email is: " + eMail);

  var data = {
    members: [
      {
        email_address: eMail, //storing the email that the user types...
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      } //so if we structure the data object like this, we made an array of objects. In this case an array of 1 object because we want to subscribe 1 person at a time.
      //{} if we wanted our array to contain multiple objects inside, so to subscribe multiple users to our mail list, we would keep adding brackets {} like this.
    ] //this one has to be an array of objects named members as the mailchimp api documentation specifies
  };

  //Now that we got our data object to pass onto the mailchimp server, we got to make it into JSON format because their API accepts only JSON text formats and not the whole JS object.

  var jsonData = JSON.stringify(data); //make the data javascript object into a JSON data format

  var options = {
    url: "https://us17.api.mailchimp.com/3.0/lists/8207124b79?skip_merge_validation=<SOME_BOOLEAN_VALUE>&skip_duplicate_check=<SOME_BOOLEAN_VALUE>",
    method: "POST",
    headers: {
      "Authorization": "andrewpap22 e4ede22265379343cea87fdf6283801f-us17"
    }, // basic HTTP Authorization, providing first any username we would like and then seperate with a single space the API key and then using the request module. and we can do that for any API that supports basic HTTP Authentication
    body: jsonData
  };

  /* So at this point we got: Authorization, and we got content (data object) and we specified how we want our request to be proccessed (to POST the data)
   * and we got the url we want to sent our request to... So we're ready to go... */

  request(options, function(error, response, body) {
    if (error) {
      res.sendFile(__dirname + "/failure.html"); //no need to setup with app.get, just simply sent the failure.html file
    } else {
      if (response.statusCode === 200) { //HTTP code 200 means everything is OK
        res.sendFile(__dirname + "/success.html"); //same with success as with failure above!
      } else {
        res.sendFile(__dirname + "/failure.html");
        // res.send("There was an error with signing up, please try again!");
      }
      // console.log("The HTTP status code is: " + response.statusCod); //HTTP status code
    }
  });
});

app.post("/failure", function(req, res) {
  res.redirect("/"); //so what we do here is, if they get to the failure page, they can hit the try again button, and that will redirect them to the home page!
});

// app.listen(3000, function() {
//   console.log("Server started on port: 3000...");
// });

app.listen(process.env.PORT || 3000, function() { //dynamic use of port to let the heroku server handle it as it wants...
  console.log("Server is running on port: 3000..."); //by adding the || 3000 we're telling our app to work on both heroku servers and our local server on port 3000 simaltenusly
});


// e4ede22265379343cea87fdf6283801f-us17 (API key)

//8207124b79 (list ID) (this is gonna help mailchimp to identify where we want to add or remove subscribers from)

//the Procfile in our directory which contains: web: node app.js simply tells heroku what command to use to lunch our application

/* Now, say we want to make some changes to this project and we want to update them to heroku. To do that:
 * 1. git add . in the project directory the changes and then.
 * 2. git commit -m "made some changes..."
 * 3. git push heroku master
 * and that's it, it will upload the changes and then we can check the site for them taking place...*/
