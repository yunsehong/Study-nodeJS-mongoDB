const { MongoClient } = require('mongodb');
const connection = "mongodb://localhost:27017";
// Connection URI
const uri =
  "mongodb+srv://lexie:coldplay7878@cluster0.znjtj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// Create a new MongoClient
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const fs = require('fs');


async function connectDb() {
  try {
    // Connect the client to the database
    await client.connect();
    await client.db("lexie").command({ ping: 1 }); 
    console.log("Connected successfully to server");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}



// 1. read file (csv)
const readCsv = (text: string): string => {
  const data = fs.readFileSync(text,'utf-8');
 // console.log('data',data);
  return data;
}

// 2 - convert file to array
 
//const merLocationData = readCsv('./merchantslocations.csv');

function csvToArray(file, separator=","){
   const [headersString, ...lines] = file.split("\n");
   const headers = headersString.split(separator);
   
   const result = lines.map((lineString) => {
      const values = lineString.split(separator);
      const el = headers.reduce(function(object, header, index){
        if(!header.includes('.')){
          object[header] = values[index];
        }
       // console.log('object',object);
        return object;
      },{});
     // console.log('el',el);
      return el;
   })
   // console.log('result', result);
   return result;
}


// 3 - bulk insert into mongodb
async function insertingData(arrData) {
  try {
    await client.connect();
    const testCollection = await client.db("restaurant").collection('location');
   // await testCollection.deleteMany({});  // will remove everything

    
    // insert 
    // var bulk = testCollection.initializeUnorderedBulkOp();
    // arrData.forEach(element => {
    //   //console.log('element',element);
    //   bulk.insert( element );
    // });
    // await bulk.execute();

    // update
    // var bulk2 = testCollection.initializeUnorderedBulkOp();
    // arrData.forEach(element => {
    //   bulk2.find({_id:'609ce32cd477b9020367a495'}).updateOne({$set: {restaurantDisplayName:'Lexie Bar'}});
    //   console.log('updated');
    // });
    // await bulk2.execute();

    // upsert 
    var bulk3 = testCollection.initializeUnorderedBulkOp();
    arrData.forEach(element => {
     // bulk3.find({_id:'609ce32cd477b9020367a495'}).upsert().updateOne({$set:{restaurantPhone:'12341234'}});  
      // -> _id 일치 행 있음 => updated
      bulk3.find({_id:'leaveTheDoorOpen'}).upsert().updateOne(
        {$set:{
              restaurantPhone:'12341234',
              restaurantDisplayName:'Bruno Mars Bar'}});
      /*
        -> _id 일치 행 없음 => insert
        _id: "leaveTheDoorOpen"
        restaurantPhone: "12341234"
      */
      console.log('upsert');
    });
    await bulk3.execute();

    // remove
    var bulk3 = testCollection.initializeUnorderedBulkOp();
    arrData.forEach(element => {
      // bulk3.find({_id:'leaveTheDoorOpen'}).delete();
      // console.log('deleted');

      // update key to null
      bulk3.find({_id:'leaveTheDoorOpen'}).update({$unset:{restaurantPhone:""}});
      console.log('unset');
      // -> restaurantPhone key만 삭제됨
      
    });
    await bulk3.execute();
  } finally {
    await client.close();
  }
} 


async function run(){
  await connectDb(); 
  const locationData = readCsv('./locations.csv');
  const csvArr = csvToArray(locationData);
  await insertingData(csvArr.slice(0,3));

}

run().catch(console.dir);











