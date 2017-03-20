const debug = require('debug')('app:main')
const mongo = require('mongodb')
const nconf = require('nconf')

import { jsonToSensorReading } from './json-to-sensor-reading'
import { RelayChannel } from '@blackpaw/avatar-sensor'
import { ISensorLogger, SensorLogger } from './sensor-logger'
import { ISubscriber, Subscriber } from '@blackpaw/pubsub'

////////////////////////////////////////////////////////////////////////////////
//
//  Configuration
//
////////////////////////////////////////////////////////////////////////////////

nconf.argv().env().defaults({
    'database': 'mongodb://localhost/sl'
})

const databaseUri = nconf.get('database')
mongo.MongoClient.connect(databaseUri, startupLogger)

////////////////////////////////////////////////////////////////////////////////
//
//Connect to the pub/sub system and the database.
//
////////////////////////////////////////////////////////////////////////////////

let sensorLogger: ISensorLogger
let incomingSensorReadings: ISubscriber

function startupLogger(err, connection) {
    if (err) {
        debug("Cannot connect to the database: ", err)
        console.error("Cannot connect to the database: ", err)
        return
    }

    debug("Connected to the database: ", databaseUri)

    // Create sensor logger and send all incoming sensor reading to it.
    sensorLogger = new SensorLogger(connection)
    incomingSensorReadings = new Subscriber(RelayChannel)

    // Convert incoming JSON to sensor readings and log them. 
    incomingSensorReadings.observable
        .map(json => jsonToSensorReading(json))
        .filter(x => x != null)
        .subscribe((sensorReading) => sensorLogger.add(sensorReading))
}

