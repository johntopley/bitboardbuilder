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

configure do
  DataMapper.auto_upgrade!
end

helpers do
  include Rack::Utils
  alias_method :h, :escape_html

  def get_bitboard(id)
    BitBoard.get(strip_id_prefix(id))
  end

  def strip_id_prefix(id)
    id.sub(/^file-/, "")
  end
end

before do
  headers 'Content-Type' => 'text/html; charset=utf-8'
end

get '/' do
  @bitboards = BitBoard.all(:order => [:name.asc])
  erb :index
end

get '/show/:id' do
  bitboard = get_bitboard(params[:id])
  bitboard.bits
end

post '/' do
  BitBoard.create(:name => params[:name], :bits => params[:bits], :created_at => Time.now)
  @bitboards = BitBoard.all(:order => [:name.asc])
  erb :bitboards
end

post '/delete/:id' do
  bitboard = get_bitboard(params[:id])
  bitboard.destroy
end
