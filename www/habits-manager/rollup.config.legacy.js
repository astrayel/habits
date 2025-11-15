import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';

const isDevelopment = process.env.NODE_ENV === 'development';
const production = !isDevelopment && process.env.NODE_ENV === 'production';
const version = '2.0.0-habits-manager';

console.log(`🛠️  Building Kids Tasks Legacy Cards in ${production ? 'PRODUCTION' : 'DEVELOPMENT'} mode`);

// Simple variable replacement without needing @rollup/plugin-replace
const simpleReplace = (options = {}) => ({
  name: 'simple-replace',
  transform(code) {
    let transformedCode = code;
    Object.keys(options).forEach(key => {
      const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      transformedCode = transformedCode.replace(regex, options[key]);
    });
    return {
      code: transformedCode,
      map: null
    };
  }
});

const config = {
  input: 'src/cards/kids-tasks-legacy/main.js',
  output: {
    format: 'es',
    sourcemap: isDevelopment,
    banner: isDevelopment
      ? '/* Kids Tasks Legacy Cards - Development Build for habits-manager */'
      : '/* Kids Tasks Legacy Cards - Production Build for habits-manager */',
  },
  plugins: [
    // Replace environment variables
    simpleReplace({
      '__DEV__': isDevelopment ? 'true' : 'false',
      '__PROD__': production ? 'true' : 'false',
      'process.env.VERSION': `"${version}"`,
      'process.env.NODE_ENV': `"${process.env.NODE_ENV || 'development'}"`
    }),

    resolve({
      browser: true,
      preferBuiltins: false,
    }),
  ],

  watch: {
    include: 'src/cards/kids-tasks-legacy/**',
    exclude: 'node_modules/**',
    clearScreen: false
  }
};

// Output configuration based on environment
if (isDevelopment) {
  // Development build - readable, with sourcemaps
  config.output = {
    ...config.output,
    file: 'dist/kids-tasks-legacy.dev.js',
    compact: false,
    indent: '  '
  };

  // Copy to HA www directory in dev mode too
  config.plugins.push(
    copy({
      targets: [
        {
          src: 'dist/kids-tasks-legacy.dev.js',
          dest: '../../custom_components/habits_manager/www',
          rename: 'kids-tasks-legacy.dev.js'
        }
      ],
      hook: 'writeBundle'
    })
  );

} else if (production) {
  // Production build - minified, optimized
  config.output = {
    ...config.output,
    file: 'dist/kids-tasks-legacy.js',
    compact: true
  };

  // Add production plugins
  config.plugins.push(
    terser({
      compress: {
        drop_console: false, // Keep console for debugging habits-manager
        drop_debugger: true,
      },
      format: {
        comments: false
      }
    }),
    // Copy to Home Assistant www directory
    copy({
      targets: [
        { src: 'dist/kids-tasks-legacy.js', dest: '../../custom_components/habits_manager/www' }
      ],
      hook: 'writeBundle'
    })
  );
} else {
  // Default dev build
  config.output = {
    ...config.output,
    file: 'dist/kids-tasks-legacy.dev.js',
    compact: false,
  };
}

export default config;
