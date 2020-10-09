const config = require("config");
const shortid = require("shortid");
const validUrl = require("valid-url");
const Url = require("../mongomodel/url");

class shortUrlController{
  static async readUrl(req,res){
    var shortUrlCode = req.params.shortUrl;
    var url = await Url.findOne({ urlCode: shortUrlCode });

    try {
        if (url) {
            var clickCount = url.clickCount;
            if(clickCount >= config.allowedClick){
                console.log("The click count for shortcode " + shortUrlCode + " has passed the limit of " + config.allowedClick);
                return res.status(400).json("The click count for shortcode " + shortUrlCode + " has passed the limit of " + config.allowedClick);
            }
            clickCount++;
            await url.update({ clickCount });
            return res.redirect(url.longUrl);
        } else {
            return res.status(400).json("The short url doesn't exists in our system.");
        }
    }
    catch (err) {
        console.error("Error while retrieving long url for shorturlcode " + shortUrlCode);
        return res.status(500).json("There is some internal error.");
    }
  }

  static async createUrl(req,res){
    const longUrl = req.body.longUrl;
    const baseUrl = config.get("baseURL");
      if(!validUrl.isUri(baseUrl)){
          return res.status(401).json("Internal error. Please come back later.");
      }
  
      const urlCode = shortid.generate();
  
      if(validUrl.isUri(longUrl)){
  
          try{
              var url = await Url.findOne({longUrl : longUrl});
              if(url){
                  return  res.status(200).json(url);
              }else{
  
                  const shortUrl = baseUrl + "/" + urlCode;
                  url  = new Url({
                      longUrl,
                      shortUrl,
                      urlCode,
                      clickCount: 0
                  });
                  
                  await url.save()
                  return res.status(201).json(url);
              }
          }catch(err){
              console.error(err.message);
              return res.status(500).json("Internal Server error " + err.message);
          }
      }else{
          res.status(400).json("Invalid URL. Please enter a vlaid url for shortening.");
      }    
  }
}

  
module.exports = shortUrlController;