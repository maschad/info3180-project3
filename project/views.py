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
