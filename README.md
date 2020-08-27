# dyndep Application

Welcome to the dyndep project.

## Documentation

## Library Repo

https://www.npmjs.com/package/@sap/hdi-dynamic-deploy

It contains these folders and files, following the CAP recommended project layout:

File / Folder | Purpose
---------|----------
`README.md` | this getting started guide
`app/` | content for UI frontends go here
`db/` | your domain models and data go here
`srv/` | your service models and code go here
`mta.yaml` | project structure and relationships
`package.json` | project metadata and configuration
`.cdsrc.json` | hidden project configuration
`xs-security` | security profile configuration


## Next Steps...

- Open a new terminal and run  `cds watch`
- ( in VSCode simply choose _**Terminal** > Run Task > cds watch_ )
- Start adding content, e.g. a [db/schema.cds](db/schema.cds), ...


## Learn more...

Learn more at https://cap.cloud.sap/docs/get-started/

# XSA Build Command:
```
mbt build -p=xsa -t=mta_archives --mtar=dyndep_xsa.mtar
```

# XSA Deploy Command:
```
xs deploy mta_archives/dyndep_xsa.mtar -f
```

# XSA Subsequent Build+Deploy Commands:
```
mbt build -p=xsa -t=mta_archives --mtar=dyndep_xsa.mtar ; xs deploy mta_archives/dyndep_xsa.mtar -f
```

# XSA Undeploy Command:
```
xs undeploy dyndep -f --delete-services
```


# CF Build Command:
```
mbt build -p=cf -t=mta_archives --mtar=dyndep_cf.mtar
```

# CF Deploy Command:
```
cf deploy mta_archives/dyndep_cf.mtar -f
```

# CF Subsequent Build+Deploy Commands:
```
mbt build -p=cf -t=mta_archives --mtar=dyndep_cf.mtar ; cf deploy mta_archives/dyndep_cf.mtar -f
```

# CF Undeploy Command:
```
cf undeploy dyndep -f --delete-services
```
