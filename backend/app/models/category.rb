class Category < ApplicationRecord
  has_many :products

  validates :name, presence: true
  validates :image_url, presence: true
  validates :slug, presence: true, uniqueness: { case_sensitive: false }
end
