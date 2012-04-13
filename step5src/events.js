/* Paste these into your /comments collection: */

/* GET */
this.age = (new Date() - this.timestamp) / 1000;

/* POST */
if (me) {
    this.creator = me._id;
    this.name = me.name;
} else {
    cancel("You must be logged in to post a comment");
}

if (this.comment.indexOf('pizza') !== -1) {
  error('comment', "You're making me hungry");
}

if (this.name === 'Frank') {
  error('name', "Stop spamming my app, Frank!");
}

this.timestamp = new Date().getTime();

/* PUT */
if (me && me._id == this.creator) {
    protect('creator');
    protect('name');
    protect('timestamp');
    protect('age');
    
    if (this.comment.indexOf('pizza') !== -1) {
      error('comment', "You're making me hungry");
    }
} else {
    cancel("This is not your comment!");
}

/* DELETE */
if (!(me && me._id == this.creator)) {
   cancel("This is not your comment!");
}

/* Paste these into your /users collection: */

/* PUT */
cancel("Not yet supported");

/* DELETE */
cancel("Not yet supported");