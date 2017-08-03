var chai = require('chai');
var base = new (require('automation-base-utils/utilityMethods.js'));
var searchPage = new (require('automation-google/pages/googleSearch.js'));
var resultsPage = new (require('automation-google/pages/googleResults.js'));
var until = protractor.ExpectedConditions;

describe("### Test: This is a test of Google Search ###", function () {

  before(function () {
  });

  it('Log in and Set Globals', function (){
    browser.ignoreSynchronization = true;
  });

  //it's possible to pick up orphaned lifesketches in our test environments.
  it ('Go to the Search Page', function () {
    searchPage.visitGoogleSearch();
    base.wait(until.visibilityOf(searchPage.getSearchBox()), null, "The Google Search Page didn't display.");
  });

  it ("Search for the String", function () {
    var searchString = "1930 Ford Model A";

    searchPage.getSearchBox().sendKeys(searchString);

    base.click(searchPage.getSearchButton(), null, "Google Search Button.");
    base.wait(until.visibilityOf(resultsPage.getSearchResult()), null, "Google Results Pge didn't show.");

    //TODO -- I am only doing this:
    resultsPage.getSearchResult().getText().then( function(text) {
      if (text.indexOf("Ford") > -1) {
        console.log ("WE PASS");
      } else {
        chai.assert.fail(null, null, "Oh, boo hoo!");
      }
    });

    //TODO -- Because I broke this:
    //chai.expect(resultsPage.getSearchResult().getText()).to.eventually.contain("Ford");
  });
});