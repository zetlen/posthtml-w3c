// ------------------------------------
// #POSTHTML - W3C
// ------------------------------------

'use strict'

const chalk = require('chalk')
const tab = require('text-table')
const log = require('log-symbols')

const render = require('posthtml-render')
const w3c = require('w3cjs')

const title = require('./lib/title')
const type = require('./lib/type')
const line = require('./lib/line')
const message = require('./lib/msg')

exports = module.exports = function (options) {
  options = options || {}
  options.filter = options.filter || [];

  return function postHTMLValidate (tree) {

    return new Promise(resolve => {

      w3c.validate({
        input: render(tree),
        output: 'json',
        callback: function (err, res) {

          const report = {
            from: 'posthtml-w3c',
            validationMessages: res.messages
          };

          if (!res.messages || res.messages.length === 0 && !options.hideEmpty) {
            tree.messages.push({
              ...report,
              errors: false
            })
            return resolve(tree);
          }

          if (options.filter.length > 0) {
            report.messages = res.messages
            .filter(msg => !options.filter.some(s => msg.message.includes(s)))
          }
        }
      })

    })
  }
}
