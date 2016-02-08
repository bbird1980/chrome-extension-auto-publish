module.exports = {
	deploy: {
	    packageName: 'zipped_extension.zip',
	    packItems: ['manifest.json', 'images/*', 'js/*', 'options/*', 'popup/*', 'vendor/*'],
	    appID: '%APP_ID%',
	    OAuth: {
	        "client_secret":"%client_secret%",
	        "token_uri":"https://accounts.google.com/o/oauth2/token",
	        "client_id":"%client_id%",
	        "refresh_token":"%refresh_token%"
	    }
    }
};