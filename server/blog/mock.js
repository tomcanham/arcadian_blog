const users = [
  {
    username: 'tomc',
    name: 'Tom Canham',
    email: 'alphasimian@gmail.com',
    joined: new Date(),
  },
  {
    username: 'fake',
    name: 'Fake User',
    email: 'fake_email@gmail.com',
    joined: new Date()
  }
];

const posts = [
  {
    id: 1,
    title: 'I Really Like Diet Coke',
    slug: '',
    text: 'Diet Coke is nice. It is fizzy. It is probably bad for me, but it contains caffeine, which I am addicted to.',
    created: new Date(),
    edited: new Date(),
    comments: [
      {
        id: 1,
        poster: 'tomc',
        text: 'Oh, and it\'s sweet and tart, which I enjoy.',
        created: new Date()
      },
      {
        id: 2,
        poster: 'fake',
        text: 'Fool. Beer is better!',
        created: new Date()
      }
    ]
  },
  {
    id: 2,
    title: 'I Like Being Fake',
    slug:'i-like-being-fake',
    text: 'Being fake is fun! It\'s easy, and I get to avoid being real.',
    created: new Date(),
    comments: [
      {
        id: 3,
        poster: 'tomc',
        text: 'Sure, man. Sure.',
        created: new Date()
      }
    ]
  }
];

module.exports = {
  users,
  posts
};