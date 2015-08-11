# chrome-extension-auto-publish
Gulp script to publish changes of chrome extension to chrome web store

Script uses tasks:
* clean - deleting ZIP archive with extension;
* update_version - updating manifest.json version's last integer part (1.2.3 > 1.2.4, 1.2 > 1.3);
* pack - creating new ZIP archive with extension. Task uses 7Zip utility on windows platform to make ZIP with defined pathes. You can change it for your needs;
* deploy - sending ZIP to chrome web store and publish it;
* publish - calling in sequence tasks clean, update_version, pack and deploy.

How to create OAuth credentials see [docs](https://developer.chrome.com/webstore/using_webstore_api)

Warning! You can't change met-data of your web store chrome extension via API, this allowed only through your [chrome web store dashboard](https://chrome.google.com/webstore/developer/dashboard).
