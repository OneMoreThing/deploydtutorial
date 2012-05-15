## Step 6: Security with users

Now that a user can register and log in, comments have to be secured so that only logged-in users can post them. In the Deployd dashboard, go back to the `/comments` resource.

`name` will be an automatic property now, so make it **Optional**.

Add a new **Optional** **string** called `creator`.

At the top of your `On POST` event, add the following:

    if (me) {
        this.creator = me._id;
        this.name = me.name;
    } else {
        cancel("You must be logged in to post a comment", 401);
    }

`me` is a special object that represents the current user. If the current user is not logged in, `me` will be undefined. 
The second argument to `cancel()` is the HTTP status code to return with the error. In this case, 401 means "Unauthorized".

Add this to the top of your `On PUT` and `On DELETE` events:

    if  ( !me || me._id !== this.creator ) {
      cancel("This is not your comment!", 401);
    }
    
In addition, take this opportunity to protect all the properties except `comment` in `PUT`:

    protect('creator');
    protect('name');
    protect('timestamp');
    protect('age');

On the front-end, users shouldn't have to enter their names on comments anymore; it should be the name they entered while signing up. Remove the field from `index.html`:

    <div class="form-element">
      <label for="name">Name: </label>
      <input type="text" id="name" name="name" />
    </div>

And modify `$('#comment-form').submit` in `script.js`:

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

![Final app](step5img/final-app.png)

Congratulations, you've now built a fully working and secure app with a Deployd backend! For more information, check out the [Deployd documentation](http://deployd.github.com/deployd/) for a full reference of what you can do. Good luck!