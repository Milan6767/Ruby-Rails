class Project < ApplicationRecord
  has_many :issues, dependent: :destroy

  validates :name, presence: true
end