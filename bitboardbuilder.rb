require 'sinatra'
require 'dm-core'
require 'dm-timestamps'

DataMapper.setup(:default, ENV['DATABASE_URL'] || "sqlite3://#{Dir.pwd}/bitboards.db")

class BitBoard
  include DataMapper::Resource
  property :id,         Serial
  property :name,       String, :required => true
  property :bits,       String, :required => true
  property :created_at, DateTime
end

configure :development do
  DataMapper.auto_upgrade!
end

get '/' do

end
