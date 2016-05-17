from flask import Flask
from flask.ext.mail import Mail
from peewee import *
import sys
import os

cwd = os.getcwd()
print(sys.argv)
frontend_dest = os.path.join( cwd, 'frontend\\' )
purs_frontend_dest = "C:\\Users\\Dito\\Desktop\\stuff\\git\\Fusky\\front-ps";
print(cwd)
print(frontend_dest)

if "ps" in sys.argv:
    app = Flask( __name__, static_url_path = '', static_folder = purs_frontend_dest )
    print("purescript front static")
else:
    app = Flask( __name__, static_url_path = '', static_folder = frontend_dest )
    print("frontend\\ static")

app.config.from_object( 'config' )
mail = Mail( app )

db = SqliteDatabase( app.config[ 'DATABASE' ], threadlocals = True )

from app.views import *
