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
        
        dpd.users.post(user, function(result, error) {
            if (error) showError(error);
            
            alert("Thank you for signing up!");
            location.href = "index.html";
        });
        
        return false;
    });
});