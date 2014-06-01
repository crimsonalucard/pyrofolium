pyrofolium
==========

my home page/portfolio

Quick and dirty build and deploy instructions:

make sure you have nodejs, npm and grunt installed.

then with the project folder as your working directory run:

```shell
npm install -d
grunt build
```
The resulting build will be located in a folder called deploy. 
If you would like to deploy on an ftp server you will need to edit the Gruntfile.js at around line 60: 

```js
		'ftp-deploy': {
			deployment:{
				auth:	{
							host:'pyrofolium.com',
							port: 21,
							authKey: 'key1'
						},
				src:'deploy/',
				dest: 'pyrofolium.com/'
			}
		}
```

edit your host and port to be what you need and for your user name and password create a file in the top level directory called .ftppass then format it it like this:

```js
  {
    "key1":{
        "username":"yourusername",
        "password":"yourpassword"
    }
}
```

then run run the command below in your favorite shell:

```shell
  grunt deploy
```

the mobile version of the site is simple template generated by yeoman so it follows the prebuilt deployment procedures given by the generator. you will need to go into the mobile/ directory and type the following commands respectively to build or to deploy:

```shell
	grunt build
	grunt deploy
```

deployment of mobile follows the same procdures as the original non-mobile version of the site... You will need to setup your host in Gruntfile.js and also setup your ftp credentials in .ftppass

Make sure you keep the mobile version of the site in the same place as the desktop version will redirect upon detecting a mobile browser. 
