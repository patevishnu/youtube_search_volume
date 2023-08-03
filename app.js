const express = require('express');
const { google } = require('googleapis');
const app = express();
const bodyParser=require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));
// Replace 'YOUR_API_KEY' with the API key you obtained from the Google Developer Console
const API_KEY = 'AIzaSyDXFfE7XpvuCzc-etY7B8oC6bbVTHwhf_o';
const youtube = google.youtube({
  version: 'v3',
  auth: API_KEY,
});
app.get('/',function(req,res)
{
  res.sendFile(__dirname+'/index.html');
})
// Define the route to get the search volume for a keyword
app.post('/', async (req, res) => {

  const  keyword  = req.body.key;
  console.log(keyword);
  try {

    const response = await youtube.search.list({
      q: keyword,
      type: 'video',
      part: 'id',
      maxResults:100, // You can adjust this number based on your requirements
    });

    const response2=await youtube.search.list({
      q:keyword,
      type:'channel',
      part:'id',
      maxResults:100,
    });
    res.write('information about the channels related to keyword '+keyword);
    res.write('\n');
    res.write(response2.data.pageInfo.totalResults+' no of channels are present on the youtube related to '+keyword+'\n');

    res.write('\n');
    res.write('Channel Ids are\n')
    var count=0;
    for(let i=0;i<response2.data.items.length;i++)
    {
      count++;
      res.write('Id of the '+ i+1 +' chanel '+ response2.data.items[i].id.channelId+'\t');
      if(count==4)
      {
          res.write('\n');
          res.write('\n');
          count=0;
      }
    }
    res.write('\n\n');
    res.write('\n');
   res.write('information about the videos related to keyword '+ keyword+' \n');

    const totalResults = response.data.pageInfo.totalResults;
    //res.json({ keyword, searchVolume: totalResults });
   res.write('\n\n');
    res.write(totalResults+' results are present on the youtube related to '+keyword);
    res.write('all the video links related to the '+keyword+' \n');

    for(let i=0;i<(response.data.items).length;i++)
    {
      res.write('\n\n')
      let link='https://www.youtube.com/watch?v='+response.data.items[i].id.videoId;
      res.write(i+1+' video '+link);
      res.write('\n');
    }

    res.send();
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'An error occurred' });
  }

});

// Start the server
const port = 3000; // Choose any port number you prefer
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
