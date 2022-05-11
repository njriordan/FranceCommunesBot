# @FranceCommunes Bot
This repo contains the code used to create the twitter bot "Communes de France" [@FranceCommunes](https://twitter.com/FranceCommunes)

The bot used data from the French government API https://geo.api.gouv.fr/decoupage-administratif to retrieve geographic data for each commune, and then the Bing Imagery API to create the images associated with each commune.

The code is written in Javascript and deployed to an AWS lambda function that tweets a random commune once per hour. The infrastructure is deployed using Terraform, in the /deployment folder.