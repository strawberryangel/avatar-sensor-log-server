const debug = require('debug')('app:main')
const mongo = require('mongodb')
const nconf = require('nconf')

import { RelayChannel } from '@blackpaw/avatar-sensor'
import { ISubscriber, Subscriber } from '@blackpaw/pubsub'
import { ISensorLogger, SensorLogger } from './sensor-logger'

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
let subscriber: ISubscriber

function startupLogger(err, connection) {
    if (err) {
        console.error("Cannot connect to the database: ", err)
        return
    }

    debug("Connected to the database at " + databaseUri)

    // Create sensor logger and send all incoming sensor reading to it.
    sensorLogger = new SensorLogger(connection)
    subscriber = new Subscriber(RelayChannel)

    subscriber.observable
        .subscribe((sensorReading) => sensorLogger.add(sensorReading))
}
