module.exports = {
    'facebookAuth' : {
        'clientID'      : '587671868455448',
        'clientSecret'  : '362ff086876b0fd1b602fc590678a1c8',
        'callbackURL'     : 'http://localhost:4000/api/auth/facebook/callback',
        'profileURL': 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email'

    },

    'googleAuth' : {
        'clientID'         : '319564492744-2ru52agvo1m159qn3ccourk5u7n51lnc.apps.googleusercontent.com',
        'clientSecret'     : 'fG5oaDWIzVMfLpUBv_0YSzmC',
        'callbackURL'      : 'http://localhost:4000/auth/google/callback'
    }
};