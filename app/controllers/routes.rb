get '/' do
  if session[:user_email] && session[:user_token]
    erb :main
  else
    erb :login
  end
end

post '/save' do
  Playlist.destroy_all
  Track.destroy_all

  playlist = Playlist.create

  params.each do |_, track|
    playlist.tracks.create(
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
  user.token = session[:user_token]

  playlist = Playlist.find_or_create_by(user_id: user.id)

  if playlist
    return Playlist.first.tracks.to_json(:except => [:id, :created_at, :updated_at])
  end
end
