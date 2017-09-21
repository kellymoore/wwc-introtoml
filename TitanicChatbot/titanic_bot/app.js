var request = require('request');

let restify = require('restify')
//Include the library botbuilder
let builder = require('botbuilder')

//Create the server
let server = restify.createServer()

//Run the server continuously
server.listen(3978, function(){
	console.log('The server is running on ', server.name, server.url)
})

// Create chat connector with the default id and password
let connector = new builder.ChatConnector()

//When the server posts to /api/messages, make the connector listen to it.
server.post('/api/messages', connector.listen())

let bot = new builder.UniversalBot(connector)

// //Root Dialog
bot.dialog('/', [greeting, getName, getClass, getSex, getAge, getSibsp, getParch, getFare, getEmbarked, postData ])

//Greeting
function greeting(session){
    builder.Prompts.text(session, "Hello. What is your name?");
}

//Name
function getName(session, results){
    //Set name
    session.userData.name = results.response

    //Ask next question
    builder.Prompts.choice(session, "Ok "+session.userData.name+", let's see if you would have survived on the Titanic! \n Which class would you have been in?", "1st|2nd|3rd", { listStyle: builder.ListStyle.button }); 
}

//Class
function getClass(session, results){
    session.userData.pclass = results.response.score
    builder.Prompts.choice(session, "Are you Male or Female?", "Female|Male", { listStyle: builder.ListStyle.button });
}

//Sex
function getSex(session, results){
    session.userData.sex = results.response.index
    builder.Prompts.text(session, "What age are you?");
}

//Age
function getAge(session, results){
    session.userData.age = results.response
    builder.Prompts.text(session, "How many siblings or spouses would have travelled with you?");
}

//SiblingsSpouses
function getSibsp(session, results){
    session.userData.sibsp = results.response
    builder.Prompts.text(session, "How many parents or children would have travelled with you?");
}

//ParentsChildren
function getParch(session, results){
    session.userData.parch = results.response
    builder.Prompts.text(session, "How much would you have paid for your ticket in £?");
}

//Fare
function getFare(session, results){
    session.userData.fare = results.response;
    builder.Prompts.choice(session, "Where would you have embarked from?", "Cherbourg|Queenstown|Southampton", { listStyle: builder.ListStyle.button });
}

//Embarked
function getEmbarked(session, results){
    session.userData.embarked = results.response.index;
    //GET RESULT FROM FLASK SERVER
   builder.Prompts.text(session, "Ok. Are you ready for your result? ");
}

function postData(session, data){
    survivedMessage = "Congratulations "+session.userData.name+"! You would have survived on the Titanic.";
    notSurvivedMessage = "Unfortunatley "+session.userData.name+", you would not have survived on the Titanic.";

	request.post({
        url:     'http://localhost:5000/predict',
            body:    JSON.stringify(session.userData)
      }, function(error, httpresponse, body){
            survived = JSON.parse(body).survive;

            if (survived==1){
                session.endDialog(survivedMessage)
            }else{
                session.endDialog(notSurvivedMessage)
            }
      });
}