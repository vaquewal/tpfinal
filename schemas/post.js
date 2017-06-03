var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = Schema({
    title: String,
    path: String
});

module.exports = mongoose.model('post', PostSchema);
