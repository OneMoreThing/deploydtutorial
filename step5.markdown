# Step 5: Adding Users

This app allows users to edit and delete comments, but there's no security - anybody can edit or delete anybody else's comment. Needless to say, this app could get chaotic very quickly. A user should have to sign up and login before posting anything, and they should only be able to edit and delete their own comments.

In the dashboard, create a new **Users Collection**; leave it at its default name of `/users`. Edit the collection and add a single **string** called `name`. Notice that the Users Collection comes with the `email` and `password` properties. Add a call to `cancel("Not yet supported")` in the `PUT` and `DELETE` events - the UI to edit your profile or delete your account can come later.

On the front-end, you'll have to create a new page to allow users to register. Add `register.html`:

    [register.html]

Also, take the `url()` and `showError` functions out of `script.js` and move them into a new file called `utils.js` so we can re-use them on both pages:

    function url(path) {
      return 'http://[MYAPP].deploydapp.com' + path;
    }

    function showError(xhr) {
      alert(xhr.responseText);
    }

Add a reference to `utils.js` on `index.html`, too:
    
    <!-- ... -->
    <script type="text/javascript" src="utils.js"></script>
    <script type="text/javascript" src="script.js"></script>
    <!-- ... -->

Finally, create `register.js`: 

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

There's nothing new happening here - creating a user is exactly the same as creating a comment.

![Register page](step5img/screenshot01.png)

## Logging in

Add this markup near the top of `index.html`:

    <!-- ... -->
    <div class="container">
      <form id="login-form">
          <input type="email" placeholder="Email" id="email" name="email" />
          <input type="password" placeholder="********" id="password" name="password" />
          <button type="submit">Login</button>
          <a href="register.html">Sign up</a>
        </form>
        <div id="greeting">
          <h3></h3>
          <a href="#" id="logout-btn">Log out</a>
        </div>
        <!-- ... -->  

Add the following to the top of `$(document).ready` in `script.js`:

    var currentUser = null;
    checkLogin();

Add the `checkLogin()` and `showUser()` functions:

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

This uses the special `/users/me` route, which returns the current user. To have a current user, though, you'll need to finish the login form:

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

This is a POST to `/users/login` with the properties `email` and `password`. This is an action route; instead of creating a user like a normal POST, it will authenticate a user and cause subsequent `/users/me` requests to return that user.

Finally, add a log out event handler:

    $('#logout-btn').click(function() {
      $.ajax(url('/users/logout'), {
        type: "DELETE",
        success: function() {
          currentUser = null;
          $('#login-form').show();
          $('#greeting').hide();
        },
        error: showError
      });

      return false;
    });

Users shouldn't enter their names on comments anymore; it should be the name they entered while signing up. Remove the field from `index.html`:

    <div class="form-element">
      <label for="name">Name: </label>
      <input type="text" id="name" name="name" />
    </div>

And modify `$('#comment-form').submit` in `script.js`:

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

**NOTE**: A web page on the filesystem will not hold a session. You won't be able to test this version of the app until you upload it to Deployd. Alternatively, if you are an advanced user, you can set up a quick web server on your computer to serve the files as *localhost*.

## Security with users

Now that a user can register and log in, comments have to be secured so that only logged in users can post them. In the Deployd dashboard, go back to the `/comments` resource.

`name` will be an automatic property now, so make it **Optional**.

Add a new **Optional** **string* called `creator`.

At the top of your `POST` event, add the following:

    if (me) {
        this.creator = me._id;
        this.name = me.name;
    } else {
        cancel("You must be logged in to post a comment");
    }

`me` is a special object that represents the current user. If the current user is not logged in, `me` will be undefined.

Wrap your `PUT` and `DELETE` events in the following if statement:

    if (me && me._id == this.creator) {
       // ...
    } else {
        cancel("This is not your comment!");
    }
    
In addition, take this opportunity to protect all the properties except `comment` in `PUT`:

    protect('creator');
    protect('name');
    protect('timestamp');
    protect('age');