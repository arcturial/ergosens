# Ergosens POC

## Google Home Integration

Google provides multiple ways to integrate custom commands into your Google Assistant device. Three potential methods listed below.

### Dialogflow (used for my testing)

https://dialogflow.com/docs/getting-started/basics

Dialogflow is very easy to use and is focused around having a conversation with the user. It allows you to configure multiple "intents" and link these with backend webhooks to perform actions and return results (such as text, the next conversation to start etc). It's interface is quite easy to use and provides all the tools required for having natural conversations with the app (parameters, synonyms etc).

This is an example of an intent I configured to turn a qwikswitch device on and off.

https://raw.githubusercontent.com/arcturial/ergosens/master/media/intents.png

It includes a "context" section which essentially allows you to store state as a conversation progresses and use this state in other commands.

My suggestion is this integration should be used when you want more information from a user than just "on/off".

This type of integration can be published as an application, but comes with the drawback that you have to start a conversation with "Hey Google, talk to my [app]". This essentially intiates the dialog and from there it's a one-on-one conversation until it closes.

### Smart Home

I didn't attempt this integration as it was quite elaborate to implement. This seems like the ideal integration for a smart home, where devices can be registered and linked to certain rooms. I believe this exposes built in functionality for things like "turn bedroom lights on/off" and the "glue code" is the only thing that needs to be written. For this integration to work an oAuth server needs to be configured and I am not entirely sure yet how devices would register themselves.

Using this integration I believe you can get the shorthand version of "Hey Google, turn the bedroom lights on". Which is preferrable for IoT devices over "Hey Google, talk to my house and turn the lights on".

### IFTTT

This is an external service (If This Then That) that allows you to configure other external services (like Hue, Nest etc) to work with Google Home without having to write additional code. You are limited by the integrations they offer already and it adds a middle man into the mix. This will also need to be configured per integration being rolled out as it's linked to a specific Google account and cannot be published like an app.

## QwikSwitch

Using a GoogleHome Dialogflow integration and a Lambda hosted on AWS, I managed to successfully integrate with QwikSwitch via their API to manage their devices.

https://youtu.be/7dZdpZhvRQU


## Facial Recognition

TBC