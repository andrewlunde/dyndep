/*eslint no-console: 0*/
"use strict";

var xsenv = require("@sap/xsenv");
var xssec = require("@sap/xssec");
var hdbext = require("@sap/hdbext");
//var auditLogging = require('@sap/audit-logging');
var createInstanceManager = require("@sap/instance-manager").create;
var express = require("express");
var passport = require("passport");
var stringifyObj = require("stringify-object");
var bodyParser = require("body-parser");

const { inspect } = require('util');

var app = express();

var server = require("http").createServer();
var port = process.env.PORT || 3000;

xsenv.loadEnv();
var credentials = xsenv.getServices({ auditlog: 'DYNDEP_LOG' }).auditlog;
var auditLog = require('@sap/audit-logging')(credentials);

const deployers = process.env.deployers;


const hdi_dynamic_deploy_user = process.env.hdi_dynamic_deploy_user;
const hdi_dynamic_deploy_password = process.env.hdi_dynamic_deploy_password;

var g_instmgr;

const services = xsenv.getServices({
    instancemanager: { tag: 'xsa-instancemanager' }
});

createInstanceManager(services.instancemanager, function (err, instmgr) {
  if (err) {
    console.log('Create instance manager error:', err.message);
  }
  else {
    console.log('Create instance manager OK:');
	g_instmgr = instmgr;
  }
});

auditLog.securityMessage('srv module starting')
  .by('System')
  .externalIP('127.0.0.1')
  .tenant('tenantId')
  .log(function (err) {
	console.log("AuditLog:" + inspect(err,false,1));
  });

app.get("/", function (req, res) {

	var responseStr = "";
	responseStr += "<!DOCTYPE HTML><html><head><title>ConcileTime</title></head><body><h1>dyndep-srv</h1><h2>SUCCESS!</h2><br />";
	responseStr += "<a href=\"/node/links\">The Links page.</a><br />";
	responseStr += "<a href=\"/\">Return to home page.</a><br />";
	responseStr += "</body></html>";
	res.status(200).send(responseStr);
});

app.get("/node", function (req, res) {

	var responseStr = "";
	responseStr += "<!DOCTYPE HTML><html><head><title>ConcileTime</title></head><body><h1>dyndep-srv</h1><h2>SUCCESS!</h2><br />";
	responseStr += "<a href=\"/node/links\">The Links page.</a><br />";
	responseStr += "<a href=\"/\">Return to home page.</a><br />";
	responseStr += "</body></html>";
	res.status(200).send(responseStr);
});

app.get("/node/links", function (req, res) {

	var responseStr = "";
	responseStr += "<!DOCTYPE HTML><html><head><title>ConcileTime</title></head><body><h1>dyndep-srv</h1><h2>SUCCESS!</h2><br />";
	responseStr += "<a href=\"/node/instance_get_all\">Get All Instances</a><br />";
	responseStr += "<a href=\"/node/instance_create?client=abc\">Create Instance ABC</a><br />";
	responseStr += "<a href=\"/node/instance_get?client=abc\">Get Instance ABC</a><br />";
	responseStr += "<a href=\"/node/instance_delete?client=abc\">Delete Instance ABC</a><br />";
	responseStr += "<a href=\"/node/instance_deploy?client=abc&deployer=dyn1\">Deploy DYN1 to ABC</a><br />";
	responseStr += "<a href=\"/node/instance_deploy?client=abc&deployer=dyn2\">Deploy DYN2 to ABC</a><br />";
	responseStr += "<a href=\"/node/links\">Back to Links page.</a><br />";
	responseStr += "<a href=\"/\">Return to home page.</a><br />";
	responseStr += "</body></html>";
	res.status(200).send(responseStr);
});

app.get("/node/instance_get_all", function (req, res) {

	var responseStr = "";
	responseStr += "<!DOCTYPE HTML><html><head><title>Get All Instances</title></head><body><h1>Get All Instances</h1><h2>SUCCESS!</h2><br />";

	g_instmgr.getAll(function (err, instances) {
		if (err) {
			responseStr += err.message + "<br />";
			responseStr += "</body></html>";
			res.status(200).send(responseStr);
			return console.log('Get error:', err.message);
		}
		else {
			responseStr += inspect(instances,false,1) + "<br />";
			responseStr += "</body></html>";
			res.status(200).send(responseStr);
			return console.log('Instances:', inspect(instances,false,1));
		}
	});
	
});

app.get("/node/instance_create", function (req, res) {

	var responseStr = "";
	responseStr += "<!DOCTYPE HTML><html><head><title>Create Instance</title></head><body><h1>Create Instance</h1><h2>SUCCESS!</h2><br />";

	// https://www.npmjs.com/package/@sap/instance-manager
	// optionalParameters | Object | (optional) 
	// JSON object with parameters for provisioning or binding, as would be done with the -c options of the CLI commands create-service and bind-service for unmanaged services. E.g.
	//{
	//  "provisioning_parameters": { "database_id" : "<HANA Tenant DB Guid or Name>" },
	//  "binding_parameters": {"<key>" : "<value>"}
	//}

	var optionalParameters = {
		/* Optional JSON object containing service-specific configuration parameters */
		"provisioning_parameters": { },
		"binding_parameters": { }
	  };
	
	g_instmgr.create(req.query.client, optionalParameters, function (err, instance) {
		if (err) {
			responseStr += err.message + "<br />";
			responseStr += "</body></html>";
			res.status(200).send(responseStr);
			return console.log('Get error:', err.message);
		}
		else {
			responseStr += inspect(instance,false,1) + "<br />";
			responseStr += "</body></html>";
			res.status(200).send(responseStr);
			return console.log('Instances:', inspect(instance,false,1));
		}
	});
	
});

