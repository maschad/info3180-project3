import urlparse
from urllib import urlretrieve

import BeautifulSoup
import os
import requests
from flask import request, jsonify,session

from project import app, db, bcrypt
# routes
from project.models import User


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/api/register', methods=['POST'])
def register():
    json_data = request.json
    user = User(
        email=json_data['email'],
        password =json_data['password']
    )
    try:
        db.session.add(user)
        db.session.commit()
        status = 'success'

    except:
        status = 'user already registered'
    db.session.close()
    return jsonify({'result':status})

@app.route('/api/login', methods=['GET', 'POST'])
def login():
    json_data = request.json
    user = User.query.filter_by(email=json_data['email']).first()
    if user and bcrypt.check_password_hash(user.password,json_data['password']):
        session['logged_in'] = True
        status = True
    else:
        status = False
    return jsonify({'result':status})


@app.route('/api/logout', methods=['GET', 'POST'])
def logout():
    session.pop('logged_in',None)
    return jsonify({'result':'success'})

#Check for refresh page to persistant login
@app.route('/api/status')
def status():
    if session.get('logged_in'):
        if session['logged_in']:
            return jsonify({'status': True})
    else:
        return jsonify({'status': False})


@app.route('/api/user/:id/wishlist', methods=['GET', 'POST'])
def scrape():
    url = "http://www.amazon.com/gp/product/1783551623"
    result = requests.get(url)
    soup = BeautifulSoup.BeautifulSoup(result.text)
    og_image = (soup.find('meta', property='og:image') or
                soup.find('meta', attrs={'name': 'og:image'}))
    if og_image and og_image['content']:
        print og_image['content']

    thumbnail_spec = soup.find('link', rel='image_src')
    if thumbnail_spec and thumbnail_spec['href']:
        print thumbnail_spec['href']

    for img in soup.findAll("img"):
        image_url = urlparse.urljoin(url, img["src"])
        filename = img["src"].split("/")[-1]
        outpath = os.path.join('test/', filename)
        urlretrieve(image_url, outpath)
