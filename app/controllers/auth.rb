def g_client
  g_client ||= OAuth2::Client.new(ENV['G_KEY'], ENV['G_SECRET'], {
    :site => "https://accounts.google.com",
    :authorize_url => "/o/oauth2/auth",
    :token_url => "/o/oauth2/token"
  })
end

get '/google_auth' do
  redirect g_client.auth_code.authorize_url(
    :redirect_uri => google_redirect_uri,
    :scope => "https://www.googleapis.com/auth/userinfo.email"
  )
end

get '/google_auth_callback' do
  g_access_token = g_client.auth_code.get_token(
    params[:code],
    :redirect_uri => google_redirect_uri
  )

  session[:user_token] = g_access_token.token
  session[:user_email] = g_access_token.get(
    "https://www.googleapis.com/userinfo/email"
  ).parsed["email"]

  redirect '/'
end

def google_redirect_uri
  uri = URI.parse(request.url)
  uri.path = '/google_auth_callback'
  uri.query = nil
  uri.to_s
end
