function url(path) {
  return 'http://[MYAPP].deploydapp.com' + path;
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