const debug = require('debug')('app:logger')

import { IAvatarSensorReading } from '@blackpaw/avatar-sensor'

export interface ISensorLogger {
    add(sensorReading: IAvatarSensorReading): void
}

export class SensorLogger {
    private sensorlog: any
    constructor(databaseConnection: any) {
        this.sensorlog = databaseConnection.collection('sensorlog')
    }

    public add = (sensorReading: IAvatarSensorReading): void => {
        if (!sensorReading) {
            debug('Logger received an empty string. Skipping.')
            return
        }

        debug('Received sensor reading: ', sensorReading)
        debug('Attemtping to insert into the database.')
        this.sensorlog.insert(sensorReading, handleInsertResult)

        function handleInsertResult(error: any): void {
            if (error) {
                debug('Failed to insert record: ', error)
                console.error('Failed to insert record: ', error, sensorReading)
            }
            else
                debug('Successfully inserted record.')
        }
    }
}

