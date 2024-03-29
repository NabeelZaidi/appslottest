import * as pulumi from "@pulumi/pulumi";
import * as azure from "@pulumi/azure-native";

const configmyapp = new pulumi.Config('myapp');
const config = new pulumi.Config('azure-native');
const location = config.require("location")
const resourceGroupName = configmyapp.require("resourceGroupName")
const appServicePlanName = configmyapp.require("appServicePlanName")
const webAppName = configmyapp.require("webAppName")
const slotName = configmyapp.require("slotName")


// resource group
const resourceGroup = new azure.resources.ResourceGroup(resourceGroupName, {
    location: location, 
    resourceGroupName: resourceGroupName
});

// app service plan
const appServicePlan = new azure.web.AppServicePlan(appServicePlanName, {
    name: appServicePlanName,
    kind: "Linux",
    reserved: true, // Mark as a Linux plan
    resourceGroupName: resourceGroup.name,
    location: resourceGroup.location,
    sku: {
        name: "S1",
        tier: "Standard",
    },
},
    {
        dependsOn: resourceGroup
    }
);

// webApp
const webApp = new azure.web.WebApp(webAppName, {
    name: webAppName,
    resourceGroupName: resourceGroup.name,
    location: resourceGroup.location,
    reserved: true, // Set to true for Linux apps
    serverFarmId: appServicePlan.id,
    siteConfig: {
        alwaysOn: true,
        linuxFxVersion: "PYTHON|3.11", // Change this to the desired Python version
    }
},
    {
        dependsOn: appServicePlan
    }
);


// initial slot
const slot = new azure.web.WebAppSlot("slot", {
    name: webApp.name,
    slot: slotName,
    location: resourceGroup.location,
    serverFarmId: appServicePlan.id,
    resourceGroupName: resourceGroup.name,
},
    {
        dependsOn: webApp
    }
);
