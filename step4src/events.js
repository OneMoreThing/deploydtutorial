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
this.timestamp = new Date();

/* On PUT */
protect('name');
protect('timestamp');
protect('age');