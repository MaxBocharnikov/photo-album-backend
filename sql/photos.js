var knex = require("./sqlConnectionOptions").knex;

function normalizePhoto(photo) {
  photo.commonRating = photo.commonRating == null ? 0 : Math.round(photo.commonRating);
  //photo.userRating = photo.userRating == null ? 0 : photo.userRating;
  photo.editDate = photo.editDate == null ? photo.uploadDate: photo.editDate;

  return photo;
}

function getUserPhotos(userId) {
  var query = `select p.photo_id as id, url as imageUrl, title, description, p.user_id as author_id, u.name as user, created as uploadDate, updated as editDate, avg(ratingTable.rating) as commonRating, count(commentLength.comment_id) as comments, (select count(*) from likes where likes.photo_id = p.photo_id) as likes
    from photos p
    left join (select user_id, name from users) u
    on p.user_id = u.user_id
    left join (select photo_id, rating from ratings group by photo_id) as ratingTable
    on p.photo_id = ratingTable.photo_id
    left join (select photo_id, comment_id from comments) as commentLength
    on p.photo_id = commentLength.photo_id
       where p.user_id = ${userId} group by p.photo_id`;
  return knex.raw(query)
    .then(photos => {
      return photos[0].map(photo => {
        return normalizePhoto(photo);
      });
    });
}

function getAllPhotos() {
  var query = `select p.photo_id as id, url as imageUrl, title, description, p.user_id as author_id, u.name as user, created as uploadDate, updated as editDate, (select avg(rating) from ratings where photo_id = p.photo_id) as commonRating, count(commentLength.comment_id) as comments, (select count(*) from likes where likes.photo_id = p.photo_id) as likes
      from photos p
    left join (select user_id, name from users) u
    on p.user_id = u.user_id
    left join (select photo_id, comment_id from comments) as commentLength
    on p.photo_id = commentLength.photo_id
    group by p.photo_id`;
  return knex.raw(query)
    .then(photos => {
      return photos[0].map(photo => {
        return normalizePhoto(photo);
      });
    });
}

function changePhoto(photoId, title, description, userId) {
  var updateQuery = `update photos set title = '${title}' ,description='${description}' , updated = now() where photo_id = ` + photoId + `;`;
  return knex.raw(updateQuery)
    .then(() => {
      var query = `select p.photo_id as id, url as imageUrl, title, description, p.user_id as author_id, u.name as user, created as uploadDate, updated as editDate, avg(ratingTable.rating) as commonRating, count(commentLength.comment_id) as comments,(select count(*) from likes where likes.photo_id = p.photo_id) as likes
    from photos p
    left join (select user_id, name from users) u
    on p.user_id = u.user_id
    left join (select photo_id, rating from ratings group by photo_id) as ratingTable
    on p.photo_id = ratingTable.photo_id
    left join (select photo_id, comment_id from comments) as commentLength
    on p.photo_id = commentLength.photo_id
    where p.photo_id = ${photoId} group by p.photo_id`;
      return knex.raw(query)
        .then(photos => {
          return normalizePhoto(photos[0][0]);
        });
    });
}

function deletePhotoById(photo_id, user_id) {
  return knex('ratings')
    .where({ photo_id })
    .del()
    .then(() => {
      return knex('comments')
        .where({ photo_id })
        .del();
    })
    .then(() => {
      return knex('photos')
        .where({ user_id, photo_id })
        .del();
    });
}

function addPhoto(user_id, url, title, description) {
  return knex('photos')
    .insert({ user_id, url, title, description })
    .then(photoId => {
      const query = `select p.photo_id as id, url as imageUrl, title, description, p.user_id as author_id, u.name as user, created as uploadDate, updated as editDate, avg(ratingTable.rating) as commonRating, count(commentLength.comment_id) as comments, (select count(*) from likes where likes.photo_id = p.photo_id) as likes
    from photos p
    left join (select user_id, name from users) u
    on p.user_id = u.user_id
    left join (select photo_id, rating from ratings group by photo_id) as ratingTable
    on p.photo_id = ratingTable.photo_id
    left join (select photo_id, comment_id from comments) as commentLength
    on p.photo_id = commentLength.photo_id
    where p.photo_id = ${photoId} group by p.photo_id`;
      return knex.raw(query)
        .then(photos => normalizePhoto(photos[0][0]));
    });
}

module.exports = {
  addPhoto,
  deletePhotoById,
  changePhoto,
  getAllPhotos,
  getUserPhotos
}
