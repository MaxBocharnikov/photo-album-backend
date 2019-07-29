var knex = require("./sqlConnectionOptions").knex;


function addLike(photoId, userId){
    var query = `insert into likes (photo_id, user_id) values (${photoId}, ${userId})`;
    return knex.raw(query)
        .then(likes => {
        return likes[0];
});
}

function removeLike(photoId, userId){
    var query = `delete from likes where photo_id = ${photoId} and user_id = ${userId}`;
    return knex.raw(query)
        .then(likes => {
        return likes[0];
});
}

function isLiked(photoId, userId){
    var query = `select count(*) as isLike from likes where photo_id = ${photoId} and user_id = ${userId}`;
    return knex.raw(query)
        .then(likes => {
        return likes[0][0];
});
}



module.exports = {
    addLike,
    isLiked,
    removeLike
}