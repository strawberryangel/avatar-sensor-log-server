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
//Connect to notification bus and the database.
//
////////////////////////////////////////////////////////////////////////////////

import { NotificationBusClient } from '@blackpaw/notification-bus'
const notificationBus = new NotificationBusClient()

mongo.MongoClient.connect(databaseUri, (err, connection) => {
    if (err) {
        console.error("Cannot connect to the database: ", err)
        return
    }

    debug("Connected to the database at " + databaseUri)

    // Create sensor logger and send all incoming sensor reading to it.
    sensorLogger = new SensorLogger(connection)
    notificationBus.observable
        .filter((x) => x.avatarSensorReading != null)
        .map((x) => x.avatarSensorReading)
        .subscribe((sensorReading) => sensorLogger.add(sensorReading))
})
