class IssuesController < ApplicationController
  before_action :authenticate_request!

  def index
  issues = Issue.includes(:project, :user)

  render json: issues.map { |issue|
    {
      id: issue.id,
      title: issue.title,
      description: issue.description,
      status: issue.status,
      project: {
        id: issue.project.id,
        name: issue.project.name
      },
      user: {
        id: issue.user.id,
        email: issue.user.email
      }
    }
  }
end

  def create
    issue = Issue.new(issue_params)
    issue.user = current_user

    if issue.save
      render json: issue, status: :created
    else
      render json: { errors: issue.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def issue_params
    params.permit(:title, :description, :status, :project_id)
  end
end