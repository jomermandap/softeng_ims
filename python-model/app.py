from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from model import ComprehensiveRecommendationModel
import json
from bson import ObjectId

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

app = Flask(__name__)
CORS(app)
app.json_encoder = JSONEncoder

# MongoDB Connection
client = MongoClient('mongodb://localhost:27017/')
db = client['ims']
bills_collection = db['bills']
products_collection = db['products']
market_demand_collection = db['market_demand']

@app.route('/inventory-recommendations', methods=['GET'])
def get_inventory_recommendations():
    # Fetch data from MongoDB
    bills_data = list(bills_collection.find())
    products_data = list(products_collection.find())
    market_demand_data = list(market_demand_collection.find())
    
    # Initialize and run recommendation model
    recommender = ComprehensiveRecommendationModel(bills_data, products_data, market_demand_data)
    inventory_recs = recommender.generate_comprehensive_recommendations()
    
    return jsonify(inventory_recs)

@app.route('/product-bundles', methods=['GET'])
def get_product_bundles():
    # Fetch data from MongoDB
    bills_data = list(bills_collection.find())
    products_data = list(products_collection.find())
    market_demand_data = list(market_demand_collection.find())
    
    # Initialize and run recommendation model
    recommender = ComprehensiveRecommendationModel(bills_data, products_data, market_demand_data)
    bundle_recs = recommender.recommend_product_bundles()
    
    return jsonify(bundle_recs)

if __name__ == '__main__':
    app.run(debug=True)