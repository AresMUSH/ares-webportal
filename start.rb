require 'webrick'
require 'pp'

file_path = File.join('public', 'scripts', 'aresconfig.js')
contents = File.read(file_path)

if (contents =~ /"web_portal_port"\:([\d]+)/)
  port = $1
else
  raise "Can't read port from config file."
end

root = File.join(File.dirname(__FILE__), 'dist')

request_callback = Proc.new { |req, res|   
  pp req
  pp res  
  }

  server = WEBrick::HTTPServer.new(:Port => port,
                               :SSLEnable => false,
                               :DocumentRoot => root,
                               :RequestCallback => request_callback)



trap 'INT' do server.shutdown end

server.start