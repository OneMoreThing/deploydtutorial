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
      .appendTo('#comments')
    ;
  }

});