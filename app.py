from flask import Flask, request, jsonify, send_from_directory
import stripe
import os
from database import init_db, add_user

app = Flask(__name__, static_url_path='', static_folder=os.path.abspath(os.path.dirname(__file__)))

# Initialize database
init_db()

# Stripe configuration (Placeholder - User needs to provide key)
stripe.api_key = os.environ.get('STRIPE_SECRET_KEY', 'sk_test_placeholder')

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.json
    email = data.get('email')
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    
    success = add_user(email)
    if success:
        return jsonify({'message': 'User registered successfully'}), 201
    else:
        return jsonify({'error': 'Email already registered'}), 409

@app.route('/api/create-checkout-session', methods=['POST'])
def create_checkout_session():
    data = request.json
    amount = data.get('amount') # Amount in cents
    
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': 'Qlub Donation',
                    },
                    'unit_amount': amount,
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url='http://localhost:5000/?success=true',
            cancel_url='http://localhost:5000/?canceled=true',
        )
        return jsonify({'id': session.id})
    except Exception as e:
        return jsonify({'error': str(e)}), 403

if __name__ == '__main__':
    app.run(port=5001, debug=True)
