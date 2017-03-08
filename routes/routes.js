var express = require('express');
var app = express();
var router = express.Router();

var path = require("path");

var getCallbackHandleForRequest = require("../common/getCallbackHandleForRequest.js");

module.exports = function() {

	router.get('/Table/Data', getCallbackHandleForRequest("GET"));

	router.post('/test', function(req, res) {
	    res.json({
	        message: "success"
	    });
	});

	router.post('/server/captcha', getCallbackHandleForRequest("POST"));

	router.post('/Eater/Login/Mobile', getCallbackHandleForRequest("POST"));

	router.post('/Order/Add', getCallbackHandleForRequest("POST"));

	router.post('/Membership/Card/Charge', function(req, res) {
		res.json({
			message:"success"
		})
	});

	router.post('/Eater/Like/Dinner/:id', getCallbackHandleForRequest("POST"));

	router.get('/Table/Member', getCallbackHandleForRequest("GET"));

	router.get('/Table/Limit', getCallbackHandleForRequest("GET"));

	router.get('/Table/Coupon', getCallbackHandleForRequest("GET"));

	router.get('/Table/Dinner', getCallbackHandleForRequest("GET"));

	router.get('/api/Table/Member', getCallbackHandleForRequest("GET"));
	router.get('/api/Table/Limit', getCallbackHandleForRequest("GET"));
	router.get('/api/Table/Dinner', getCallbackHandleForRequest("GET"));

	router.get('/api/order/query', getCallbackHandleForRequest("GET"));

	router.post('/Coupon/Add', getCallbackHandleForRequest("POST"));

	router.post('/Table/Service', getCallbackHandleForRequest("POST"));

	router.post('/Coupon/Add/Afterpay/:couponId', getCallbackHandleForRequest("POST"));

	router.get('/Coupon/Add/:couponId', getCallbackHandleForRequest("GET"));


	return router;
};