class Product < ApplicationRecord
  belongs_to :category

  enum status: { active: 0, inactive: 1 }

  validates :name, presence: true
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :status, presence: true
  validates :slug, presence: true, uniqueness: { case_sensitive: false }
end
