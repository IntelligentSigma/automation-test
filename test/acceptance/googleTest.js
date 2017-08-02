var wd = require('wd'),
    expect = require('expect.js');

var exports = module.exports = function treeNotesTest() {};

exports.allTests = function(conf, cap, capText) {
  var timeout = 10000; //Wait 10 seconds for actions to work.

  var setUp = function(cb, name) {
    var browser = wd.promiseRemote(conf.host, conf.port, conf.username, conf.accessKey),
        USER = 'jtestsauce',
        PASS = 'ducksRule44';

    if (typeof name !== 'undefined') {
      name = name.replace(capText, '');
      cap['name'] = name;
    }

    browser
      .on('status', function(info) {
        console.log('\x1b[36m%s\x1b[0m', info);
      })
      .on('command', function(meth, path, data) {
        console.log(' > \x1b[33m%s\x1b[0m: %s', meth, path, data || '');
      });

    browser.init(cap)
      .then(function() {
        console.log(' > \x1b[36m%s\x1b[0m', name);
        console.log(' > \x1b[36m%s\x1b[0m', cap.browserName);

        return browser.get("http://fs-tree-notes-build.herokuapp.com/?entityId=LHGW-QB7&type=person");
      }).then(function() {
        return browser.elementByCss('#userName');
      }).then(function(userNameInput) {
        return browser.type(userNameInput, USER);
      }).then(function() {
        return browser.elementByCss('#password');
      }).then(function(passwordInput) {
        return browser.type(passwordInput, PASS);
      }).then(function() {
        return browser.elementByCss('#login');
      }).then(function(loginButton) {
        return browser.clickElement(loginButton);
      }).then(function() {
        return browser.waitForElement('css selector', '.notes-control .add-note', timeout);
      }).then(function() {
        cb(browser);
      });

  };

  var allTests = {

    'Add a note, edit it, then delete the note': {
      topic: function() {
        var that = this;
        var cb;
        var noteId;
        var noteTitle = "Title of the Note";
        var noteText = "Here's a note.";
        var editTitle = "Edited title of the Note";
        var editText = "Here's a note that has been edited.";
        setUp(function(browser) {

          browser.elementByCssSelector('.notes-control .add-note')
            .then(function(addNoteLink) {
              return browser.clickElement(addNoteLink);
            }).then(function() {
              return browser.elementByCssSelector('.notes-control .add .title');
            }).then(function(titleInput) {
              return browser.type(titleInput, noteTitle);
            }).then(function() {
              return browser.elementByCssSelector('.notes-control .add .text');
            }).then(function(textInput) {
              return browser.type(textInput, noteText);
            }).then(function() {
              return browser.elementByCssSelector('.notes-control .add .save');
            }).then(function(saveButton) {
              return browser.clickElement(saveButton);
            }).then(function() {
              return browser.waitForElement('css selector', '.notes-control .expanded .text', timeout);
            }).then(function() {
              return browser.elementByCssSelector('.notes-control .expanded');
            }).then(function(noteContainer) {
              return browser.getAttribute(noteContainer, 'id');
            }).then(function(noteContainerId) {
              noteId = noteContainerId;
              return browser.elementByCssSelector('.notes-control .expanded .text');
            }).then(function(textElement) {
              return browser.text(textElement);
            }).then(function(text) {
              console.log("text = " + text);
              expect(noteText).to.equal(text);
              return browser.elementByCssSelector('.notes-control .expanded .title');
            }).then(function(titleElement) {
              return browser.text(titleElement);
            }).then(function(title) {
              console.log('title = ' + title);
              expect(noteTitle).to.equal(title);
              return browser.elementByCssSelector('.notes-control .expanded .edit-link');
            }).then(function(editNoteLink) {
              return browser.clickElement(editNoteLink);
            }).then(function() {
              return browser.elementByCssSelector('.notes-control .edit .title');
            }).then(function(titleInput) {
              return titleInput.clear();
            }).then(function() {
              return browser.elementByCssSelector('.notes-control .edit .title');
            }).then(function(titleInput) {
              return browser.type(titleInput, editTitle);
            }).then(function() {
              return browser.elementByCssSelector('.notes-control .edit .text');
            }).then(function(textInput) {
              return browser.clear(textInput);
            }).then(function() {
              return browser.elementByCssSelector('.notes-control .edit .text');
            }).then(function(textInput) {
              return browser.type(textInput, editText);
            }).then(function() {
              return browser.elementByCssSelector('.notes-control .edit .save');
            }).then(function(saveButton) {
              return browser.clickElement(saveButton);
            }).then(function() {
              return browser.waitForElement('css selector', '.notes-control .expanded .text', timeout);
            }).then(function() {
              return browser.elementByCssSelector('.notes-control .expanded .text');
            }).then(function(textElement) {
              return browser.text(textElement);
            }).then(function(text) {
              console.log("text = " + text);
              expect(editText).to.equal(text);
              return browser.elementByCssSelector('.notes-control .expanded .title');
            }).then(function(titleElement) {
              return browser.text(titleElement);
            }).then(function(title) {
              console.log('title = ' + title);
              expect(editTitle).to.equal(title);
              return browser.elementByCssSelector('.notes-control .expanded .delete-link');
            }).then(function(deleteLink) {
              return browser.clickElement(deleteLink);
            }).then(function() {
              return browser.waitForElement('css selector', '#delete-note-dialog-person .delete', timeout);
            }).then(function() {
              return browser.elementByCssSelector('#delete-note-dialog-person .delete');
            }).then(function(deleteButton) {
              return browser.clickElement(deleteButton);
            }).then(function() {
              var condition = '$("#' + noteId + '").size() === 0';
              console.log("**************" + condition);
              return browser.waitForCondition(condition, timeout);
            }).fail(function(error) {
              that.callback(error);
            }).done(function() {
              that.callback();
            }).fin(function() {
              browser.quit();
            });


        }, this.context.name);
      },
      '': function(err, text) {
        if (err) {
          throw new Error(err);
        }
      }
    }

  };

  return allTests;
};
