var expanderController = require('../controllers/expanderController.js');
var newsController = require('../controllers/newsController.js');
var watsonController = require('../watson/watsonController.js');
var indicoController = require('../indico/indicoController.js');
// const googleTrends = require('../trends/googleTrends');
// const aylien = require('../aylien/aylienController.js');
const googleLanguage = require('../googleLanguage/googleLanguageController.js');

module.exports = function (app, express) {

/*  This middlware builds the response object starting with the URL expansion
  and tacking on the successive API calls by calling the controllers' next()
  function.

  You'll likely want to improve upon this by creating different endpoints with
  different middleware pipes e.g. a pipe to just poll the blacklist, or a pipe
  just for talking to Watson and so forth.

*/
  app.post('/api', [expanderController.expandURL,
                    newsController.isFakeNews,
                    // watsonController.getTitle,
                    // watsonController.getKeywords,
                    // googleTrends.getGoogleTrends
                    ], function(req,res,next){
    res.json(res.compoundContent);
  });

  app.post('/api/ext', newsController.passExtensionData, 
    newsController.getFleschScore,
    newsController.isFakeNews,
    inidcoController.getPolitics,
    googleLanguage.analyzeSentiment, 
    watsonController.getEmotions, 
    function(req, res, next) {
      // console.log(res.compoundContent.article);
      console.log(res.compoundContent.flesch);
      console.log(res.compoundContent.sentiment);
      console.log(res.compoundContent.emotion);
      res.json(res.compoundContent);
  });

  // app.post('/apitest', watsonController.getTitle);
  // app.get('/api/googleTrends', googleTrends.getGoogleTrends);
  // app.get('/twitter', twitterSearch.getTweetsOnTopic);
};
