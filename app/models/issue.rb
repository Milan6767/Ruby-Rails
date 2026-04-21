class Issue < ApplicationRecord
  belongs_to :project
  belongs_to :user

  enum status: { open: "open", in_progress: "in_progress", done: "done" }

  validates :title, presence: true
  validates :status, presence: true
end