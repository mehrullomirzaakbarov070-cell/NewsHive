export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              const saved = localStorage.getItem('yangiliklaruz-theme');
              const theme = saved || 'dark';
              document.documentElement.setAttribute('data-theme', theme);
            } catch (error) {
              document.documentElement.setAttribute('data-theme', 'dark');
            }
          })();
        `,
      }}
    />
  );
}
