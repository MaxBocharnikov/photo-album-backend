var knex = require("./sqlConnectionOptions").knex;

function normalizeComment(comment) {
    comment.edited = comment.edited == null ? comment.date : comment.edited;
    return comment;
}

function getCommentsByPhotoId(photoId) {
    return knex('comments as c')
        .select('c.comment_id as id', 'c.user_id as author_id', 'u.name as user', 'c.commented as date', 'c.edited', 'c.comment as text', 'c.photo_id as postId')
        .leftJoin('users as u', 'u.user_id', 'c.user_id')
        .where('c.photo_id', photoId)
        .then(comments => {
            return comments.map(comment => {
                return normalizeComment(comment);
            });
        });
}

function changeComment(comment_id, comment) {
    return knex.raw(`update comments set comment = '${comment}' , edited = now() where comment_id = ${comment_id};`);
   
}

function getCommentById(comment_id){
    return knex('comments as c')
    .select('c.comment_id as id', 'c.photo_id', 'c.user_id', 'c.commented', 'c.edited', 'c.comment')
    .where('c.comment_id', comment_id)
    .then(comments => {
     return comments.map(comment => {
         return normalizeComment(comment);
          });
     });
}
function deleteCommentById(comment_id) {
    return knex('comments')
        .where({
            comment_id: comment_id
        })
        .del()
        .then(id => {
        return id;
});

}

function addComment(photo_id, user_id, comment) {
    return knex('comments')
        .insert({
            photo_id: photo_id,
            user_id: user_id,
            comment: comment
        })
        .then(id => {
            return id;
        });
}

exports.getCommentsByPhotoId = getCommentsByPhotoId;
exports.changeComment = changeComment;
exports.deleteCommentById = deleteCommentById;
exports.getCommentById = getCommentById;
exports.addComment = addComment;