require 'rails_helper'

RSpec.describe "Issues", type: :request do
  describe "GET /index" do
    it "returns http success" do
      get "/issues/index"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /create" do
    it "returns http success" do
      get "/issues/create"
      expect(response).to have_http_status(:success)
    end
  end

end
