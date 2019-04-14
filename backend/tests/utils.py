CORRECT_USERNAME_1 = '...Mike_Cernovich.'
CORRECT_USERNAME_2 = 'Mia'

INCORRECT_USERNAME_SHORT = ''
INCORRECT_USERNAME_LONG = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
INCORRECT_USERNAME_RESTRICTED_CHARACTERS = 'abc!a'

CORRECT_EMAIL_1 = 'e.Mail@e.su'
CORRECT_EMAIL_2 = 'qqs.pf23.ad@john.pz'

INCORRECT_EMAIL_RESTRICTED_CHARACTERS = 'почта\_0_/@yahoo.com'
INCORRECT_EMAIL_NO_AT = 'sometext.com'

CORRECT_PASSWORD_1 = 'password'
CORRECT_PASSWORD_2 = 'ajsdlkaSKDN'

INCORRECT_PASSWORD_SHORT = ''
INCORRECT_PASSWORD_LONG = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'


def create_user(client, username, email, password):
    req_json = {
        'username': username,
        'email': email,
        'password': password
    }
    return client.post('/api/users', json=req_json)


def login(client, username, email, password):
    req_json = {}

    if username is not None:
        req_json['username'] = username

    if email is not None:
        req_json['email'] = email

    if password is not None:
        req_json['password'] = password

    return client.post('/api/login', json=req_json)
