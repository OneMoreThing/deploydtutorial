# Step 4: Adding events to the collection

The comment app has a major problem: you can submit pretty much anything as a comment. Even if you don't want to implement a word filter, you still might not want users to post links or HTML, which could create a security vulnerability on your site. Essentially, the app needs more advanced validation. You could write this validation into the app, but hackers could use the REST interface to post data directly to the server.

Deployd allows you to write event handlers for collection data in JavaScript. You can use these events for validation, calculation, and security. 

Go to the dashboard, click on your `/comments` collection, and go to the "POST" tab in the "Events" panel. 

![Events panel](step4img/screenshot01.png)

Enter the following code:

    if (this.comment.indexOf('pizza') !== -1) {
      error('comment', "You're making me hungry")
    }

    if (this.name === 'Frank') {
      error('name', "Stop spamming my app, Frank!");
    }

In a Collection event, the `this` object represents the current object. You can use it to access properties.

To see this in action, try submitting a comment to your app that contains the word "pizza" or is submitted by "Frank". You should see the following error message:
  
    {"errors":{"comment":"You're making me hungry","name":"Stop spamming my app, Frank!"}}

Errors are returned as JSON, just like an object. In a full app, you could use this to place the error messages at intuitive places in your UI.

Of course, you could post a comment and then edit it later to mention pizza. Add this code to the PUT event:
    
    protect('name');

    if (this.comment.indexOf('pizza') !== -1) {
      error('comment', "You're making me hungry")
    }

The `protect()` method stops the client from changing that property. We don't allow you to change the name in the UI, but remember that a hacker can use the REST interface just like you can. To protect your users, you have to make sure that a REST client can't do anything that the app itself can't do.