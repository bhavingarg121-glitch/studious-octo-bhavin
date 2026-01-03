# app.py
from flask import Flask, jsonify, send_from_directory

app = Flask(__name__, static_folder='public')

image_data = {
    "1": {
        "title": "Mountain View",
        "fullUrl": "/images/full/photo1.jpg",
        "description": "Stunning mountain landscape."
    }
}

@app.route('/api/image/<id>')
def get_image(id):
    data = image_data.get(id)
    if not data:
        return jsonify({"error": "Not found"}), 404
    return jsonify(data)

@app.route('/')
def index():
    return send_from_directory('public', 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
