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
    
    var currentUser = null;
    checkLogin();
    
    loadComments();
    $('#refresh-btn').click(loadComments);

    $('#comment-form').submit(function() {
		//Get the data from the form
		var comment = $('#comment').val();
        
        dpd.comments.post({
            comment: comment
        }, function(comment, error) {
            if (error) return showError(error);
            
            addComment(comment);
            $('#comment').val('');
        });

		return false;
	});
    
    $('#login-form').submit(function() {
      var login = {
        email: $('#email').val(),
        password: $('#password').val()
      };
      
      dpd.users.login(login, function(result, error) {
        if (error) return showError(error);
        showUser(result.user);
      });

      return false;
    });
    
    $('#logout-btn').click(function() {
        dpd.users.logout(function(success, error) {
            if (error) return showError(error);
            currentUser = null;
            $('#login-form').show();
            $('#greeting').hide();
        });

        return false;
    });

	function addComment(comment) {
        var editLink = $('<a href="#">Edit</a>');
        var deleteLink = $('<a href="#">Delete</a>');
    
        var div = $('<div class="comment">')
            .append($('<div class="links">').append(editLink).append(deleteLink))
            .append('<div class="author">Posted by: ' + comment.name + '</div>')
            .append('<p>' + comment.comment + '</p>')
            .appendTo('#comments');
            
        if (comment.age && comment.age < 100) {
            div.append('<div class="author">' + comment.age.toFixed(0) + ' seconds ago</div>');
        } else {
            var date = new Date(comment.timestamp).toLocaleDateString();
            div.append('<div class="author">on ' + date + '</div>');  
        }
            
        deleteLink.click(function() {
            dpd.comments.del(comment._id, function(success, error) {
                if (error) return showError(error);
                if (success) div.remove();
            });
            return false;
        });
        
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
    }
    
    function loadComments() {
		dpd.comments.get(function(result, error) { //Use the Deployd SDK to send a request to the server
		    $('#comments').empty(); //Empty the list
			result.forEach(function(comment) { //Loop through the result
				addComment(comment); //Add it to the DOM.
			});
		});
	}
    
    function checkLogin() {
        dpd.users.me(function(user, error) {
            if (user) {
                showUser(user);
            } else {
                currentUser = null;
                $('#login-form').show();
                $('#greeting').hide();
            }
        });
    }
    
    function showUser(user) {
      currentUser = user;
      $('#login-form').hide();
      $('#greeting').show().find('h3').text("Welcome, " + user.name);
    }

});