# Step 2: Saving data to Deployd with AJAX

Right now, this comment app isn't very useful, because any comments you add go away when you refresh the page, and other people can't see them. It would be much better if you could save the comments somewhere and load them along with the page. 

Of course, JavaScript is a client-side language, so you can't just save data - you have to send it to a server. That's where Deployd comes in. 

## Creating a Collection

Go back to the home page of the dashboard. If you are still on the Files view, click on the "Dashboard" tab to go back to the main screen. 

Click on the "+ Resource" button and choose the "Collection" type. 

![Creating a collection](step2img/creating-collection.png)

Type '/comments' in the text box and click "save".

![Naming your collection](step2img/naming-collection.png)

Finally, click on your new `/comments` resource to go to the Collection editor.

## Adding Properties

In order to use a collection, you have to define what its objects will look like. In this app, you have to a save a user name and a comment, which are both text. 

Make sure **string** (<i class="icon-font"></i>) is selected as the type, and type in `name`. Leave "Optional" unchecked and click "Add".

![Adding a property](step2img/adding-property.png)

Do the same thing to add another **string** called `comment`.

![All properties](step2img/all-properties.png)

Now you can store data in this Collection! On the sidebar, click "Data". Type in a name and comment in the grid that appears, then click "Add".

![Adding data from the dashboard](step2img/adding-data.png)

## Getting data from a Collection

Go back to your Files resource and click on `index.html` to edit it. Add this line between the jQuery and `script.js` tags:

		<script type="text/javascript" src="dpd.js"></script>

and save.

This will import Deployd's client library. `dpd.js` is automatically provided by Deployd; you don't have to upload it. This will make development simpler for this tutorial, but it's only a shortcut for your app's REST interface - it's not necessary to use the client library.

Now edit `script.js`. Inside your `$(document).ready` function, add a `loadComments()` function and call it when the page loads.

		//...

		$(document).ready(function() {

			loadComments();

			//...

			function loadComments() {
				dpd.comments.get(function(comments, error) { //Use the Deployd SDK to send a request to the server
					$('#comments').empty(); //Empty the list
					comments.forEach(function(comment) { //Loop through the result
						addComment(comment); //Add it to the DOM.
					});
				});
			}
		});

Dpd.js will automatically detect what resources you have added to your app and add them to the `dpd` object. Each resource object has asynchronous functions to communicate with your Deployd app. 

The `get` function here sends an HTTP `GET` request to `/comments`, and returns an array of objects in the resource.

**Note**: All dpd.js functions are *asynchronous*. This means that they don't directly return a value.

		//Won't work: 
		var comments = dpd.comments.get(); 

This means that your JavaScript will continue to execute and respond to user input while data is loading, which will make your app feel much faster.


Finally, add a "Refresh" button to the app:

`script.js`:

		// ...

		loadComments();
		$('#refresh-btn').click(loadComments);

		// ...

`index.html`:

		<!-- ... -->
		<div id="comments">
		</div>

		<button id="refresh-btn">Refresh</button>

		<!-- ... -->


Now test out the app by viewing `index.html`. The app should now show the comment you entered in the Dashboard!

## Saving data

Notice that any comments you add through the app's form are still gone when you refresh. Let's make the form save comments to the database. 

Delete these lines from `script.js`:

		//Clear the form elements
		$('#name').val('');
		$('#comment').val('');

		addComment({
			name: name,
			comment: comment
		});

And replace them with: 

		dpd.comments.post({
				name: name,
				comment: comment
		}, function(comment, error) {
				if (error) return showError(error);
				
				addComment(comment);
				$('#name').val('');
				$('#comment').val('');
		});

Add a utility function at the very top of your file to alert any errors we get:

		function showError(error) {
		    var message = "An error occured";
		    if (error.message) {
		        message = error.message;
		    } else if (error.errors) {
		        var errors = error.errors;
		        message = "";
		        Object.keys(errors).forEach(function(k) {
		            message += k + ": " + errors[k] + "\n";
		        });
		    }
		    
		    alert(message);
		}

An `error` object can include either a `message` property or an `errors` hash containing validation errors. 

If you load the page now, you should be able to submit a comment that appears even after you refresh. Also, if you forget to enter a name (or a comment), you will receive an error message.

That's it! Now your app can save, load, and validate data, without a single line of backend code.