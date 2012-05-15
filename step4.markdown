# Step 4: Adding events to the collection

The comment app has a major problem: you can submit pretty much anything as a comment. Even if you don't want to implement a word filter, you still might not want users to post links or HTML, which could create a security vulnerability on your site. Essentially, the app needs more advanced validation. You could write this validation into the front-end, but hackers could use the REST interface to post data directly to the server.

Deployd allows you to write event handlers for collection data in JavaScript. You can use these events for validation, calculation, and security. 

Go to the dashboard, click on your `/comments` collection, and go the "Events" tab on the sidebar.

Enter the following code for "On Validate":

	if (this.comment.indexOf('Mordor') !== -1) {
		error('comment', "One does not simply comment about Mordor.");
	}

	if (this.name === 'Frank') {
		error('name', "Stop spamming my app, Frank!");
	}

In a Collection event, the `this` object represents the current object. You can use it to access properties.

The `error()` function creates a validation error. It will stop the object from saving, but the event will continue to run, checking for other errors.

To see this in action, try submitting a comment to your app that contains the word "Mordor" or is submitted by "Frank". You should see the following error message:

	comment: One does not simply comment about Mordor.
	name: Stop spamming my app, Frank!

These errors are the same format as the default "required" errors you saw in Step 2.

When building an app, remember that its REST interface will allow anybody with knowledge of HTTP to read and modify data. This can't be prevented - it's just how the web works. However, you should always make sure that the REST interface will not allow anything that can't be done in the UI.

For example, our app allows us to update the comment body, but not the name. You can prevent REST clients from modifying the name as well by adding this code to the `On PUT` event:
		
	protect('name');

The `protect()` method stops the client from changing that property.

## Automatic properties

It would be nice to show how old a comment is. Add an **Optional** **date** property to the `/comments` collection and call it `timestamp`. Add the following to your `On POST` event:

	this.timestamp = new Date();

If you add a comment now in the data table, you should see a long number appear in the "timestamp" column. You can use this in the front-end Javascript:

	function addComment(comment)) {
		//...

		var date = new Date(comment.timestamp).toLocaleDateString();
		div.append('<div class="author">on ' + date + '</div>');

		// ...
	}

**NOTE**: Any comments that were created before this step will show "Invalid Date". This is normal; the timestamp property is undefined on those objects because it was never set when they were created.

![Showing dates on comments](step4img/dates-on-comments.png)

Maybe you'd rather show how old the comment is, rather than the date it was posted, if it's relatively new. Add a new **Optional** **number** property to the collection and call it `age`. Add the following to your `On GET` event:

	this.age = (new Date() - new Date(this.timestamp)) / 1000;

This will calculate the seconds since the comment was posted. If you go to the Data table, you should see this property updating in real time.

You should also add the following to your `On PUT` event, for security:

	protect('timestamp');
	protect('age');

You can use this new property on the front end:

	function addComment(comment)) {
		//...

		if (comment.age && comment.age < 100) {
			div.append('<div class="author">' + comment.age.toFixed(0) + ' seconds ago</div>');
		} else {
			var date = new Date(comment.timestamp).toLocaleDateString();
			div.append('<div class="author">on ' + date + '</div>');  
		}

		//...
	}

![Showing age on comments](step4img/age-on-comments.png)

Now your Deployd app manages data with custom logic written in plain JavaScript, and you can control every request coming to the server.

