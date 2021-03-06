# Creating "Window Open" Notifications when AC is Running

For this automation I [[Create Switches That Trigger Notifications]].

## Setting up IFTTT

Create an IFTTT action that post to discord. This message can take variables. You can use the variables to reuse the IFTTT for multiple notification types. This makes it so that i can use a single IFTTT recipe for all of my window open notifications. I could extend this to send unique messages for windows open in all my rooms, if I wanted to I could even use it for each individual window!

![[CleanShot 2021-06-27 at 13.19.22@2x.png]]

## Setting up the Plugin

In the plugin settings I created a "Window Open Kitchen" switch. It sets `value1` to "Kitchen". 

![[CleanShot 2021-06-27 at 13.21.57@2x.png]]

Once you restart Homebridge you should create a room called "Messages" where your store all of these message switches. This way you wont accidentally press them while navigating your other rooms.

## Setting up the Automation

For creating these automations I wasn't able to create them directly in the Home App. This is another place where the more powerful automations enabled by the [Controller](https://controllerforhomekit.com) app is necessary.

First create an automation that triggers when the thermostat starts cooling or heating the house and the kitchen window is open. This turns on the "Window Open Kitchen" switch", triggering a message in the discord.

> NOTE: You might notice that there is a warning in this screen shot. This app can't control individual devices and only scenes. You could create scenes that turn on the message switches, but I didn't want the clutter. So i created the conditions for the trigger in Controller and set the devices in Home.

![[CleanShot 2021-06-27 at 13.31.15@2x.png]]

Then create an automation that triggers when a window is opened while the climate control is running.

![[CleanShot 2021-06-27 at 13.33.16@2x.png]]

The result is home automation with excellent [[HAUX]]! Everyone in the house now knows when a window is open and it shouldn't be :fire: