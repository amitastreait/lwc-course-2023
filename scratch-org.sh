#!/bin/sh
PACKAGE_ID=YOUR_PACKAGE_ID
PERMSET_NAME=System_Event_Permission_Set
PERMGROUP_NAME=Scratch_Org_Demo

# ScratchOrgPermissionsGroup
# ScratchOrg


while [ ! -n "$ORG_NAME"  ] 
do
	echo "❓ Please enter a name for your scratch org: "
	read ORG_NAME
done

while [ ! -n "$USER_NAME"  ] 
do
	echo "❓ Please enter a username for your scratch org:"
	read USER_NAME
done

echo "🔄 Building your org, please wait..."
#sfdx force:org:create -d 21 -s -t sandbox -f ./config/project-scratch.json -a ${ORG_NAME} username=${USER_NAME}
#sfdx force:org:create -d 21 -s -t sandbox -f ./config/project-scratch.json -a jai-demo -u=testuser1@mycompany.org.jai
sfdx force:org:create -f config/project-scratch.json -a ${ORG_NAME} -s -d 21 #-t sandbox

if [ "$?" = "1" ] 
then
	echo "❌ Can't create your org."
	exit
fi

echo "✅ Scratch org created. \n"
echo "🔄 Installing package with ID ${PACKAGE_ID}, please wait"

RES=`sfdx force:package:install --package ${PACKAGE_ID} -u ${ORG_NAME} --installationkey test1234 --wait 10 --publishwait 10 --json`

if [ "$?" = "1" ] 
then
	echo "❌ Can't install this package."
	exit
fi

INSTALL_ID=`echo ${RES} | egrep -o '"Id":"(.*?)"' | cut -d : -f 2 | tr -d '"'`
echo "🔄 Package install in progress, please wait."

STATUS=init
while [ $STATUS != 'SUCCESS' ]
do
	RES=`sfdx force:package:install:report -i ${INSTALL_ID} -u ${ORG_NAME} --json`
	STATUS=`echo ${RES} | egrep -o '"Status":".*?"' | cut -d : -f 2 | tr -d '"' `
	echo "🔄  Install status is ${STATUS}. Please wait."
	sleep 10
done

echo "✅ Package Install Success!. \n"

echo "🔄 Pushing the code, please wait. It may take a while."

sfdx force:source:push -u ${ORG_NAME}

if [ "$?" = "1" ]
then 
	echo "❌ Can't push your source."
	exit 
fi

echo "✅ Code pushed successfully. \n"
echo "🔄 Assigning Permission Set ${PERMSET_NAME} to your org, please wait."

sfdx force:user:permset:assign -n ${PERMGROUP_NAME} -u ${ORG_NAME} --json

# sfdx force:user:permset:assign -n Scratch_Org_Demo -u b2b --json

if [ "$?" = "1" ]
then
	echo "❌ Can't assign the permission set."
	exit 
fi	

echo "✅ Permission set is assigned successfully. \n"

echo "🔄 Generating the password for your scratch org, please wait."

sfdx force:user:password:generate -u ${ORG_NAME}

if [ "$?" = "1" ]
then 
	echo "❌ Can't generate password."
	exit 
fi

echo "✅ Password has been generated! \n"

echo "🔄 Importing data to your scratch org, please wait."

#sfdx force:data:tree:import --sobjecttreefiles data/Account.json -u=${ORG_NAME}
sfdx force:data:tree:import -p ./data/data-plan.json -u=${ORG_NAME}

if [ "$?" = "1" ]
then 
	echo "❌ Can't generate password."
	exit 
fi

sfdx force:user:display --targetusername ${ORG_NAME}

sfdx force:org:open -u ${ORG_NAME}