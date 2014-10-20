require_relative 'spec_helper'

describe "routes" do
  before(:each) do
    @params = {
      track: {
        title: "my title",
        url: "my url",
        id: 1,
        type: "yt"
      }
    }

  end

  describe "save" do
    it "should save tracks" do
      post '/save', @params 
      expect(Playlist.count).to eq 1
      expect(Track.count).to eq 1
    end
  end

  describe "load" do
    it "should load all tracks" do
      post '/save', @params 
      get '/load'
      response = JSON.parse(last_response.body).first
      expect(response["title"]).to eq "my title"
      expect(response["url"]).to eq "my url"
      expect(response["trackid"]).to eq 1
      expect(response["tracktype"]).to eq "yt"
    end
  end
end
