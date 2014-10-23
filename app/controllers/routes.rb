get '/' do
  if session[:user_email]
    erb :main
  else
    erb :login
  end
end

get '/logout' do
  session[:user_email] = nil
  redirect '/'
end

post '/save' do
  user = User.find_by(email: session[:user_email])
  playlist = Playlist.find_by(user_id: user.id)

  playlist.tracks.destroy_all
  playlist.destroy

  user.playlist = Playlist.create

  params.each do |_, track|
    user.playlist.tracks.create(
      title: track["title"],
      duration: track["duration"],
      url: track["url"],
      trackid: track["id"],
      tracktype: track["type"]
    )
  end
end

get '/load' do
  user = User.find_or_create_by(email: session[:user_email])
  playlist = Playlist.find_or_create_by(user_id: user.id)
  playlist.tracks.to_json(:except => [:id, :created_at, :updated_at])
end
