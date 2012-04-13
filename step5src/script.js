$(document).ready(function() {

  var currentUser = null;
  checkLogin();

  loadComments();
  $('#refresh-btn').click(loadComments);

  $('#login-form').submit(function() {
    var login = {
      email: $('#email').val(),
      password: $('#password').val()
    };

    $.ajax(url('/users/login'), {
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(login),
      success: function(result) {
        showUser(result.user);
      },  
      error: showError
    });

    return false;
  });

  $('#comment-form').submit(function() {
    var comment = $('#comment').val();

    $.ajax(url('/comments'), {
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        comment: comment
      }),
      success: function(result) {
        addComment(result);
        
        $('#comment').val('');
      },
      error: showError
    });

    return false;
  });

  $('#logout-btn').click(function() {
    $.ajax(url('/users/logout'), {
      type: "POST",
      success: function() {
        currentUser = null;
        $('#login-form').show();
        $('#greeting').hide();
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

    if (comment.age < 100) {
      div.append('<div class="author">' + comment.age.toFixed(0) + ' seconds ago</div>');
    } else {
      var date = new Date(comment.timestamp).toLocaleDateString();
      div.append('<div class="author">on ' + date + '</div>');  
    }
    

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

  function checkLogin() {
    $.ajax(url('/users/me'), {
      type: "GET",
      success: function (result) {
        if (result) {
          showUser(result);
        }
      },
      error: function() {
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