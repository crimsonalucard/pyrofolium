pyrofolium
==========

my home page/portfolio

Quick and dirty build and deploy instructions:

make sure you have nodejs, npm and grunt installed.

then with the project folder as your working directory run:

'''shell
npm install -d
grunt build
'''

If you would like to deploy on an ftp server you will need to edit the Gruntfile.js at around line 60: 

'''js
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
'''

edit your host and port to be what you need and for your user name and password create a file in the top level directory called .ftppass then format it it like this:

'''js
  {
    "key1":{
        "username":"yourusername",
        "password":"yourpassword"
    }
}
'''

then run run the command below in your favorite shell:

'''shell
  grunt deploy
'''



The mobile version of the site uses seperate deployment procedures. 

 
