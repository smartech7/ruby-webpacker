INSTALL_PATH = File.dirname(__FILE__)

directory "#{INSTALL_PATH}/javascript", 'app/javascript'

directory "#{INSTALL_PATH}/bin", 'bin'
chmod 'bin', 0755 & ~File.umask, verbose: false

directory "#{INSTALL_PATH}/config", 'config/webpack'

append_to_file '.gitignore', <<-EOS
/public/packs
EOS

run './bin/yarn add --dev webpack@beta webpack-merge webpack-dev-server@beta path-complete-extname babel-loader babel-core babel-preset-latest coffee-loader coffee-script rails-erb-loader glob'

environment \
  "# Make javascript_pack_tag lookup digest hash to enable long-term caching\n" +
  "  config.x.webpacker[:digesting] = true\n",
  env: 'production'

environment \
  "# Make javascript_pack_tag load assets from webpack-dev-server.\n" +
  "  # config.x.webpacker[:dev_server_host] = \"http://localhost:8080\"\n",
  env: 'development'
