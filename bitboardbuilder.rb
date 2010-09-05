require 'sinatra'
require 'dm-core'
require 'dm-timestamps'

DataMapper.setup(:default, ENV['DATABASE_URL'] || "sqlite3://#{Dir.pwd}/bitboards.db")

class BitBoard
  include DataMapper::Resource
  property :id,         Serial
  property :name,       String, :required => true
  property :bits,       Text,   :required => true
  property :created_at, DateTime
end

configure :development do
  DataMapper.auto_upgrade!
end

helpers do
  include Rack::Utils
  alias_method :h, :escape_html

  def strip_id_prefix(id)
    id.sub(/^file-/, "")
  end
end

before do
  headers 'Content-Type' => 'text/html; charset=utf-8'
  @bitboards = BitBoard.all(:order => [ :name.asc ])
end

get '/' do
  erb :index
end

get '/:id' do
  bitboard = BitBoard.get(strip_id_prefix(params[:id]))
  bitboard.bits
end

post '/' do
  BitBoard.create(:name => params[:name], :bits => params[:bits], :created_at => Time.now)
  erb :bitboards
end

post '/delete/:id' do
  bitboard = BitBoard.get(strip_id_prefix(params[:id]))
  bitboard.destroy
end
