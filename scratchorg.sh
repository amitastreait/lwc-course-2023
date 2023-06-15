while [ ! -n "$ORG_NAME"  ] 
do
	echo "❓ Please enter a name for your scratch org: "
	read ORG_NAME
done

while [ ! -n "$ORG_DAYS"  ] 
do
	echo "❓ Please enter the no of days for your scratch org: "
	read ORG_DAYS
done

echo "🔄 Building your org, please wait..."

# sfdx force:org:create -f config/project-scratch-def.json -a ${ORG_NAME} -s -d 21
sfdx force:org:create -f config/project-scratch-def.json --setalias ${ORG_NAME} --durationdays 30 --setdefaultusername

if [ "$?" = "1" ] 
then
	echo "❌ Can't create your org."
	exit
fi

echo "✅ Scratch org created. \n"

echo "🔄 Pushing the code, please wait. It may take a while."

sfdx force:source:push -u ${ORG_NAME}

if [ "$?" = "1" ]
then 
	echo "❌ Can't push your source."
	exit 
fi

echo "✅ Code pushed successfully. \n"

sfdx force:org:open -u ${ORG_NAME}