require 'rails_helper'

RSpec.describe "Api::V1::Categories", type: :request do
  describe "GET /index" do
    it "returns http success and a list of categories" do
      create_list(:category, 3)
      get "/api/v1/categories"
      expect(response).to have_http_status(:success)
      expect(json_body.size).to eq(3)
    end
  end

  describe "GET /show" do
    it "returns http success and the category details" do
      category = create(:category)
      get "/api/v1/categories/#{category.slug}"
      expect(response).to have_http_status(:success)
      expect(json_body['id']).to eq(category.id)
      expect(json_body['slug']).to eq(category.slug)
    end
  end

  def json_body
    JSON.parse(response.body)
  end
end
