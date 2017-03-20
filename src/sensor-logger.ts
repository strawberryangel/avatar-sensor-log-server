const debug = require('debug')('app:logger')

import { IAvatarSensorReading } from '@blackpaw/avatar-sensor'

export interface ISensorLogger {
    add(sensorReading: IAvatarSensorReading): void
}

export class SensorLogger {
    private sensorlog: any
    constructor(private connection: any) {
        this.sensorlog = this.connection.collection("sensorlog")
    }

    public add = (sensorReading: IAvatarSensorReading): void => {
        if (sensorReading == null) {
            debug('Logger received a null object. Skipping.')
            return
        }

        // Need to turn some JSON-encoded data back into objects.
        this.unflatten(sensorReading)

        debug('Received sensor reading: ', sensorReading)
        debug('Attemtping to insert into the database.')
        this.sensorlog.insert(sensorReading, (error) => {
            if (error)
                console.error(
                    'Failed to insert into sensor log: ', error, sensorReading
                )
        })
    }

    private unflatten = (reading: IAvatarSensorReading): void => {
        if (reading && typeof reading.when === 'string')
            reading.when = new Date(reading.when)
    }
}
