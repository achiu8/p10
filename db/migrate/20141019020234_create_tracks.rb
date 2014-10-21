class CreateTracks < ActiveRecord::Migration
  def change
    create_table :tracks do |t|
      t.references :playlist
      t.string :title, :url, :tracktype
      t.integer :trackid, :duration
      t.timestamps
    end
  end
end
