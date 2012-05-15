# Step 3: Updating and Deleting data

Right now in the comments app, a user can't delete their post if they decide they'd rather not have commented, or edit it if they made a typo. 

Add some links to the `addComment()` function in `script.js`: 

	function addComment(comment) {
		var editLink = $('<a href="#">Edit</a>');
		var deleteLink = $('<a href="#">Delete</a>');
	
		var div = $('<div class="comment">')
		.append($('<div class="links">').append(editLink).append(deleteLink))
		.append('<div class="author">Posted by: ' + comment.name + '</div>')
		.append('<p>' + comment.comment + '</p>')
		.appendTo('#comments');
	}

Let's start with the delete link.  Add this to the bottom of your `addComment()` function:

	deleteLink.click(function() {
		dpd.comments.del(comment._id, function(success, error) {
			if (error) return showError(error);
			if (success) div.remove();
		});
		return false;
	});

Now for editing. Add this to the `addComment()` function: 

	editLink.click(function() {
		var newComment = prompt("Enter the new comment text:", comment.comment);
		if (newComment) {
			dpd.comments.put(comment._id, {comment: newComment}, function(result, error) {
				if (error) { return showError(error); }
				comment = result;
				div.find('p').text(comment.comment);
			});
			return false;    
		}
	});
	
If you run the app now, you should be able to edit and delete comments.