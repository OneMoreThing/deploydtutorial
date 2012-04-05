# Step 3: Updating and Deleting data

Right now in the comments app, a user can't delete their post if they decide they'd rather not have commented, or edit it if they made a typo. First, you need something for the user to click, so add that to the `addComment()` function: 

    function addComment(comment) {
      var editLink = $('<a href="#">Edit</a>');
      var deleteLink = $('<a href="#">Delete</a>');

      var div = $('<div class="comment">')
        .append($('<div class="links">').append(editLink).append(deleteLink))
        .append('<div class="author">Posted by: ' + comment.name + '</div>')
        .append('<p>' + comment.comment + '</p>')
        .appendTo('#comments')
      ;
    }

Let's start with the delete link.  Add this to the bottom of your `addComment()` function:

    deleteLink.click(function() {
      $.ajax(url('/comments/' + comment._id), {
        type: "DELETE",
        success: function() {
          div.remove();
        },
        error: showError
      });     

      return false;
    });

Notice this is almost exactly the same as creating a comment, only with a `DELETE` method and no data. However, the URL has `comment._id` appended. In order to delete something, you need to specify what you want to delete. Every Deployd object has an automatically generated `_id` property for exactly this purpose. This REST request looks something like this:

    URL: http://[MYAPP].deploydapp.com/comments/4f7dd6ea7696253010000077
    Method: DELETE

    204 No Content

Now for editing. Add this to the `addComment()` function: 

    editLink.click(function() {
      var newComment = prompt("Enter the new comment text:", comment.comment);
      $.ajax(url('/comments/' + comment._id), {
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify({
          name: comment.name,
          comment: newComment
        }),
        success: function(result) {
          div.find('p').text(result.comment);
        },
        error: showError
      });

      return false;
    });

This has the same URL as the `DELETE` request, but uses a `PUT` method. 

If you run the app now, you should be able to edit and delete comments. This would also be a good time to upload your JavaScript to Deployd.

![Working app](step3img/screenshot01.png)

`script.js` should look like this now:

    function url(path) {
      return 'http://[MYAPP].deployapp.com' + path;
    }

    function showError(xhr) {
      alert(xhr.responseText);
    }

    $(document).ready(function() {

      loadComments();
      $('#refresh-btn').click(loadComments);

      $('#comment-form').submit(function() {
        //Get the data from the form
        var name = $('#name').val();
        var comment = $('#comment').val();

        $.ajax(url('/comments'), {
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({
            name: name,
            comment: comment
          }),
          success: function(result) {
            addComment(result);
            
            $('#name').val('');
            $('#comment').val('');
          },
          error: showError
        });

        return false;
      });

      function addComment(comment) {
        var editLink = $('<a href="#">edit</a>');
        var deleteLink = $('<a href="#">delete</a>');

        var div = $('<div class="comment">')
          .append($('<div class="links">').append(editLink).append(deleteLink))
          .append('<div class="author">Posted by: ' + comment.name + '</div>')
          .append('<p>' + comment.comment + '</p>')
          .appendTo('#comments')
        ;

        deleteLink.click(function() {
          $.ajax(url('/comments/' + comment._id), {
            type: "DELETE",
            success: function() {
              div.remove();
            },
            error: showError
          });

          return false;
        });

        editLink.click(function() {
          var newComment = prompt("Enter the new comment text:", comment.comment);
          $.ajax(url('/comments/' + comment._id), {
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify({
              name: comment.name,
              comment: newComment
            }),
            success: function(result) {
              div.find('p').text(result.comment);
            },
            error: showError
          });

          return false;
        });
      }

      function loadComments() {
        $.get(url('/comments'), function(result) { //Use jQuery AJAX to send a request to the server
          var result = result || []; //If it's null, replace with an empty array
          $('#comments').empty(); //Empty the collection
          result.forEach(function(comment) { //Loop through the result
            addComment(comment); //Add it to the array.
          });
        });
      }

    });