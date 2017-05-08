# 343-accounting
The accounting team repo for SWEN-343
hosted on vm currently at:
    
    http://vm343e.se.rit.edu
    http://accounting.krutz.site

# Verions
    Python2.7

# Getting Started

navigate to the top layer of the project containing server.py

    find the python path:
        which python.2.7

    run the commands to start virtual environment:
        virtualenv -p /usr/bin/python2.7 venv 
        source venv/bin/activate

    run this command to install the deps:
        sh install.sh

    run this command to build data base:
        sh build_db.sh

    run this command to run server
        python2.7 server.py

Next cd into accounting/ folder and run
        npm run start

The project can be found at http://localhost:3000

Webpack server configuration is used to map the two services to port 3000

VM works by running virtualenv and using uwsgi and gnix
    https://www.digitalocean.com/community/tutorials/how-to-serve-flask-applications-with-uwsgi-and-nginx-on-ubuntu-14-04


