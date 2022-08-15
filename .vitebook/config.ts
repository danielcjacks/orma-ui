import { clientPlugin, defineConfig } from '@vitebook/client/node';
import { preactMarkdownPlugin } from '@vitebook/markdown-preact/node';
import { preactPlugin } from '@vitebook/preact/node';
import { defaultThemePlugin, DefaultThemeConfig } from '@vitebook/theme-default/node';
import preact from '@preact/preset-vite';

export default defineConfig<DefaultThemeConfig>({
  include: ['src/**/*.md', 'src/**/*.story.{jsx,tsx}'],
  plugins: [
    preactMarkdownPlugin(),
    preactPlugin({ appFile: 'App.tsx' }),
    clientPlugin(),
    defaultThemePlugin(),
    preact({ include: /\.([j|t]sx?|md)$/ }),
  ],
  site: {
    title: 'orma-ui',
    description: 'Orma UI',
    theme: {},
  },
  vite: {
    
  }
});
