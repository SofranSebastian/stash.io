# stash.io

Stash.io is a mobile application developed as a project for University which aims to get as close as possible to a real mobile cryptocurrency transaction app.

The main purpose of the application is to learn building distributed applications.

Technologies used:
  - Node.js for runtime environment
  - React Native framework for creating the mobile application
  - JavaScript as programming language
  - Express.js as backend web application framework
  - Firebase as Baas

# Arhitecture Diagram

![dp](https://user-images.githubusercontent.com/25872149/119739944-b2893480-be8b-11eb-89c8-bbbd797bec23.jpg)

# SplashScreen and Preview

![rsz_12screenshot_1622061269](https://user-images.githubusercontent.com/25872149/119728316-fd02b500-be7b-11eb-86c4-0504ce7bb0ea.png) ![rsz_screenshot_1622061257](https://user-images.githubusercontent.com/25872149/119727867-7bab2280-be7b-11eb-84b1-41a15c68fe00.png) 

![rsz_screenshot_1622061286](https://user-images.githubusercontent.com/25872149/119728599-5834a780-be7c-11eb-9a58-b5c016c9c304.png) ![rsz_screenshot_1622061279](https://user-images.githubusercontent.com/25872149/119728469-30ddda80-be7c-11eb-8ac7-1f66c9c680ae.png)

# Mobile Client UI and Functionality
  
SignUp:
  - if someone doesn't have an account he can register in the application, the registration is done using Firebase Authentication Functions
  - when a registration is completed the new user created receives '1000 USD' to start experimenting

![Screenshot_1622063147_25](https://user-images.githubusercontent.com/25872149/119731511-b1eaa100-be7f-11eb-8e7e-d91876d6c645.png)

LogIn:
  - when a user has an account he can log in into the application, the log in is done using Firebase Authentication Functions

![Screenshot_1622063131_25](https://user-images.githubusercontent.com/25872149/119731393-8d8ec480-be7f-11eb-9a9a-28d6932ab99d.png)

Wallet:
  - the main purpose of this functionality is to show to the user his current wallet currencies
  - in the lower half of the screen you can see a chart showing the evolution of bitcoin in the last period of time
  - at the base of the screen you can see the navigation represented by a bottom material navigator

![Screenshot_1622063187_25](https://user-images.githubusercontent.com/25872149/119731602-d0e93300-be7f-11eb-9a08-76fd13e1d4dd.png)
    
Buy/Sell:
  - the main purpose of this functionality is to show to the user the top 10 cryptocurrencies at this moment
  - offering to the user the opportunity to buy or sell depending on his balance
  - at the base of the screen you can see the navigation represented by a bottom material navigator

![Screenshot_1622063194_25](https://user-images.githubusercontent.com/25872149/119731656-e199a900-be7f-11eb-98fb-984ed5913e8a.png)

Transfer:
  - the main purpose of this functionality is to let the user send any type of currency he owns to anyone he wants
  - contains a modal of confirmation to alert the user to pay attention to who is sending any type of currency he chooses
  - at the base of the screen you can see the navigation represented by a bottom material navigator

![Screenshot_1622063200_25](https://user-images.githubusercontent.com/25872149/119731755-fd04b400-be7f-11eb-94ce-d50e19574c54.png)

History:
  - the main purpose of this functionality is to let the user see his history of transactions
  - contains a card with a nice UI for each transaction made BUY/SELL/SENT/RECEIVE
  - at the base of the screen you can see the navigation represented by a bottom material navigator

![Screenshot_1622080878_25](https://user-images.githubusercontent.com/25872149/119755129-2df9de80-beaa-11eb-8404-68b5d20c9a89.png)


# Run it

How to start the project:
  - first clone it
  - use npm install for installing all the needed packages
  - after the npm install is done start the application with expo start
  - for running it on a simulator you can leave the Expo server on LAN
  - if you want to scan the QR Code with the phone you need to switch to TUNNEL connection

  
