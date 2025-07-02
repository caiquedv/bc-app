require 'rails_helper'

RSpec.describe "Api::V1::Products", type: :request do
  describe "GET /index" do
    it "returns http success and a list of products" do
      create_list(:product, 3)
      get "/api/v1/products"
      expect(response).to have_http_status(:success)
      expect(json_body.size).to eq(3)
    end
  end

  describe "GET /show" do
    it "returns http success and the product details" do
      product = create(:product)
      get "/api/v1/products/#{product.slug}"
      expect(response).to have_http_status(:success)
      expect(json_body['id']).to eq(product.id)
      expect(json_body['slug']).to eq(product.slug)
    end
  end

  def json_body
    JSON.parse(response.body)
  end
end
