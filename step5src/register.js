$(document).ready(function() {
  $('#user-form').submit(function() {
    var user = {
      email: $('#email').val(),
      name: $('#name').val(),
      password: $('#password').val()
    };

    if ($('#password-confirm').val() !== user.password) {
      alert("Passwords must match!");
      return false;
    }

    $.ajax(url('/users'), {
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(user),
      success: function() {
        alert("Thank you for signing up!");
        location.href = "index.html";
      }, 
      error: showError
    });

    return false;
  });
});