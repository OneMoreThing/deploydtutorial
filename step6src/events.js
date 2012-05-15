/* Paste these into your /comments collection: */

/* On GET */
this.age = (new Date() - new Date(this.timestamp)) / 1000;

/* On Validate */
if (this.comment.indexOf('Mordor') !== -1) {
    error('comment', "One does not simply comment about Mordor.");
}

if (this.name === 'Frank') {
    error('name', "Stop spamming my app, Frank!");
}

/* On POST */
if (me) {
    this.creator = me._id;
    this.name = me.name;
} else {
    cancel("You must be logged in to post a comment", 401);
}

this.timestamp = new Date();

/* On PUT */
if  ( !me || me._id !== this.creator ) {
    cancel("This is not your comment!", 401);
}

/* On DELETE */
if  ( !me || me._id !== this.creator ) {
  cancel("This is not your comment!", 401);
}

protect('creator');
protect('name');
protect('timestamp');
protect('age');

/* Paste these into your /users collection: */

/* On PUT */
cancel("Not yet supported");

/* On DELETE */
cancel("Not yet supported");