module.exports = {
  images: {

    domains: ['tse1.mm.bing.net', 'tse2.mm.bing.net', 'tse3.mm.bing.net'],

  },
    async redirects() {
      return [
        {
          source: '/dashboard',
          destination: '/',
          permanent: true,
        },
      ]
    },
  }