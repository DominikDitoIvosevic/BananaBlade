from app import app
from app.views import *
import sys

port_specified = False

for arg in sys.argv:
    if arg.startswith("port="):
        port_specified = True
        print(arg)
        app.run( debug = True, port = int(arg[5:]))

if not port_specified:
    app.run( debug = True, port = 8000 )
