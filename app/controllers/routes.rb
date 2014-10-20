get '/' do
  erb :main
end

post '/save' do
  Playlist.destroy_all
  Track.destroy_all

  playlist = Playlist.create

  params.each do |_, track|
    playlist.tracks.create(
      title: track["title"],
      url: track["url"],
      trackid: track["id"],
      tracktype: track["type"]
    )
  end
end

get '/load' do
  playlist = Playlist.first

  if playlist
    return Playlist.first.tracks.to_json(:except => [:id, :created_at, :updated_at])
  end
end
