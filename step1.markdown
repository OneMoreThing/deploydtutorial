# Step 1 - Creating an app on Deployd

In this tutorial, you will create a simple web app that allows users to post comments and view other users' comments.

![App preview](step1img/app-preview.png)

Start by opening your Deployd app Dashboard. Your Deployd app is made of *Resources*. Every Deployd app has a **Files** resource by default, which lets you create upload or create static HTML, JavaScript, CSS, images, and other files on the web. Later, we will add resources to save and load data. Right now, we just want to start programming, so click on the Files Resource in the Dashboard:

![Finding Files](step1img/files-resource.png)

Click on the "+ File" button. Call the file `index.html`. Paste the following in the Dashboard text editor:
	
	<!DOCTYPE html>
	<html>
	<head>
		<title>Deployd Tutorial</title>
		<link href="style.css" rel="stylesheet" type="text/css"/>
	</head>
	<body>
		<div class="container">
			<div id="comments">
			</div>
			<form id="comment-form">
				<div class="form-element">
					<label for="name">Name: </label>
					<input type="text" id="name" name="name" />
				</div>
				<div class="form-element">
					<textarea id="comment" name="comment" rows="5" cols="50"></textarea>
				</div>
				<div class="form-element">
					<button type="submit">Add New Comment</button>
				</div>
			</form>
		</div>
		
		<script src="http://code.jquery.com/jquery-latest.min.js"></script>
		<script type="text/javascript" src="script.js"></script>
	</body>
	</html>

Click "Save" or press Ctrl/Cmd-S, then click "Back" to go back to the Files view.

So that this demo will be easier on the eyes, include a simple stylesheet as well. Create a new file and call it `style.css`:

	body { font-size: 16pt; }
	.container { width: 960px; margin-left: auto; margin-right: auto; }
	form { border: #cccccc 1px solid; padding: 20px; margin-bottom: 10px; -moz-border-radius: 5px; -webkit-border-radius: 5px; border-radius: 5px; }
	.form-element { margin-bottom: 10px; }
	#refresh-btn { margin-bottom: 20px; }
	.comment { padding: 10px; margin-bottom: 10px; border-bottom: #cccccc 1px solid; }
	.comment .links { float: right; }
	.comment .links a { margin-left: 10px; }
	.comment .author { font-style: italic; }

Finally, add some jQuery to allow users to add comments. Create a new file called `script.js`. Take a moment to understand how this works; you will build on this in later steps.

	$(document).ready(function() {

		$('#comment-form').submit(function() {
			//Get the data from the form
			var name = $('#name').val();
			var comment = $('#comment').val();

			//Clear the form elements
			$('#name').val('');
			$('#comment').val('');

			addComment({
				name: name,
				comment: comment
			});

			return false;
		});

		function addComment(comment) {
			$('<div class="comment">')
				.append('<div class="author">Posted by: ' + comment.name + '</div>')
				.append('<p>' + comment.comment + '</p>')
				.appendTo('#comments');
		}

	});

![Files screen after uploading](step1img/files-uploaded.png)

Click the "View" button next to `index.html` to test your app. Enter a name and comment, then click the "Add New Comment" button.



That's it! Your app is on the web. Now anybody can access it if you give them the link.

## Set up local sync (Optional)

For apps with a more complex folder structure, creating files on the Dashboard or uploading them manually from your computer might become a hassle. Deployd offers a command line tool for simply uploading and downloading your app's files. Click on the "Setup Local Sync" button for instructions to install and use the tool.