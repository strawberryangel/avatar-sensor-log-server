const debug = require('debug')('app:logger')

import { IAvatarSensorReading } from '@blackpaw/avatar-sensor'

export interface ISensorLogger {
    add(json: string): void
}

export class SensorLogger {
    private sensorlog: any
    constructor(private connection: any) {
        this.sensorlog = this.connection.collection("sensorlog")
    }

    public add = (json: string): void => {
        if (!json) {
            debug('Logger received an empty string. Skipping.')
            return
        }

        // Need to turn some JSON-encoded data back into objects.
        let sensorReading: IAvatarSensorReading = this.unflatten(json)
        if (!sensorReading) return

        debug('Received sensor reading: ', sensorReading)
        debug('Attemtping to insert into the database.')
        this.sensorlog.insert(sensorReading, (error) => {
            if (error)
                console.error(
                    'Failed to insert into sensor log: ', error, sensorReading
                )
        })
    }

    private unflatten = (json: string): IAvatarSensorReading => {
        let result: IAvatarSensorReading
        try {
            result = JSON.parse(json)
        } catch (error) {
            console.error(`Logger can't parse string: `, error, json)
            debug(`Logger can't parse string: `, error, json)
            return null
        }

        if (typeof result !== 'object') {
            console.error(`Received a non-object of type ${typeof result}.`, result)
            debug(`Received a non-object of type ${typeof result}.`, result)
            return null
        }

        if (result && typeof result.when === 'string')
            result.when = new Date(result.when)

        return result
    }
}
