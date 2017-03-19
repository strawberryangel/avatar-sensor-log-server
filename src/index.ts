const debug = require('debug')('app:main')
const mongo = require('mongodb')
const nconf = require('nconf')

////////////////////////////////////////////////////////////////////////////////
//
//  Configuration
//
////////////////////////////////////////////////////////////////////////////////

nconf.argv().env().defaults({
    'database': 'mongodb://localhost/sl'
})

const databaseUri = nconf.get('database')

////////////////////////////////////////////////////////////////////////////////
//
//  Place holder for the sensor logger.
//
////////////////////////////////////////////////////////////////////////////////

import { SensorLogger } from './sensor-logger'
let sensorLogger: SensorLogger

////////////////////////////////////////////////////////////////////////////////
//
//Connect to the pub/sub system and the database.
//
////////////////////////////////////////////////////////////////////////////////

import { RelayChannel } from '@blackpaw/avatar-sensor'
import { ISubscriber, Subscriber } from '@blackpaw/pubsub'

let subscriber: ISubscriber

mongo.MongoClient.connect(databaseUri, (err, connection) => {
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
})
