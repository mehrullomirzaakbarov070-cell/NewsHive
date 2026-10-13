export default function manifest() {
  return {
    name: 'YangiliklarUz',
    short_name: 'YangiliklarUz',
    description: 'Uzbek tilidagi modern yangiliklar sayti',
    start_url: '/',
    display: 'standalone',
    background_color: '#071425',
    theme_color: '#0b1220',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
