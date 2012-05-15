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

$(document).ready(function() {
    
    loadComments();
    $('#refresh-btn').click(loadComments);

    $('#comment-form').submit(function() {
		//Get the data from the form
		var name = $('#name').val();
		var comment = $('#comment').val();
        
        dpd.comments.post({
            name: name,
            comment: comment
        }, function(comment, error) {
            if (error) return showError(error);
            
            addComment(comment);
            $('#name').val('');
            $('#comment').val('');
        });

		return false;
	});

	function addComment(comment) {
		$('<div class="comment">')
			.append('<div class="author">Posted by: ' + comment.name + '</div>')
			.append('<p>' + comment.comment + '</p>')
			.appendTo('#comments')
		;
	}
    
    function loadComments() {
		dpd.comments.get(function(result, error) { //Use the Deployd SDK to send a request to the server
		    $('#comments').empty(); //Empty the list
			result.forEach(function(comment) { //Loop through the result
				addComment(comment); //Add it to the DOM.
			});
		});
	}

});