__author__ = 'ccai'

import os
import sys
from urllib2 import Request, urlopen, URLError
import json
from scapy.all import *
import threading
import Queue
import socket

class pingThread (threading.Thread):
    def __init__(self, name, q):
        threading.Thread.__init__(self)
        self.name = name
        self.q = q

    def run(self):
        print "Starting " + self.name
        self.DoPing (self.name, self.q)
        print "Exiting " + self.name

    def DoPing (self,hostname,rq):
        hostip = socket.gethostbyname(hostname)
        for i in range(1, 20):
            pkt = IP(dst=hostip, ttl=i) / TCP(dport=80,sport=12010,flags="S")
            reply = sr1(pkt, verbose=0,timeout=1,retry=3)

            if (reply is not None):
                hostinfo = GetHostInfo (reply.src)

                if (len(hostinfo) > 0):
                    if (reply.ack == 1):
                        hostinfo['last'] = True
                    if (i == 19):
                        hostinfo['last'] = True
                    rq.put (json.dumps (hostinfo))
                if (reply.ack == 1):
                   # We've reached our destination
                   print "Done!", hostinfo
                   break
                else:
                   # We're in the middle somewhere
                   print "%d hops away: " % i , hostinfo
            else:
                print "%d hops has no response" %i



def GetResource (ipaddress):
    try:
        request = "http://ipinfo.io/%s/json"%ipaddress
        response = urlopen(request)
        return response.read()
    except URLError:
        print 'Not able to get the service.'


def GetHostInfo (ipaddress):
    ipinfo = json.loads (GetResource(ipaddress))
    asn="N/A"
    loc="N/A"
    name="N/A"

    if (ipinfo.get('org')):
        asn = ipinfo['org']
    if (ipinfo.get('loc')):
        loc = ipinfo['loc']
    if (ipinfo.get('hostname')):
        name = ipinfo['hostname']

    result = loc.split (',')
    if (len(result) >1):
        myipinfo = {}
        myipinfo['ipaddress'] = ipaddress
        myipinfo['hostname'] = name
        myipinfo['asn'] = asn
        myipinfo['loc_lat'] = result[0]
        myipinfo['loc_long'] = result[1]
        myipinfo['last'] = False
        return myipinfo
    else:
        return ""


if __name__ == "__main__":
    if len(sys.argv) <= 1:
       print "Usage: %s <Host Name>" % sys.argv[0]
       sys.exit(1)
    q = Queue.Queue()
    mythread = pingThread (sys.argv[1], q)
    mythread.start ()
    mythread.join ()



