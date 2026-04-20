require 'rails_helper'

RSpec.describe "Mes", type: :request do
  describe "GET /index" do
    it "returns http success" do
      get "/me/index"
      expect(response).to have_http_status(:success)
    end
  end

end
