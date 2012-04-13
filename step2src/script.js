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
    $('<div class="comment">')
      .append('<div class="author">Posted by: ' + comment.name + '</div>')
      .append('<p>' + comment.comment + '</p>')
      .appendTo('#comments')
    ;
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