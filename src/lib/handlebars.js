const { format } = require('timeago.js');
const Handlebars = require("handlebars");

Handlebars.registerHelper("isNull", (value) => {
    return value === null;
  });

const helpers = {};

helpers.timeago = (timestamp) => {
    return format(timestamp);
};

module.exports = helpers;