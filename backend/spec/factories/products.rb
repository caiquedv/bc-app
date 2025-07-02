FactoryBot.define do
  factory :product do
    association :category
    sequence(:name) { |n| "Product #{n}" }
    description { "Product description" }
    price { 10.0 }
    image_url { "https://example.com/product.jpg" }
    status { :active }
    sequence(:slug) { |n| "product-#{n}" }
  end
end
