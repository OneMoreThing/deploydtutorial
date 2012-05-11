# Step 1 - Uploading your app to Deployd

Start by creating an HTML page in your favorite text editor. Call it `index.html`:
  
    <!DOCTYPE html>
    <html>
    <head>
      <title>Deployd Tutorial</title>
      <link href="style.css" rel="stylesheet" type="text/css"/>
    </head>
    <body>
      <div class="container">
        <div id="comments">
        </div>
        <form id="comment-form">
          <div class="form-element">
            <label for="name">Name: </label>
            <input type="text" id="name" name="name" />
          </div>
          <div class="form-element">
            <textarea id="comment" name="comment" rows="5" cols="50"></textarea>
          </div>
          <div class="form-element">
            <button type="submit">Add New Comment</button>
          </div>
        </form>
      </div>
      
      <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
      <script type="text/javascript" src="script.js"></script>
    </body>
    </html>

So that this demo will be easier on the eyes, include a simple stylesheet as well. Call it `style.css`:

    body { font-size: 16pt; }
    .container { width: 960px; margin-left: auto; margin-right: auto; }
    form { border: #cccccc 1px solid; padding: 20px; margin-bottom: 10px; -moz-border-radius: 5px; -webkit-border-radius: 5px; border-radius: 5px; }
    .form-element { margin-bottom: 10px; }
    #refresh-btn { margin-bottom: 20px; }
    .comment { padding: 10px; margin-bottom: 10px; border-bottom: #cccccc 1px solid; }
    .comment .links { float: right; }
    .comment .links a { margin-left: 10px; }
    .comment .author { font-style: italic; }

Finally, add some jQuery to allow users to add comments in `script.js`. Take a moment to understand how this works; you will build on this in later steps.

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

Open up the page in your browser to test it. Enter a name and comment, then click the "Add New Comment" button.
  
![App preview](step1img/app-preview.png)

## Uploading your app to Deployd

At this point, you've got a working web app. It would be nice to upload it to the web so that other people can see it. 

Go into your Deployd app Dashboard. Your Deployd app is made of *Resources*. Every Deployd app has a **Files** resource by default, which lets you upload static HTML, JavaScript, CSS, images, and other files to the web. Later, we will add resources to save and load data. Right now, we just want to use the Files resource, so click on it in the Dashboard:

![Finding Files](step1img/files-resource.png)

Click the "Upload" button at the bottom of the screen and navigate to the folder on your computer where you have saved your app. Select `index.html`, `style.css`, and `script.js`, then click OK.

![Files screen after uploading](step1img/files-uploaded.png)

That's it! Your app is on the web. Click on `index.html`'s "View" button to test it out. Now anybody can access the app if you give them the link.

## Set up local sync (Optional)

For apps with a more complex folder structure, uploading files manually might become a hassle. Deployd offers a command line tool for simply uploading and downloading your app's files. Click on the "Setup Local Sync" button for instructions to install and use the tool.