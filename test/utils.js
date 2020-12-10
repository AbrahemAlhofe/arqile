const _ = require('lodash');

// Utilities
// =========================
module.exports.settings = {
  length : 10
}

module.exports.create = ( obj, n = module.exports.settings.length ) => _.fill(new Array(n), obj).map((o,i)=>{
  const res = { ...obj }
  if ( _.has(obj, 'id') ) { res.id = res.id + i }
  return res
})

// DataBase
// =========================
module.exports.BookModel = Object.freeze({
    title : 'The Days: His Autobiography in Three Parts',
    description : `
        For the first time,
        the three-part autobiography of one of modern Egypt's greatest writersand thinkers is available in a single paperback volume.
        The first part, An Egyptian Childhood (1929),
        is full of the sounds and smells of rural Egypt.
        It tells of Hussein's childhood and early education in a small village in Upper Egypt,
        as he learns not only to come to terms with his blindness but to excel in spite of it and win a place at the prestigious Azhar University in Cairo.
        The second part, The Stream of Days: A Student at the Azhar (1939),
        is an enthralling picture of student life in Egypt in the early 1900s,
        and the record of the growth of an unusually gifted personality.
        More than forty years later,
        Hussein published A Passage to France (1973),
        carrying the story on to his final attainment of a doctorate at the Sorbonne,
        a saga of perseverance in the face of daunting odds.
    `,
    tags : [ 'Autobiography', 'Arabic Novel', 'Taha Hussein' ],
    publisher : {
        name : 'Al Ahram',
        country : 'Egypt',
        books : [
            { id : 0 },
            { id : 1 },
            { id : 2 }
        ]
    },
    id : 0,
    author : 0
})

module.exports.AuthorModel = Object.freeze({
    name : 'Taha Hussein Ali Abd Alslaam',
    age : 83,
    avatar : 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/0d0a6d82229409.5d16e0081c3d0.jpg',
    books : [
        { id : 0, name : "The Days" },
        { id : 4, name : "Wednesday talk" },
        { id : 9, name : "The Nightingale's Prayer" }
    ],
    id : 0,
})
