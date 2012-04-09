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

The `protect()` method stops the client from changing that property. The app doesn't allow you to change the name in the UI, but remember that anybody can use the REST interface. To protect your users, you have to make sure that a REST client can't do anything that the app itself can't do.

## Automatic properties

It would be nice to show how old a comment is. Add an **Optional** **number** property to the `/comments` collection and call it `timestamp`. Add the following to your `POST` event:

    this.timestamp = new Date().getTime();

If you add a comment now in the data table, you should see a long number appear in the "timestamp" column. You can use this in the front-end Javascript:

    function addComment(comment)) {
      //...

      var date = new Date(comment.timestamp).toLocaleDateString();
      div.append('<div class="author">on ' + date + '</div>');

      // ...
    }

**NOTE**: Any comments that were created before this step will show "Invalid Date". This is normal, because their timestamp property is null. 

![Showing dates on comments](step4img/screenshot02.png)

Maybe you'd rather show how old the comment is, rather than the date it was posted, if it's relatively new. Add a new **Optional** **number** property to the collection and call it `age`. Add the following to your `GET` event:

    this.age = (new Date() - this.timestamp) / 1000;

You should now see the age column updated in real-time on the data table.

![Updating age property](step4img/screenshot03.png)

You can use this on the front end, too:

    function addComment(comment)) {
      //...

      if (comment.age < 100) {
        div.append('<div class="author">' + comment.age.toFixed(0) + ' seconds ago</div>');
      } else {
        var date = new Date(comment.timestamp).toLocaleDateString();
        div.append('<div class="author">on ' + date + '</div>');  
      }

      //...
    }

![Showing age on comments](step4img/screenshot04.png)