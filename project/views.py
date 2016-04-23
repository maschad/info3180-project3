import urlparse

import BeautifulSoup
import requests
from flask import request, jsonify, session, g
from flask.ext.httpauth import HTTPBasicAuth

from project import app, db
from project.models import User, Item

auth = HTTPBasicAuth()


@auth.verify_password
def verify_password(username_or_token, password):
    print username_or_token
    # first try to authenticate by token
    user = User.verify_auth_token(username_or_token)
    if not user:
        # try to authenticate with username/password
        user = User.query.filter_by(email=username_or_token).first()
        if not user or not user.verify_password(password):
            return False
    g.user = user
    return True

# routes
@app.route('/api/token')
@auth.login_required
def get_auth_token():
    token = g.user.generate_auth_token()
    return jsonify({'token': token.decode('ascii')})


@app.route('/api/resource')
@auth.login_required
def get_resource():
    return jsonify({'data': 'Hello, %s!' % g.user.username})

@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/api/register', methods=['POST'])
def register():
    email = request.json.get('email')
    password = request.json.get('password')
    if User.query.filter_by(email=email).first() is not None:
        status = 'user already registered'
    user = User(email=email)
    user.hash_password(password)
    db.session.add(user)
    db.session.commit()
    status = 'success'

    db.session.close()
    return jsonify({'result':status})

@app.route('/api/login', methods=['GET', 'POST'])
def login():
    json_data = request.json
    user = User.query.filter_by(email=json_data['email']).first()
    if user.verify_password(json_data['password']):
        session['logged_in'] = True
        status = True
    else:
        status = False
    return jsonify({'result':status})


@app.route('/api/logout', methods=['GET', 'POST'])
def logout():
    session.pop('logged_in',None)
    return jsonify({'result':'success'})


##Check for refresh page to persistant login
@app.route('/api/status')
@auth.login_required
def status():
    if session.get('logged_in'):
        if session['logged_in']:
            return jsonify({'status': True})
    else:
        return jsonify({'status': False})


@app.route('/api/user/wishlist/<user_id>', methods=['POST'])
def add(user_id):
    data = request.get_json()
    name = data['name']
    description = data['description']
    url = data['url']
    item = Item(name, description, url, user_id)
    db.session.add(item)
    db.session.commit()
    response = jsonify({'name': item.name, 'description': item.description, 'url': url})
    return response


@app.route('/api/user/wishlist/<user_id>', methods=['GET'])
@auth.login_required
def view(user_id):
    user = db.session.query(User).filter_by(id=user_id).first()
    items = user.items
    result = {'items': items, 'firstname': user.firstname, 'lastname': user.lastname}
    return jsonify(result)


@app.route('/api/add_item', methods=['POST'])
@auth.login_required
def add_item():
    images = []

    json_data = request.get_json()
    url = json_data['url']
    result = requests.get(url).text
    soup = BeautifulSoup.BeautifulSoup(result)
    for img in soup.findAll("img", src=True):
        if "sprite" not in img["src"]:
            images.append(urlparse.urljoin(url, img["src"]))

    print images[0]
    return jsonify({'images': images})
