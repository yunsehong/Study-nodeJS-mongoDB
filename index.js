var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var MongoClient = require('mongodb').MongoClient;
var connection = "mongodb://localhost:27017";
// Connection URI
var uri = "mongodb+srv://lexie:coldplay7878@cluster0.znjtj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// Create a new MongoClient
var client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var fs = require('fs');
function connectDb() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, , 3, 5]);
                    // Connect the client to the database
                    return [4 /*yield*/, client.connect()];
                case 1:
                    // Connect the client to the database
                    _a.sent();
                    return [4 /*yield*/, client.db("lexie").command({ ping: 1 })];
                case 2:
                    _a.sent();
                    console.log("Connected successfully to server");
                    return [3 /*break*/, 5];
                case 3: 
                // Ensures that the client will close when you finish/error
                return [4 /*yield*/, client.close()];
                case 4:
                    // Ensures that the client will close when you finish/error
                    _a.sent();
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// 1. read file (csv)
var readCsv = function (text) {
    var data = fs.readFileSync(text, 'utf-8');
    // console.log('data',data);
    return data;
};
// 2 - convert file to array
//const merLocationData = readCsv('./merchantslocations.csv');
function csvToArray(file, separator) {
    if (separator === void 0) { separator = ","; }
    var _a = file.split("\n"), headersString = _a[0], lines = _a.slice(1);
    var headers = headersString.split(separator);
    var result = lines.map(function (lineString) {
        var values = lineString.split(separator);
        var el = headers.reduce(function (object, header, index) {
            if (!header.includes('.')) {
                object[header] = values[index];
            }
            // console.log('object',object);
            return object;
        }, {});
        // console.log('el',el);
        return el;
    });
    // console.log('result', result);
    return result;
}
// 3 - bulk insert into mongodb
function insertingData(arrData) {
    return __awaiter(this, void 0, void 0, function () {
        var testCollection, bulk3, bulk3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, , 5, 7]);
                    return [4 /*yield*/, client.connect()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, client.db("restaurant").collection('location')];
                case 2:
                    testCollection = _a.sent();
                    bulk3 = testCollection.initializeUnorderedBulkOp();
                    arrData.forEach(function (element) {
                        // bulk3.find({_id:'609ce32cd477b9020367a495'}).upsert().updateOne({$set:{restaurantPhone:'12341234'}});  
                        // -> _id 일치 행 있음 => updated
                        bulk3.find({ _id: 'leaveTheDoorOpen' }).upsert().updateOne({ $set: {
                                restaurantPhone: '12341234',
                                restaurantDisplayName: 'Bruno Mars Bar'
                            } });
                        /*
                          -> _id 일치 행 없음 => insert
                          _id: "leaveTheDoorOpen"
                          restaurantPhone: "12341234"
                        */
                        console.log('upsert');
                    });
                    return [4 /*yield*/, bulk3.execute()];
                case 3:
                    _a.sent();
                    bulk3 = testCollection.initializeUnorderedBulkOp();
                    arrData.forEach(function (element) {
                        // bulk3.find({_id:'leaveTheDoorOpen'}).delete();
                        // console.log('deleted');
                        // update key to null
                        bulk3.find({ _id: 'leaveTheDoorOpen' }).update({ $unset: { restaurantPhone: "" } });
                        console.log('unset');
                    });
                    return [4 /*yield*/, bulk3.execute()];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, client.close()];
                case 6:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var locationData, csvArr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connectDb()];
                case 1:
                    _a.sent();
                    locationData = readCsv('./locations.csv');
                    csvArr = csvToArray(locationData);
                    return [4 /*yield*/, insertingData(csvArr.slice(0, 3))];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
run()["catch"](console.dir);
