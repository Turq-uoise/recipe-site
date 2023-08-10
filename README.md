# What Should I Cook ReadMe


## Description

When asked by General Assembly to create a database based website for my second project, there were only a few ideas in my head. The first was to create something related to film or TV, but that would have required an API, so I ended up deciding to go for a website where you can upload recipes, and then search for recipes by *ingredient*. It’s becoming more common to be able to do that online, but many websites that do it still have a lot to be desired.

## Deployment link

https://what-should-i-cook.fly.dev/


## Timeframe & Working Team (Solo/Pair/Group)

I was working as a sole developer, and in total this code took me about 15 or less hours to write. 



## Technologies Used

I used JavaScript, HTML, CSS, Express and Mongoose/MongoDB to write this program.



## Brief

I was told to create a working full-stack app that meets or exceeds the below technical requirements, built by me, and hosted online (originally Heroku, but then switched to fly.io).

Your App Must:

- Have at least 2 data entities (data resources) in addition to the User Model - one entity that represents the main functional idea for your app and another with a One:Many or Many:Many relationship with that main entity (embedded or referenced).

- Use OAuth authentication.

- Implement basic authorization that restricts access to features that need a logged in user in order to work (typically CUD data operations) by "protecting" those routes from anonymous users using the ensureLoggedIn middleware from the OAuth lesson. In addition, ensure that editing and deletion of a data resource can only be done by the user that created that data (this is done in the controller - refer to the Guide to User-Centric CRUD).

- Have full-CRUD data operations somewhere within the app's features. For example, you can have functionality that Creates & Updates a post and satisfy Delete functionality by implementing the ability to delete comments.

- Be styled such that the app looks and feels similar to apps we use on a daily basis - in other words, it should have a consistent and polished user interface.

- Be deployed online.

## Planning

### Wireframes
I wanted to keep the website fairly clean but still with a lot of information on one screen, so trying to focus on using only one colour was something that could help with that.

![image](https://github.com/Turq-uoise/recipe-site/assets/107884520/60193b74-dab8-42e2-b1cc-d319cc1c084a)
![image](https://github.com/Turq-uoise/recipe-site/assets/107884520/fc83c300-b549-4f2d-b84e-b652fe688539)



### ERD
Quite a simple relationship diagram, though I ended up having to add an “IngredientSchema” to help with searching, which complicated things quite a bit.

![image](https://github.com/Turq-uoise/recipe-site/assets/107884520/bd8d72b3-be4e-4351-9176-931c4350602c)


## Build/Code Process

The first thing I did for this site was create the Express template and implement Google’s Oauth2. This was fairly seamless and it only took me about half an hour to get a working website hosted on my PC. I implemented some basic CSS and HTML to display important information and then got to work on the Schemas.

![image](https://github.com/Turq-uoise/recipe-site/assets/107884520/5a6028f9-ea9e-4fe2-9266-c3043cd03559)


I made three Schemas: a main one for recipes, an embedded one for comments, and a referenced one for ingredients. There was also a schema for users, but I created that as part of the setup for Oauth2.

Implementing inputs for the recipes was fairly simple (involving a HTML form), and getting the database up and running was straightforward. After quite a bit of trying, I managed to get the ingredientSchema properly referenced into the recipeSchema.

![image](https://github.com/Turq-uoise/recipe-site/assets/107884520/e0ffb865-92f2-436f-a786-c5ed41fa9711)
![image](https://github.com/Turq-uoise/recipe-site/assets/107884520/00fea17f-293d-475a-a62e-390188bf6b59)

What this code is doing can be explained with a few of steps:
1. It is getting the input of the user, and saving it into “ingredientsSaved”, as well as using it in a “filter”.
1. It is then setting the body of the new recipe document. The reason for this is so that the code can check for validation errors *before* I run the code for the ingredients. It sets the ingredients for the newly created recipes to be empty.
1. Then, it is checking if any of the inputted ingredients are already present in the ingredientSchema.
1. Any ingredients that *aren’t* already in the schema are then pushed into an array called “createdIngredients”.
1. New ingredient documents are created in the ingredientSchema using this array.
1. After this, the code can now get the newly created ids of the inputted ingredients using the “filter” to search through the ingredientSchema (which now contains all of the newly created ingredient documents). 
1. Then, finally, the ids of all of the ingredients that have been inputted by the user can be pushed into the recipeSchema.

The point of the code is to provide ids to the recipeSchema rather than strings, and to make sure that each ingredient is a) unique and b) has an id corresponding to it. This way, it becomes easier to use the ingredient to search for recipes. On top of this, the code achieves this via a single input from the user; instead of having to add ingredients, and then create recipes using the ingredients, the code dynamically creates new ingredients based on what has been inputted by the user, without repeating ingredients.

![image](https://github.com/Turq-uoise/recipe-site/assets/107884520/43ae1b61-36ca-4bff-90e9-cff1ef5285bb)


The main features of this site are being able to submit your own recipes, commenting on/rating recipes, and searching for recipes by ingredient. If you navigate to a recipe, you can click on the ingredient to search recipes with that ingredient. 

![image](https://github.com/Turq-uoise/recipe-site/assets/107884520/d4713a0d-e5e2-406f-8281-955485cfc744)

I achieved this using a simple query string, and a clause in my index route for my recipes to check how the page was entered (i.e was it entered by pressing the home button, or was it entered by query?)

![image](https://github.com/Turq-uoise/recipe-site/assets/107884520/5374c949-1f10-43e8-94af-f16a490606b2)
![image](https://github.com/Turq-uoise/recipe-site/assets/107884520/f562ece4-a4bf-432d-96af-e1fe86143696)



## Challenges

The biggest hurdle was implementing the relationship between the recipeSchema and ingredientSchema. At the beginning of the project, I was slightly lacking in knowledge and comfortability with Mongoose, so it ended up taking a while to figure it out. In particular, figuring out what order to run the code in (e.g creating the recipe before or after the ingredients) and converting the input from the user into an ID was quite difficult, but by continually debugging and error checking using console.log, I eventually found something that worked. 

Figuring out how to link ingredients to a search took some time, but once I figured out how to use query strings it came fairly naturally. Originally, I tried to find a way to send the ID of the ingredient into the search into page, and then start a search automatically, but it ended up being easier to send a query string directly to the search output page, and simply to check if the output page (which was the recipes/index page) was entered using a query or not.


## Wins

I thought that adding ingredients to a recipe would be difficult, but I ended up with a relatively elegant solution.

![image](https://github.com/Turq-uoise/recipe-site/assets/107884520/4071cdb1-dc9c-4279-b7eb-063eb596ab42)

Clicking within a dropdown – one populated by all ingredients in the ingredientSchema – sends the clicked ingredient into a text box on the page. 

![image](https://github.com/Turq-uoise/recipe-site/assets/107884520/3b1e77b4-3ec8-40d3-b9f5-c27fae049af7)

This way you can continually add ingredients that already exist, and also add your own.

## Key Learnings/Takeaways

I became a bit more comfortable with schema’s and Mongoose in general, but most of what I did here was similar to things I had been learning. 

## Bugs
The method string isn’t formatted correctly, so anything longer than 10 or so words ends up looking quite strange. I haven’t used the site enough to figure out too many other bugs.
Future Improvement
Being able to search using *any* query, not just ingredients, would be nice. 
The CSS could look a bit nicer, with better use of white space and an overall fancier look; the current formatting is quite basic, and there’s very little colour. 
Searching for a recipe should provide the results on the same page for a more seamless experience. 
Being able to sort recipes (by various filters, like relevance, number of ingredients, number of comments, rating etc.) would be good.




