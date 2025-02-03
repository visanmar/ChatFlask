import datetime
from flask import Flask, render_template, request, make_response, redirect
from flask_socketio import SocketIO, send

app = Flask(__name__)
app.config['SECRET KEY'] = 'secret'
socketio = SocketIO(app)


def main:
	socketio.run(app, debug=True, allow_unsafe_werkzeug=True)


@app.route('/', methods=['GET'])
def index():
    response = make_response()
    response.set_data( render_template('index.html') )

    response.set_cookie('nickname', '', expires=0)
    response.set_cookie('color', '', expires=0)
    return response

@app.route('/', methods=['POST'])
def handlePost():
    nickname = request.form.get('nickname')
    color = request.form.get('color')

    expire_date = datetime.datetime.now()
    expire_date = expire_date + datetime.timedelta(days=90)
    
    response = make_response(redirect('/chat', code=302))
    response.set_cookie('nickname', nickname, expires=expire_date, path='/chat', secure=True)
    response.set_cookie('color', color, expires=expire_date, path='/chat', secure=True)

    return response

@app.route('/chat')
def chat():
    if not 'nickname' in request.cookies:
        return redirect('/', code=401)
    
    response_body =  render_template('chat.html')    
    return response_body



@socketio.on('message')
def handleMessage(msg):
    print('message:', msg)

    send(msg, broadcast=True)



if __name__ == '__main__':
    #socketio.run(app, debug=True, host='0.0.0.0', port=4000)
    socketio.run(app, debug=True, allow_unsafe_werkzeug=True)
