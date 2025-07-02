# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Clear existing data to prevent duplicates on re-runs
Product.destroy_all
Category.destroy_all

categories_data = [
  { id: "bebidas", name: "Bebidas", image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836" },
  { id: "frango-assado", name: "Frango Assado", image_url: "https://images.unsplash.com/photo-1506302948527-e09c974730d3" },
  { id: "frango-crocante", name: "Frango Crocante (Tipo Americano)", image_url: "https://images.unsplash.com/photo-1502741338009-cac2772e28bc" },
  { id: "promocoes", name: "Promoçoes", image_url: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c" },
  { id: "frango-frito-empanado", name: "Frango Frito Empanado", image_url: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c" },
  { id: "combos", name: "Combos", image_url: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0" },
  { id: "porcoes", name: "Porções", image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836" },
  { id: "caldos", name: "Caldos", image_url: "https://images.unsplash.com/photo-1547592166-23ac45744acd" }
]

categories_data.each do |category_data|
  Category.find_or_create_by!(slug: category_data[:id]) do |category|
    category.name = category_data[:name]
    category.image_url = category_data[:image_url]
  end
end

products_data = [
  # BEBIDAS
  { id: "coca-15l", name: "Coca-Cola 1,5L", description: "Sem descrição", price: 11.0, category_id: "bebidas", image_url: "https://i.ibb.co/b5YkZs4B/coca-1-5-L.jpg", status: "active" },
  { id: "coca-2l", name: "Coca-Cola 2L", description: "Sem descrição", price: 15.0, category_id: "bebidas", image_url: "https://i.ibb.co/996M78Xv/coca-2L.jpg", status: "active" },
  { id: "guarana-15l", name: "Guaraná Antartica 1,5L", description: "Sem descrição", price: 11.0, category_id: "bebidas", image_url: "https://i.ibb.co/rKQp6VvB/guarana-antartida.jpg", status: "active" },
  { id: "coca-zero-15l", name: "Coca-Cola Zero 1,5L", description: "Sem descrição", price: 11.0, category_id: "bebidas", image_url: "https://i.ibb.co/TqwJ9FdG/coca-zero-1-5-L.jpg", status: "active" },
  { id: "coca-lata", name: "Coca-Cola Lata 310ml", description: "Sem descrição", price: 5.0, category_id: "bebidas", image_url: "https://i.ibb.co/bgjKk78j/coca-cola-lata-310-ML.jpg", status: "active" },
  { id: "suco-laranja-1l", name: "Suco Natural de Laranja 1L", description: "Sem descrição", price: 15.0, category_id: "bebidas", image_url: "https://i.ibb.co/xtpwtVNT/suco-natural-de-laranja.jpg", status: "active" },
  { id: "suco-laranja-500", name: "Suco Natural de Laranja 500ml", description: "Sem descrição", price: 10.0, category_id: "bebidas", image_url: "https://i.ibb.co/xtpwtVNT/suco-natural-de-laranja.jpg", status: "active" },
  # FRANGO ASSADO
  { id: "coxinha-asa-familiar", name: "Coxinha da Asa - Porção Famíliar", description: "Acompanha molho barbecue e molho de alho.", price: 60.0, category_id: "frango-assado", image_url: "https://i.ibb.co/77cFFdT/coxinha-da-asa-por-o-familiar.jpg", status: "active" },
  { id: "coxa-sobrecoxa-familiar", name: "Coxa e Sobrecoxa - Porção Famíliar", description: "Acompanha molho barbecue e molho de alho.", price: 60.0, category_id: "frango-assado", image_url: "https://i.ibb.co/xKp60vmx/coxa-sobre-coxa-por-o-familiar.jpg", status: "active" },
  { id: "passarinho-familiar-frangoassado", name: "Frango à Passarinho - Porção Famíliar", description: "Acompanha molho barbecue e molho de alho.", price: 60.0, category_id: "frango-assado", image_url: "https://i.ibb.co/fYyJK511/frango-a-passarinho.jpg", status: "inactive" },
  # FRANGO CROCANTE (TIPO AMERICANO)
  { id: "coxinha-asa-empanada-familiar", name: "Coxinha da Asa Empanada - Porção Familiar", description: "Acompanha molho barbecue e molho de alho.", price: 67.0, category_id: "frango-crocante", image_url: "https://i.ibb.co/SDtkMMkF/coxinha-da-asa-empanada-por-o-familiar.jpg", status: "active" },
  { id: "coxinha-asa-empanada-meia", name: "Coxinha da Asa Empanada - Meia Porção", description: "Acompanha molho barbecue e molho de alho.", price: 35.0, category_id: "frango-crocante", image_url: "https://i.ibb.co/SDtkMMkF/coxinha-da-asa-empanada-por-o-familiar.jpg", status: "active" },
  { id: "sassami-empanado-meia", name: "Sassami Empanado Crocante - Meia Porção", description: "Acompanha molho barbecue e molho de alho.", price: 40.0, category_id: "frango-crocante", image_url: "https://i.ibb.co/cSL9cQkW/frango-crocante-batata-frita-com-calabresa.jpg", status: "active" },
  { id: "sassami-empanado-familiar", name: "Sassami Empanado Crocante - Porção Familiar", description: "Acompanha molho barbecue e molho de alho.", price: 75.0, category_id: "frango-crocante", image_url: "https://i.ibb.co/cSL9cQkW/frango-crocante-batata-frita-com-calabresa.jpg", status: "active" },
  { id: "tulipa-meia", name: "Tulipa Empanada - Meia Porção", description: "Acompanha molho barbecue e molho de alho.", price: 35.0, category_id: "frango-crocante", image_url: "https://i.ibb.co/ynJC6rm6/tulipa-empanada-por-o-familiar.jpg", status: "active" },
  { id: "tulipa-familiar", name: "Tulipa Empanada - Porção Familiar", description: "Acompanha molho barbecue e molho de alho.", price: 67.0, category_id: "frango-crocante", image_url: "https://i.ibb.co/ynJC6rm6/tulipa-empanada-por-o-familiar.jpg", status: "active" },
  # PROMOCOES
  { id: "passarinho-empanado", name: "Frango à Passarinho Empanado", description: "Acompanha molho barbecue e molho de alho.", price: 49.90, category_id: "promocoes", image_url: "https://i.ibb.co/N2XQds6q/frango-a-passarinho-por-o-familiar.jpg", status: "inactive" },
  { id: "passarinho-empanado-coca", name: "Frango à Passarinho Empanado + Coca 1,5L", description: "Acompanha molho barbecue e molho de alho.", price: 59.90, category_id: "promocoes", image_url: "https://i.ibb.co/N2XQds6q/frango-a-passarinho-por-o-familiar.jpg", status: "inactive" },
  # FRANGO FRITO EMPANADO
  { id: "sassami-empanado-frito-familiar", name: "Sassami Empanado - Porção Familiar", description: "Acompanha molho barbecue e molho de alho.", price: 65.0, category_id: "frango-frito-empanado", image_url: "https://i.ibb.co/j98BjzrS/frango-empanado-batata-frita-coca-1-5-L.jpg", status: "active" },
  { id: "passarinho-empanado-frito-familiar", name: "Frango à Passarinho Empanado - Porção Familiar", description: "Acompanha molho barbecue e molho de alho.", price: 60.0, category_id: "frango-frito-empanado", image_url: "https://i.ibb.co/N2XQds6q/frango-a-passarinho-por-o-familiar.jpg", status: "inactive" },
  # COMBOS
  { id: "combo-empanado-frita", name: "Frango Empanado + Batata Frita", description: "Acompanha molho barbecue e molho de alho.", price: 60.0, category_id: "combos", image_url: "https://i.ibb.co/j98BjzrS/frango-empanado-batata-frita-coca-1-5-L.jpg", status: "active" },
  { id: "combo-empanado-frita-calabresa", name: "Frango Empanado + Batata Frita com Calabresa", description: "Acompanha molho barbecue e molho de alho.", price: 60.0, category_id: "combos", image_url: "https://i.ibb.co/j98BjzrS/frango-empanado-batata-frita-coca-1-5-L.jpg", status: "active" },
  { id: "combo-crocante-frita", name: "Frango Crocante + Batata Frita", description: "Acompanha molho barbecue e molho de alho.", price: 72.0, category_id: "combos", image_url: "https://i.ibb.co/cSL9cQkW/frango-crocante-batata-frita-com-calabresa.jpg", status: "active" },
  { id: "combo-crocante-frita-calabresa", name: "Frango Crocante + Batata Frita com Calabresa", description: "Acompanha molho barbecue e molho de alho.", price: 72.0, category_id: "combos", image_url: "https://i.ibb.co/cSL9cQkW/frango-crocante-batata-frita-com-calabresa.jpg", status: "active" },
  { id: "combo-crocante-frita-coca", name: "Frango Crocante + Batata Frita + Coca 1,5L", description: "Acompanha molho barbecue e molho de alho.", price: 83.0, category_id: "combos", image_url: "https://i.ibb.co/cSL9cQkW/frango-crocante-batata-frita-com-calabresa.jpg", status: "active" },
  { id: "combo-croc-frita-calabresa-coca", name: "Frango Croc. + Fritas e Calabresa + Coca 1,5L", description: "Acompanha molho barbecue e molho de alho.", price: 83.0, category_id: "combos", image_url: "https://i.ibb.co/cSL9cQkW/frango-crocante-batata-frita-com-calabresa.jpg", status: "active" },
  { id: "combo-empanado-frita-coca", name: "Frango Empanado + Batata Frita + Coca 1,5L", description: "Acompanha molho barbecue e molho de alho.", price: 71.0, category_id: "combos", image_url: "https://i.ibb.co/j98BjzrS/frango-empanado-batata-frita-coca-1-5-L.jpg", status: "active" },
  { id: "combo-emp-frita-calabresa-coca", name: "Frango Emp. + Fritas e Calabresa + Coca 1,5L", description: "Acompanha molho barbecue e molho de alho.", price: 71.0, category_id: "combos", image_url: "https://i.ibb.co/j98BjzrS/frango-empanado-batata-frita-coca-1-5-L.jpg", status: "active" },
  # PORÇÕES
  { id: "batata-frita", name: "Batata Frita", description: "Sem descrição", price: 30.0, category_id: "porcoes", image_url: "https://i.ibb.co/cSH0TLgb/batata-frita.jpg", status: "active" },
  { id: "batata-frita-especial", name: "Batata Frita Especial", description: "Sem descrição", price: 45.0, category_id: "porcoes", image_url: "https://i.ibb.co/jkkFDQy4/batata-frita-especial.jpg", status: "active" },
  { id: "calabresa", name: "Calabresa", description: "Sem descrição", price: 30.0, category_id: "porcoes", image_url: "https://i.ibb.co/BHcf5BFg/calabresa.jpg", status: "active" },
  { id: "batata-frita-familiar", name: "Batata Frita - Porção Familiar", description: "Sem descrição", price: 40.0, category_id: "porcoes", image_url: "https://i.ibb.co/cSH0TLgb/batata-frita.jpg", status: "active" },
  { id: "batata-frita-especial-familiar", name: "Batata Frita Especial - Porção Familiar", description: "Sem descrição", price: 60.0, category_id: "porcoes", image_url: "https://i.ibb.co/jkkFDQy4/batata-frita-especial.jpg", status: "active" },
  { id: "calabresa-familiar", name: "Calabresa - Porção Familiar", description: "Sem descrição", price: 40.0, category_id: "porcoes", image_url: "https://i.ibb.co/BHcf5BFg/calabresa.jpg", status: "active" },
  { id: "passarinho-porcoes", name: "Frango à Passarinho", description: "Sem descrição", price: 35.0, category_id: "porcoes", image_url: "https://i.ibb.co/fYyJK511/frango-a-passarinho.jpg", status: "inactive" },
  { id: "passarinho-familiar-porcoes", name: "Frango à Passarinho - Porção Familiar", description: "Sem descrição", price: 50.0, category_id: "porcoes", image_url: "https://i.ibb.co/fYyJK511/frango-a-passarinho.jpg", status: "inactive" },
  { id: "mista", name: "Porção Mista", description: "Batata Frita + Calabresa.", price: 30.0, category_id: "porcoes", image_url: "https://i.ibb.co/tMMtXX5h/por-o-mista-familiar.jpg", status: "active" },
  { id: "mista-familiar", name: "Porção Mista - Porção Familiar", description: "Batata Frita + Calabresa.", price: 45.0, category_id: "porcoes", image_url: "https://i.ibb.co/tMMtXX5h/por-o-mista-familiar.jpg", status: "active" },
  # CALDOS
  { id: "caldo-mandioca-carne", name: "Caldo de Mandioca com carne", description: "Caldo cremoso com base de mandioca e carne desfiada. 500ml", price: 18.0, category_id: "caldos", image_url: "https://i.ibb.co/TDQvJdxk/caldo-de-mandioca-com-carne.webp", status: "active" },
  { id: "caldo-abobora-frango", name: "Caldo de abóbora com frango", description: "Caldo cremoso a base de abóbora cobotian com frango desfiado, muito saboroso. 500ml.", price: 18.0, category_id: "caldos", image_url: "https://i.ibb.co/4Z3W0qCX/caldo-de-abobora-com-frango.webp", status: "active" },
  { id: "caldo-verde", name: "Caldo Verde", description: "Caldo cremoso a base de batata com couve e calabresa. 500 ml.", price: 18.0, category_id: "caldos", image_url: "https://i.ibb.co/LXtwbTQ3/caldo-verde.webp", status: "active" }
]

products_data.each do |product_data|
  category = Category.find_by(slug: product_data[:category_id])
  if category
    Product.find_or_create_by!(slug: product_data[:id]) do |product|
      product.name = product_data[:name]
      product.description = product_data[:description]
      product.price = product_data[:price]
      product.image_url = product_data[:image_url]
      product.status = product_data[:status]
      product.category = category
    end
  else
    puts "Category with slug #{product_data[:category_id]} not found for product #{product_data[:name]}"
  end
end