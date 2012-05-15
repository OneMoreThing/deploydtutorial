# Step 5: Adding Users

This app allows users to edit and delete comments, but there's no security - anybody can edit or delete anybody else's comment. Needless to say, this could get chaotic very quickly. A user should have to sign up and login before posting anything, and they should only be able to edit and delete their own comments.

In the dashboard, create a new **Users Collection**; leave it at its default name of `/users`. Edit the collection and add a single **string** called `name`. Notice that the Users Collection comes with the `email` and `password` properties.

Add a call to `cancel("Not yet supported")` in the `On PUT` and `On DELETE` events. 

The `cancel()` function causes a request to halt with a specified error message. This is useful for security. In this case, there is no UI to edit or delete users, so you don't want that to be available over the REST API.

On the front-end, you'll have to create a new page to allow users to register. Add `register.html`:

		<!DOCTYPE html>
		<html>
		<head>
			<title>Deployd Tutorial - Register User</title>
			<link href="style.css" rel="stylesheet" type="text/css"/>
		</head>
		<body>
			<div class="container">
				<a href="index.html">Back to comments</a>
				<form id="user-form">
					<div class="form-element">
						<label for="email">Email</label>
						<input type="email" id="email" name="email"/>
					</div>
					<div class="form-element">
						<label for="name">Name</label>
						<input type="text" id="name" name="name"/>
					</div>
					<div class="form-element">
						<label for="password">Password</label>
						<input type="password" id="password" name="password"/>
					</div>
					<div class="form-element">
						<label for="password-confirm">Confirm Password</label>
						<input type="password" id="password-confirm" name="password-confirm"/>
					</div>
					
					<button type="submit">Register</button>
				</form>
			</div>
			<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"
			></script>
			<script type="text/javascript" src="dpd.js"></script>
			<script type="text/javascript" src="register.js"></script>
		</body>
		</html>

Finally, create `register.js`:

		function showError(xhr) {
			alert(xhr.responseText);
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
				
				dpd.users.save(user)
				.done(function(result) {
						alert("Thank you for signing up!");
						location.href = "index.html";
				})
				.fail(showError);

				return false;
			});
		});

There's nothing new happening here - creating a user is exactly the same as creating a comment, except that you won't recieve the `password` property in the response - it's write-only.

![Register page](step5img/register-page.png)

## Logging in

Add this markup above the comments div in `index.html`:

		<!-- ... -->
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

This uses the special `me()` function, which returns the current user. To have a current user, though, you'll need to finish the login form. Put this after the "comment-form" submit handler:

		$('#login-form').submit(function() {
			var login = {
				email: $('#email').val(),
				password: $('#password').val()
			};
			
			dpd.users.login(login, function(result, error) {
				if (error) return showError(error);
				showUser(result.user);
			});

			return false;
		});

The `login()` function on a User Collection will authenticate a user and cause subsequent `/users/me` requests to return that user. Note that `login()` doesn't return the user directly - it returns it as the `user` property, along with a session id. You can use the session id if you can't depend on cookies that Deployd automatically creates; for example, in a non-browser app.

Finally, add a log out event handler that calls `logout()`.

		$('#logout-btn').click(function() {
			dpd.users.logout(function(success, error) {
				if (error) return showError(error);
				currentUser = null;
				$('#login-form').show();
				$('#greeting').hide();
			});

			return false;
		});

Now you can log in and out of your app! Once again, you didn't have to write any backend code to get it working.