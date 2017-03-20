const debug = require('debug')('app:json')

import { IAvatarSensorReading } from '@blackpaw/avatar-sensor'

export function jsonToSensorReading(json: string): IAvatarSensorReading {
    let result: IAvatarSensorReading
    try {
        result = JSON.parse(json)
    } catch (error) {
        console.error(`Deserializer can't parse string: `, error, json)
        debug(`Deserializer can't parse string: `, error, json)
        return null
    }

    if (result == null) {
        debug('Received an empty object. Skipping.')
        return null
    }

    if (typeof result !== 'object') {
        debug(`Deserializer expected to receive an object but received a ${typeof result}.`, result)
        return null
    }

    // Convert when to a Date object.
    if (typeof result.when === 'string')
        result.when = new Date(result.when)

    return result
}
