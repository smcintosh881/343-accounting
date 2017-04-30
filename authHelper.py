from flask import session, render_template
from functools import wraps

def verify_token(token):
    """
    Verify that passed in token is a valid Google OAUTH token in the system
    :param token: token to verify
    :return: True if token valid, False otherwise
    """
    # TODO: verify token with HR server when that API is complete, for now return True
    return True


def login_user(token):
    session['token'] = token


def logout_user():
    session.pop('token', None)


def get_current_user():
    return session['token'] if 'token' in session else None


# http://flask.pocoo.org/docs/0.12/patterns/viewdecorators/
def login_required(f):
    """
    Mark a view to only be accessable if the user is logged in
    :param f: the view function
    :return: the view function result if user is logged in, else redirect to login
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if get_current_user() is None:
            return render_template('loginRequired.html')
        else:
            return f(*args, **kwargs)
    return decorated_function
