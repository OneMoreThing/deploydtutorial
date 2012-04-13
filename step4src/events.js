/* Paste these into your /comments collection: */

/* GET */
this.age = (new Date() - this.timestamp) / 1000;

/* POST */
if (this.comment.indexOf('pizza') !== -1) {
  error('comment', "You're making me hungry");
}

if (this.name === 'Frank') {
  error('name', "Stop spamming my app, Frank!");
}

this.timestamp = new Date().getTime();

/* PUT */
protect('name');
protect('timestamp');
protect('age');

if (this.comment.indexOf('pizza') !== -1) {
  error('comment', "You're making me hungry");
}