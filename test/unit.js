const path = require('path');
const fs = require('fs')
const { test } = require('tap')

const posthtml = require('posthtml')
const w3c = require('../index');

const goodHtml = fs.readFileSync(path.join(__dirname,'good.html'), 'utf-8')

test('emits approval of good html', async (t) => {
  const { messages } = await posthtml([ w3c() ]).process(goodHtml);
  t.equal(messages.length, 1, 'exactly one message');
  t.same(messages[0], {
    from: 'posthtml-w3c',
    errors: false,
    validationMessages: []
  });
  t.end();
});

test('emits nothing if html is good and hideEmpty: true', async (t) => {
  t.plan(1);
  const result = await posthtml([ w3c({ hideEmpty: true }) ]).process(goodHtml);
  t.ok(result);
  t.notOk(result.messages);
});
