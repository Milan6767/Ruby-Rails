class MeController < ApplicationController
  before_action :authenticate_request!

  def index
    render json: {
      id: current_user.id,
      email: current_user.email
    }
  end
end