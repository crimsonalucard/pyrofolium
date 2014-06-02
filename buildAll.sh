if [ -z "$1" ]
	then
		echo "Please supply commit message as an argument."
		exit 1
fi
git commit -am $1
#git pull origin master
#git push origin master
#grunt deploy
#cd mobile
#grunt deploy
#cd ..

