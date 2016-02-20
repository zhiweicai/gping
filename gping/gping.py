from flask import Flask,render_template
from flask import request
from DPing import pingThread
from DPing import GetHostInfo
import Queue
import json
from urllib2 import urlopen

q = Queue.Queue()
threads = []
app = Flask(__name__)
myinfo = {}

@app.route('/')
def hello_world():
    my_ip = urlopen('http://ip.42.pl/raw').read()
    print my_ip
    myinfo = GetHostInfo (my_ip)
    print myinfo
    return render_template('index.html',localip=my_ip,mylat=myinfo['loc_lat'],mylong = myinfo['loc_long'])


@app.route('/ping')
def ping ():
     result = request.query_string.split ('=')
     print result[1]

     my_ip = urlopen('http://ip.42.pl/raw').read()
     mylocalinfo = GetHostInfo (my_ip)
     q.put (json.dumps (mylocalinfo))

     mythread = pingThread (result[1], q)
     threads.append(mythread)
     mythread.start ()

     return request.query_string


@app.route('/getresult')
def getresult ():
    if q.empty ():
        return ""
    else:
        item = q.get ()
        q.task_done()
        return item


if __name__ == '__main__':
    app.run()
