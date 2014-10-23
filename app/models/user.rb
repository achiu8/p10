class User < ActiveRecord::Base
  has_one :playlist
end