app.get("/node/instance_get", function (req, res) {

	var responseStr = "";
	responseStr += "<!DOCTYPE HTML><html><head><title>Get Instance</title></head><body><h1>Get Instance</h1><h2>SUCCESS!</h2><br />";

	g_instmgr.get(req.query.client, function (err, instance) {
		if (err) {
			responseStr += err.message + "<br />";
			responseStr += "</body></html>";
			res.status(200).send(responseStr);
			return console.log('Get error:', err.message);
		}
		else {
			responseStr += inspect(instance,false,1) + "<br />";
			responseStr += "</body></html>";
			res.status(200).send(responseStr);
			return console.log('Instances:', inspect(instance,false,1));
		}
	});
	
});

app.get("/node/instance_delete", function (req, res) {

	var responseStr = "";
	responseStr += "<!DOCTYPE HTML><html><head><title>Delete Instance</title></head><body><h1>Delete Instance</h1><h2>SUCCESS!</h2><br />";

	g_instmgr.delete(req.query.client, function (err, instance) {
		if (err) {
			responseStr += err.message + "<br />";
			responseStr += "</body></html>";
			res.status(200).send(responseStr);
			return console.log('Get error:', err.message);
		}
		else {
			responseStr += inspect(instance,false,1) + "<br />";
			responseStr += "</body></html>";
			res.status(200).send(responseStr);
			return console.log('Instances:', inspect(instance,false,1));
		}
	});
	
});

app.get("/node/instance_deploy", function (req, res) {

	var responseStr = "";
	responseStr += "<!DOCTYPE HTML><html><head><title>Deploy Instance</title></head><body><h1>Deploy Instance</h1><h2>SUCCESS!</h2><br />";

// https://hxe45p.lcfx.net:51056/v1/deploy
/*
	{
		"TARGET_CONTAINER": "DYNDEP_HDI1",
		"DEPLOY_ID": "DEPLOY_ME11",
		"APPLICATION_VERSION_INFO": "MyVersionInfo",
		"VCAP_SERVICES" : {
		  "hana" : [ {
			"name" : "DYNDEP_HDI1",
			"label" : "hana",
			"tags" : [ "hana", "database", "relational" ],
			"plan" : "hdi-shared",
			"credentials" : {
		"schema" : "F6C052910F804685AC3333547095C00E",
		"hdi_password" : "Ub5qdCvuhJvJLzsVJq5vNS2bvXTiznTXS2yRvCEUDCtQVSZHXcgnMNDPO.Triqjt-DfG2z2LmgyqDwJ5A16S7IPvhKD_OvrzlZDm5IJE6YDbG7Uf3280V23rBtUvnizN",
		"tenant_name" : "SYSTEMDB",
		"password" : "Tw22FEqZONTxVEqA.nVG5-a-iOpclJx_2-tVgYT7kyYEUkleKIk15f1wG0u.F5nqjDh_tKko6AO2UjDFV4qOyMKjsCYjkg7MyrQW.odspg5xB6paxNbmANwgn6GdKKCU",
		"driver" : "com.sap.db.jdbc.Driver",
		"port" : "30013",
		"encrypt" : false,
		"db_hosts" : [ {
		  "port" : 30013,
		  "host" : "hxe45p.lcfx.net"
		} ],
		"host" : "hxe45p.lcfx.net",
		"hdi_user" : "F6C052910F804685AC3333547095C00E_EXYD47A7W0T6IF00AJR92PMDK_DT",
		"user" : "F6C052910F804685AC3333547095C00E_EXYD47A7W0T6IF00AJR92PMDK_RT",
		"url" : "jdbc:sap://hxe45p.lcfx.net:30013/?currentschema=F6C052910F804685AC3333547095C00E"
	  }
		  } ]
		}
	  }
*/


	responseStr += "<pre>\n" + "hdi_dynamic_deploy_user: " + hdi_dynamic_deploy_user + "\n</pre>\n" + "<br />";
	responseStr += "<pre>\n" + "hdi_dynamic_deploy_password: " + hdi_dynamic_deploy_password + "\n</pre>\n" + "<br />";

	responseStr += "<pre>\n" + inspect(deployers,false,2) + "\n</pre>\n" + "<br />";
	responseStr += "</body></html>";
	res.status(200).send(responseStr);
	return console.log('Get error:', err.message);
	
});


server.on("request", app);

server.listen(port, function () {
	console.info("Backend: " + server.address().port);
});
